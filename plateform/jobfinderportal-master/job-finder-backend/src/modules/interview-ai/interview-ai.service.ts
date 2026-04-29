import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as http from 'http';
import * as https from 'https';

import {
  InterviewSession,
  TranscriptEntry,
  EmotionEntry,
} from '../../entities/interview-session.entity';
import {
  StartInterviewDto,
  ChatDto,
  TranscribeDto,
  EmotionDto,
  CompleteInterviewDto,
  RecordEmotionDto,
} from '../../dtos/interview-ai.dto';

const execFileAsync = promisify(execFile);

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const SCRIPTS_DIR = path.join(__dirname, '..', '..', '..', 'scripts');

@Injectable()
export class InterviewAIService {
  constructor(
    @InjectRepository(InterviewSession)
    private sessionRepository: Repository<InterviewSession>,
  ) {}

  async startSession(dto: StartInterviewDto): Promise<InterviewSession> {
    const session = this.sessionRepository.create({
      jobRole: dto.jobRole,
      candidateName: dto.candidateName,
      transcript: [],
      emotions: [],
      status: 'active',
    });
    return this.sessionRepository.save(session);
  }

  async chat(dto: ChatDto): Promise<{ reply: string; sessionId: string }> {
    const session = await this.findActiveSession(dto.sessionId);

    const systemPrompt = this.buildSystemPrompt(session.jobRole);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...session.transcript.map((t) => ({
        role: t.role === 'HR Manager' ? 'assistant' : 'user',
        content: t.content,
      })),
      { role: 'user', content: dto.message },
    ];

    const reply = await this.callOllama(messages);

    const now = new Date().toISOString();
    const updatedTranscript: TranscriptEntry[] = [
      ...session.transcript,
      { role: 'Candidate', content: dto.message, timestamp: now },
      { role: 'HR Manager', content: reply, timestamp: now },
    ];

    await this.sessionRepository.update(session.id, {
      transcript: updatedTranscript,
    });

    return { reply, sessionId: session.id };
  }

  async transcribe(dto: TranscribeDto): Promise<{ text: string }> {
    const session = await this.findActiveSession(dto.sessionId);
    void session;

    const audioBuffer = Buffer.from(dto.audioBase64, 'base64');
    const tmpFile = path.join(os.tmpdir(), `audio_${Date.now()}.wav`);

    try {
      fs.writeFileSync(tmpFile, audioBuffer);

      const scriptPath = path.join(SCRIPTS_DIR, 'transcribe.py');
      const { stdout } = await execFileAsync('python3', [scriptPath, tmpFile]);
      const result = JSON.parse(stdout.trim()) as { text?: string };
      return { text: result.text ?? '' };
    } catch (err) {
      throw new Error(`Transcription failed: ${(err as Error).message}`);
    } finally {
      try {
        fs.unlinkSync(tmpFile);
      } catch {
        // ignore cleanup errors
      }
    }
  }

  async detectEmotion(
    dto: EmotionDto,
  ): Promise<{ emotion: string; confidence: number }> {
    const session = await this.findActiveSession(dto.sessionId);

    const imgBuffer = Buffer.from(dto.imageBase64, 'base64');
    const tmpFile = path.join(os.tmpdir(), `frame_${Date.now()}.jpg`);

    try {
      fs.writeFileSync(tmpFile, imgBuffer);

      const scriptPath = path.join(SCRIPTS_DIR, 'detect_emotion.py');
      const { stdout } = await execFileAsync('python3', [scriptPath, tmpFile]);
      const parsed: unknown = JSON.parse(stdout.trim());
      const result = parsed as { emotion: string; confidence: number };

      const emotionEntry: EmotionEntry = {
        emotion: result.emotion,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
      };

      const updatedEmotions = [...(session.emotions || []), emotionEntry];
      await this.sessionRepository.update(session.id, {
        emotions: updatedEmotions,
      });

      return { emotion: result.emotion, confidence: result.confidence };
    } catch (err) {
      throw new Error(`Emotion detection failed: ${(err as Error).message}`);
    } finally {
      try {
        fs.unlinkSync(tmpFile);
      } catch {
        // ignore cleanup errors
      }
    }
  }

  async recordEmotion(dto: RecordEmotionDto): Promise<{ success: boolean }> {
    const session = await this.findActiveSession(dto.sessionId);

    const emotionEntry: EmotionEntry = {
      emotion: dto.emotion,
      confidence: dto.confidence,
      timestamp: new Date().toISOString(),
    };

    const updatedEmotions = [...(session.emotions || []), emotionEntry];
    await this.sessionRepository.update(session.id, {
      emotions: updatedEmotions,
    });

    return { success: true };
  }

  async completeInterview(
    dto: CompleteInterviewDto,
  ): Promise<InterviewSession> {
    const session = await this.findActiveSession(dto.sessionId);

    const transcriptText = session.transcript
      .map((t) => `${t.role}: ${t.content}`)
      .join('\n');

    const resumeSystemPrompt = `You are a professional resume-building assistant.
JOB ROLE APPLIED FOR: ${session.jobRole}

INTERVIEW TRANSCRIPT:
"""
${transcriptText.slice(0, 4000)}
"""

YOUR GOAL:
Using ONLY the interview transcript provided above, extract all relevant information and generate a complete professional resume JSON.
Do NOT ask the candidate any questions. Extract everything directly from the provided transcript.

Output the final resume as a JSON object in this EXACT format:
[RESUME_JSON]
{
  "candidate_name": "",
  "job_role_applied": "",
  "professional_summary": "",
  "skills": [],
  "work_experience": [],
  "education": [],
  "interview_highlights": {
    "strengths_observed": "",
    "recommendation": ""
  }
}
[/RESUME_JSON]

After the JSON, end with: [RESUME COMPLETE]`;

    const messages = [
      { role: 'system', content: resumeSystemPrompt },
      { role: 'user', content: 'Please generate the resume JSON now.' },
    ];

    const response = await this.callOllama(messages);
    const resume = this.extractResumeJson(response);

    await this.sessionRepository.update(session.id, {
      status: 'completed',
      resume: resume ?? {},
    });

    return this.sessionRepository.findOne({
      where: { id: session.id },
    }) as Promise<InterviewSession>;
  }

  async getHistory(): Promise<InterviewSession[]> {
    return this.sessionRepository.find({
      order: { createdAt: 'DESC' },
      select: [
        'id',
        'jobRole',
        'candidateName',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async getSession(sessionId: string): Promise<InterviewSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    return session;
  }

  private async findActiveSession(
    sessionId: string,
  ): Promise<InterviewSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }
    return session;
  }

  private buildSystemPrompt(jobRole: string): string {
    return `You are an experienced, professional HR manager conducting a job interview.

ROLE BEING INTERVIEWED FOR: ${jobRole}

INSTRUCTIONS:
- Conduct a structured interview with 6-8 questions relevant to the "${jobRole}" position.
- Ask ONE question at a time, then wait for the candidate's response.
- Start with a warm greeting and ask the candidate to introduce themselves.
- Mix behavioral questions, technical questions, and situational questions.
- After each candidate answer, briefly acknowledge their answer then ask the next question.
- After the last question, provide a brief evaluation summary covering:
  - Communication skills, relevant experience, strengths, areas for improvement
  - Overall recommendation (Strongly Recommend / Recommend / Consider / Do Not Recommend)
- When you give the final evaluation, end your message with the exact phrase: [INTERVIEW COMPLETE]`;
  }

  private callOllama(
    messages: Array<{ role: string; content: string }>,
  ): Promise<string> {
    const payload = {
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    };

    return new Promise((resolve) => {
      const client: typeof http | typeof https = OLLAMA_URL.startsWith('https')
        ? https
        : http;
      const url = new URL(OLLAMA_URL);
      const body = JSON.stringify(payload);

      const options: http.RequestOptions = {
        hostname: url.hostname,
        port: url.port || (OLLAMA_URL.startsWith('https') ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const req = client.request(options, (res: http.IncomingMessage) => {
        let data = '';

        res.on('data', (chunk: Buffer) => {
          data += chunk.toString();
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data) as {
              message?: { content?: string };
            };
            resolve(parsed?.message?.content?.trim() ?? '');
          } catch {
            resolve('ERROR: Could not parse Ollama response');
          }
        });
      });

      req.on('error', (err: Error) => {
        resolve(`ERROR: Cannot connect to Ollama — ${err.message}`);
      });

      req.setTimeout(120000, () => {
        req.destroy();
        resolve('ERROR: Ollama request timed out');
      });

      req.write(body);
      req.end();
    });
  }

  private extractResumeJson(text: string): object | null {
    const match =
      /\[RESUME_JSON\]([\s\S]*?)(?:\[\/RESUME_JSON\]|\[RESUME COMPLETE\])/.exec(
        text,
      );
    if (match) {
      try {
        return JSON.parse(match[1].trim()) as object;
      } catch {
        // fall through
      }
    }
    return null;
  }
}

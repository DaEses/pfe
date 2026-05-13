import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotCandidate } from '../../entities/chatbot-candidate.entity';
import { ChatbotInterview } from '../../entities/chatbot-interview.entity';
import { ChatbotQuestion } from '../../entities/chatbot-question.entity';
import {
  StartChatbotInterviewDto,
  AddQuestionAnswerDto,
  CompleteChatbotInterviewDto,
} from '../../dtos/chatbot-interview.dto';

@Injectable()
export class ChatbotInterviewService {
  constructor(
    @InjectRepository(ChatbotCandidate)
    private candidateRepository: Repository<ChatbotCandidate>,
    @InjectRepository(ChatbotInterview)
    private interviewRepository: Repository<ChatbotInterview>,
    @InjectRepository(ChatbotQuestion)
    private questionRepository: Repository<ChatbotQuestion>,
  ) {}

  async startInterview(dto: StartChatbotInterviewDto): Promise<ChatbotInterview> {
    // Get or create candidate
    let candidate = await this.candidateRepository.findOne({
      where: { email: dto.email },
    });

    if (!candidate) {
      candidate = this.candidateRepository.create({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        jobRole: dto.jobRole,
        resumeText: dto.resumeText,
      });
      candidate = await this.candidateRepository.save(candidate);
    } else {
      // Update candidate info if they restart interview
      Object.assign(candidate, {
        name: dto.name,
        phone: dto.phone,
        jobRole: dto.jobRole,
        resumeText: dto.resumeText,
      });
      candidate = await this.candidateRepository.save(candidate);
    }

    // Create new interview session
    const interview = this.interviewRepository.create({
      candidateId: candidate.id,
      candidate,
      jobRole: dto.jobRole,
      status: 'in_progress',
    });

    return this.interviewRepository.save(interview);
  }

  async addAnswer(interviewId: string, dto: AddQuestionAnswerDto): Promise<ChatbotQuestion> {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${interviewId} not found`);
    }

    if (interview.status !== 'in_progress') {
      throw new BadRequestException('Cannot add answer to a completed or abandoned interview');
    }

    const question = this.questionRepository.create({
      interviewId,
      interview,
      questionText: dto.questionText,
      answerText: dto.answerText,
      orderIndex: dto.orderIndex,
      score: dto.score,
    });

    return this.questionRepository.save(question);
  }

  async completeInterview(
    interviewId: string,
    dto: CompleteChatbotInterviewDto,
  ): Promise<ChatbotInterview> {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${interviewId} not found`);
    }

    interview.status = 'completed';
    interview.completedAt = new Date();
    if (dto.averageScore !== undefined) {
      interview.averageScore = dto.averageScore;
    }
    if (dto.summary !== undefined) {
      interview.summary = dto.summary;
    }
    if (dto.recommendation !== undefined) {
      interview.recommendation = dto.recommendation as 'strongly_recommend' | 'recommend' | 'consider' | 'do_not_recommend';
    }

    return this.interviewRepository.save(interview);
  }

  async getInterview(interviewId: string): Promise<ChatbotInterview> {
    const interview = await this.interviewRepository.findOne({
      where: { id: interviewId },
      relations: ['candidate', 'questions'],
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${interviewId} not found`);
    }

    // Sort questions by orderIndex
    if (interview.questions) {
      interview.questions.sort((a, b) => a.orderIndex - b.orderIndex);
    }

    return interview;
  }

  async listInterviews(
    candidateEmail?: string,
    status?: string,
    jobRole?: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ data: ChatbotInterview[]; total: number }> {
    const query = this.interviewRepository.createQueryBuilder('interview');

    if (candidateEmail) {
      query.leftJoinAndSelect('interview.candidate', 'candidate');
      query.where('candidate.email = :email', { email: candidateEmail });
    } else {
      query.leftJoinAndSelect('interview.candidate', 'candidate');
    }

    if (status) {
      query.andWhere('interview.status = :status', { status });
    }

    if (jobRole) {
      query.andWhere('interview.jobRole = :jobRole', { jobRole });
    }

    query.leftJoinAndSelect('interview.questions', 'questions');
    query.orderBy('interview.createdAt', 'DESC');

    const total = await query.getCount();
    const data = await query.skip(offset).take(limit).getMany();

    // Sort questions within each interview
    data.forEach((interview) => {
      if (interview.questions) {
        interview.questions.sort((a, b) => a.orderIndex - b.orderIndex);
      }
    });

    return { data, total };
  }

  async getCandidateByEmail(email: string): Promise<ChatbotCandidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { email },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with email ${email} not found`);
    }

    return candidate;
  }

  async getCandidateInterviews(
    candidateEmail: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<{ data: ChatbotInterview[]; total: number }> {
    return this.listInterviews(candidateEmail, undefined, undefined, limit, offset);
  }
}

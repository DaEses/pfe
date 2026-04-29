import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InterviewAIService } from './interview-ai.service';
import {
  StartInterviewDto,
  ChatDto,
  TranscribeDto,
  EmotionDto,
  RecordEmotionDto,
  CompleteInterviewDto,
} from '../../dtos/interview-ai.dto';

@Controller('interview-ai')
export class InterviewAIController {
  constructor(private readonly interviewAIService: InterviewAIService) {}

  @Post('start')
  start(@Body() dto: StartInterviewDto) {
    return this.interviewAIService.startSession(dto);
  }

  @Post('chat')
  chat(@Body() dto: ChatDto) {
    return this.interviewAIService.chat(dto);
  }

  @Post('transcribe')
  transcribe(@Body() dto: TranscribeDto) {
    return this.interviewAIService.transcribe(dto);
  }

  @Post('emotion')
  detectEmotion(@Body() dto: EmotionDto) {
    return this.interviewAIService.detectEmotion(dto);
  }

  @Post('emotion/record')
  recordEmotion(@Body() dto: RecordEmotionDto) {
    return this.interviewAIService.recordEmotion(dto);
  }

  @Post('complete')
  complete(@Body() dto: CompleteInterviewDto) {
    return this.interviewAIService.completeInterview(dto);
  }

  @Get('history')
  getHistory() {
    return this.interviewAIService.getHistory();
  }

  @Get('session/:id')
  getSession(@Param('id') id: string) {
    return this.interviewAIService.getSession(id);
  }
}

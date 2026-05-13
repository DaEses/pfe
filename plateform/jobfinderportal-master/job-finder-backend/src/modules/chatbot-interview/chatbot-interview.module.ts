import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotCandidate } from '../../entities/chatbot-candidate.entity';
import { ChatbotInterview } from '../../entities/chatbot-interview.entity';
import { ChatbotQuestion } from '../../entities/chatbot-question.entity';
import { ChatbotInterviewService } from './chatbot-interview.service';
import { ChatbotInterviewController } from './chatbot-interview.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatbotCandidate, ChatbotInterview, ChatbotQuestion])],
  controllers: [ChatbotInterviewController],
  providers: [ChatbotInterviewService],
  exports: [ChatbotInterviewService],
})
export class ChatbotInterviewModule {}

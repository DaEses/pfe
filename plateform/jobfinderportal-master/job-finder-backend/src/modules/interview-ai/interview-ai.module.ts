import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewAIController } from './interview-ai.controller';
import { InterviewAIService } from './interview-ai.service';
import { InterviewSession } from '../../entities/interview-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSession])],
  controllers: [InterviewAIController],
  providers: [InterviewAIService],
  exports: [InterviewAIService],
})
export class InterviewAIModule {}

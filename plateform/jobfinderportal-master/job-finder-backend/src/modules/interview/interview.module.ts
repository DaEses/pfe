import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { Interview } from '../../entities/interview.entity';
import { Application } from '../../entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, Application])],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}

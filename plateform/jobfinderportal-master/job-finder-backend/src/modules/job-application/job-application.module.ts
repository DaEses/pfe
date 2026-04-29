import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from '../../entities/job-application.entity';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplication])],
  providers: [JobApplicationService],
  controllers: [JobApplicationController],
  exports: [JobApplicationService],
})
export class JobApplicationModule {}

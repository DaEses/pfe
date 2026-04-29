import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Application } from '../../entities/application.entity';
import { JobPosting } from '../../entities/job-posting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, JobPosting])],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}

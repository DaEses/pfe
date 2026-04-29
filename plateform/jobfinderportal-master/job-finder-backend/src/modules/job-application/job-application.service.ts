import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplication } from '../../entities/job-application.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private jobApplicationRepository: Repository<JobApplication>,
  ) {}

  async createApplication(
    jobSeekerId: string,
    jobPostingId: string,
    coverLetter?: string,
  ) {
    const existingApp = await this.jobApplicationRepository.findOne({
      where: { jobSeekerId, jobPostingId },
    });

    if (existingApp) {
      throw new Error('You have already applied for this job');
    }

    const app = this.jobApplicationRepository.create({
      jobSeekerId,
      jobPostingId,
      coverLetter,
      status: 'applied',
    });

    return this.jobApplicationRepository.save(app);
  }

  async getMyApplications(jobSeekerId: string) {
    return this.jobApplicationRepository.find({
      where: { jobSeekerId },
      relations: ['jobPosting', 'jobPosting.postedBy'],
      order: { appliedAt: 'DESC' },
    });
  }

  async getApplicationById(id: string, jobSeekerId: string) {
    return this.jobApplicationRepository.findOne({
      where: { id, jobSeekerId },
      relations: ['jobPosting', 'jobPosting.postedBy'],
    });
  }

  async withdrawApplication(id: string, jobSeekerId: string) {
    const app = await this.getApplicationById(id, jobSeekerId);
    if (!app) {
      throw new Error('Application not found');
    }

    app.status = 'withdrawn';
    return this.jobApplicationRepository.save(app);
  }
}

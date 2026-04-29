import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../entities/application.entity';
import { JobPosting } from '../../entities/job-posting.entity';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from '../../dtos/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(JobPosting)
    private jobPostingRepository: Repository<JobPosting>,
  ) {}

  async create(
    jobPostingId: string,
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const jobPosting = await this.jobPostingRepository.findOne({
      where: { id: jobPostingId, status: 'active' },
    });

    if (!jobPosting) {
      throw new BadRequestException(
        'Job posting is not active or does not exist',
      );
    }

    // Check if applicant already applied for this job
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        applicantEmail: createApplicationDto.applicantEmail,
        jobPostingId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }

    const application = this.applicationRepository.create({
      ...createApplicationDto,
      jobPostingId,
    });

    const savedApplication = await this.applicationRepository.save(application);

    // Increment applicant count
    jobPosting.applicantCount += 1;
    await this.jobPostingRepository.save(jobPosting);

    return savedApplication;
  }

  async findAllForJob(
    jobPostingId: string,
    hrUserId: string,
  ): Promise<Application[]> {
    const jobPosting = await this.jobPostingRepository.findOne({
      where: { id: jobPostingId, postedById: hrUserId },
    });

    if (!jobPosting) {
      throw new NotFoundException('Job posting not found');
    }

    return this.applicationRepository.find({
      where: { jobPostingId },
      relations: ['interviews'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findOne(id: string, hrUserId: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['jobPosting', 'interviews'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    // Verify HR user owns the job posting
    if (application.jobPosting.postedById !== hrUserId) {
      throw new BadRequestException('Unauthorized');
    }

    return application;
  }

  async updateStatus(
    id: string,
    updateDto: UpdateApplicationStatusDto,
    hrUserId: string,
  ): Promise<Application> {
    const application = await this.findOne(id, hrUserId);
    Object.assign(application, updateDto);
    return this.applicationRepository.save(application);
  }

  async remove(id: string, hrUserId: string): Promise<void> {
    const application = await this.findOne(id, hrUserId);
    await this.applicationRepository.remove(application);
  }
}

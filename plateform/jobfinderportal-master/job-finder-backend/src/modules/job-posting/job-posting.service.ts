import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosting } from '../../entities/job-posting.entity';
import {
  CreateJobPostingDto,
  UpdateJobPostingDto,
} from '../../dtos/job-posting.dto';

@Injectable()
export class JobPostingService {
  constructor(
    @InjectRepository(JobPosting)
    private jobPostingRepository: Repository<JobPosting>,
  ) {}

  async create(
    createJobPostingDto: CreateJobPostingDto,
    hrUserId: string,
  ): Promise<JobPosting> {
    const jobPosting = this.jobPostingRepository.create({
      ...createJobPostingDto,
      postedById: hrUserId,
    });
    return this.jobPostingRepository.save(jobPosting);
  }

  async findAll(hrUserId: string): Promise<JobPosting[]> {
    return this.jobPostingRepository.find({
      where: { postedById: hrUserId },
      relations: ['applications'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, hrUserId: string): Promise<JobPosting> {
    const jobPosting = await this.jobPostingRepository.findOne({
      where: { id, postedById: hrUserId },
      relations: ['applications', 'applications.interviews'],
    });

    if (!jobPosting) {
      throw new NotFoundException(`Job posting with ID ${id} not found`);
    }

    return jobPosting;
  }

  async update(
    id: string,
    updateJobPostingDto: UpdateJobPostingDto,
    hrUserId: string,
  ): Promise<JobPosting> {
    const jobPosting = await this.findOne(id, hrUserId);
    Object.assign(jobPosting, updateJobPostingDto);
    return this.jobPostingRepository.save(jobPosting);
  }

  async remove(id: string, hrUserId: string): Promise<void> {
    const jobPosting = await this.findOne(id, hrUserId);
    await this.jobPostingRepository.remove(jobPosting);
  }

  async getApplicants(jobPostingId: string, hrUserId: string) {
    const jobPosting = await this.findOne(jobPostingId, hrUserId);
    return jobPosting.applications;
  }
}

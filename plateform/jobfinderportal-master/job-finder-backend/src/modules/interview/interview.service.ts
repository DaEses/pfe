import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from '../../entities/interview.entity';
import { Application } from '../../entities/application.entity';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
} from '../../dtos/interview.dto';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepository: Repository<Interview>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(
    applicationId: string,
    createInterviewDto: CreateInterviewDto,
    hrUserId: string,
  ): Promise<Interview> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['jobPosting'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.jobPosting.postedById !== hrUserId) {
      throw new BadRequestException('Unauthorized');
    }

    const interview = this.interviewRepository.create({
      ...createInterviewDto,
      applicationId,
      approverId: hrUserId,
      scheduledDateTime: new Date(createInterviewDto.scheduledDateTime),
    });

    return this.interviewRepository.save(interview);
  }

  async findAllScheduledInterviews(hrUserId: string): Promise<Interview[]> {
    return this.interviewRepository.find({
      where: { approverId: hrUserId },
      relations: ['application', 'application.jobPosting'],
      order: { scheduledDateTime: 'ASC' },
    });
  }

  async findByApplicationId(
    applicationId: string,
    hrUserId: string,
  ): Promise<Interview[]> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['jobPosting'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.jobPosting.postedById !== hrUserId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.interviewRepository.find({
      where: { applicationId },
      order: { scheduledDateTime: 'ASC' },
    });
  }

  async findOne(id: string, hrUserId: string): Promise<Interview> {
    const interview = await this.interviewRepository.findOne({
      where: { id },
      relations: ['application', 'application.jobPosting'],
    });

    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }

    if (interview.application.jobPosting.postedById !== hrUserId) {
      throw new BadRequestException('Unauthorized');
    }

    return interview;
  }

  async update(
    id: string,
    updateInterviewDto: UpdateInterviewDto,
    hrUserId: string,
  ): Promise<Interview> {
    const interview = await this.findOne(id, hrUserId);
    Object.assign(interview, updateInterviewDto);
    return this.interviewRepository.save(interview);
  }

  async remove(id: string, hrUserId: string): Promise<void> {
    const interview = await this.findOne(id, hrUserId);
    await this.interviewRepository.remove(interview);
  }

  async getUpcomingInterviews(hrUserId: string): Promise<Interview[]> {
    const now = new Date();
    return this.interviewRepository.find({
      where: { approverId: hrUserId },
      relations: ['application', 'application.jobPosting'],
    });
  }
}

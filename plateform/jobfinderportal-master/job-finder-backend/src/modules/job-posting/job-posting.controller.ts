import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from '../../dtos/job-posting.dto';

@Controller('job-postings')
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Post()
  create(@Body() createJobPostingDto: CreateJobPostingDto) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.jobPostingService.create(createJobPostingDto, hrUserId);
  }

  @Get()
  findAll() {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.jobPostingService.findAll(hrUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.jobPostingService.findOne(id, hrUserId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostingDto: UpdateJobPostingDto) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.jobPostingService.update(id, updateJobPostingDto, hrUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.jobPostingService.remove(id, hrUserId);
  }

  @Get(':id/applicants')
  getApplicants(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.jobPostingService.getApplicants(id, hrUserId);
  }
}

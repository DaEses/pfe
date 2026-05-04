import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { JobPostingService } from './job-posting.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from '../../dtos/job-posting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('job-postings')
@UseGuards(JwtAuthGuard)
export class JobPostingController {
  constructor(private readonly jobPostingService: JobPostingService) {}

  @Post()
  create(@Body() createJobPostingDto: CreateJobPostingDto, @Request() req) {
    const hrUserId = req.user.id;
    return this.jobPostingService.create(createJobPostingDto, hrUserId);
  }

  @Get()
  findAll(@Request() req) {
    const hrUserId = req.user.id;
    return this.jobPostingService.findAll(hrUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.jobPostingService.findOne(id, hrUserId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobPostingDto: UpdateJobPostingDto, @Request() req) {
    const hrUserId = req.user.id;
    return this.jobPostingService.update(id, updateJobPostingDto, hrUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.jobPostingService.remove(id, hrUserId);
  }

  @Get(':id/applicants')
  getApplicants(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.jobPostingService.getApplicants(id, hrUserId);
  }
}

import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';

@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  async createApplication(
    @Body() body: { jobPostingId: string; coverLetter?: string },
    @Request() req,
  ) {
    try {
      const jobSeekerId = (req.user as any)?.id || req.body.jobSeekerId;
      const result = await this.jobApplicationService.createApplication(
        jobSeekerId,
        body.jobPostingId,
        body.coverLetter,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  async getMyApplications(@Request() req) {
    const jobSeekerId = (req.user as any)?.id || req.query.jobSeekerId;
    return this.jobApplicationService.getMyApplications(jobSeekerId);
  }

  @Get(':id')
  async getApplicationById(@Param('id') id: string, @Request() req) {
    const jobSeekerId = (req.user as any)?.id || req.query.jobSeekerId;
    const app = await this.jobApplicationService.getApplicationById(id, jobSeekerId);
    if (!app) {
      return { success: false, message: 'Application not found' };
    }
    return app;
  }

  @Delete(':id')
  async withdrawApplication(@Param('id') id: string, @Request() req) {
    try {
      const jobSeekerId = (req.user as any)?.id || req.body.jobSeekerId;
      const result = await this.jobApplicationService.withdrawApplication(id, jobSeekerId);
      return { success: true, message: 'Application withdrawn', data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

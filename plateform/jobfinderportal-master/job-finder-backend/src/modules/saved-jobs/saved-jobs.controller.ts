import { Controller, Get, Post, Delete, Param, Request } from '@nestjs/common';
import { SavedJobsService } from './saved-jobs.service';

@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post(':jobPostingId')
  async saveJob(@Param('jobPostingId') jobPostingId: string, @Request() req) {
    try {
      const jobSeekerId = (req.user as any)?.id || req.body.jobSeekerId;
      const result = await this.savedJobsService.saveJob(jobSeekerId, jobPostingId);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get()
  async getSavedJobs(@Request() req) {
    const jobSeekerId = (req.user as any)?.id || req.query.jobSeekerId;
    return this.savedJobsService.getSavedJobs(jobSeekerId);
  }

  @Delete(':jobPostingId')
  async unsaveJob(@Param('jobPostingId') jobPostingId: string, @Request() req) {
    try {
      const jobSeekerId = (req.user as any)?.id || req.body.jobSeekerId;
      const result = await this.savedJobsService.unsaveJob(jobSeekerId, jobPostingId);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

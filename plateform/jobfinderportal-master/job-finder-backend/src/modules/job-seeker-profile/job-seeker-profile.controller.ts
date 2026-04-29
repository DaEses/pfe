import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { JobSeekerProfileService } from './job-seeker-profile.service';

@Controller('job-seeker/profile')
export class JobSeekerProfileController {
  constructor(private readonly profileService: JobSeekerProfileService) {}

  @Get()
  async getProfile(@Request() req) {
    const jobSeekerId = req.user?.id || req.query.jobSeekerId;
    return this.profileService.getProfile(jobSeekerId);
  }

  @Patch()
  async updateProfile(@Body() updateDto: any, @Request() req) {
    try {
      const jobSeekerId = req.user?.id || req.body.jobSeekerId;
      const result = await this.profileService.updateProfile(
        jobSeekerId,
        updateDto,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('work-experience')
  async addWorkExperience(@Body() workExp: any, @Request() req) {
    try {
      const jobSeekerId = req.user?.id || req.body.jobSeekerId;
      const result = await this.profileService.addWorkExperience(
        jobSeekerId,
        workExp,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete('work-experience/:id')
  async deleteWorkExperience(@Param('id') id: string, @Request() req) {
    try {
      const jobSeekerId = req.user?.id || req.body.jobSeekerId;
      const result = await this.profileService.deleteWorkExperience(
        jobSeekerId,
        id,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('education')
  async addEducation(@Body() education: any, @Request() req) {
    try {
      const jobSeekerId = req.user?.id || req.body.jobSeekerId;
      const result = await this.profileService.addEducation(
        jobSeekerId,
        education,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Delete('education/:id')
  async deleteEducation(@Param('id') id: string, @Request() req) {
    try {
      const jobSeekerId = req.user?.id || req.body.jobSeekerId;
      const result = await this.profileService.deleteEducation(jobSeekerId, id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

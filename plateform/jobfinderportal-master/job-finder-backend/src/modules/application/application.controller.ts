import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto, UpdateApplicationStatusDto } from '../../dtos/application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobPostingId')
  create(@Param('jobPostingId') jobPostingId: string, @Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    const hrUserId = req.user.id;
    return this.applicationService.create(jobPostingId, createApplicationDto);
  }

  @Get('job/:jobPostingId')
  findAllForJob(@Param('jobPostingId') jobPostingId: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.applicationService.findAllForJob(jobPostingId, hrUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.applicationService.findOne(id, hrUserId);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateApplicationStatusDto, @Request() req) {
    const hrUserId = req.user.id;
    return this.applicationService.updateStatus(id, updateDto, hrUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.applicationService.remove(id, hrUserId);
  }
}

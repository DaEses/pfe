import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto, UpdateInterviewDto } from '../../dtos/interview.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post(':applicationId')
  create(@Param('applicationId') applicationId: string, @Body() createInterviewDto: CreateInterviewDto, @Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.create(applicationId, createInterviewDto, hrUserId);
  }

  @Get()
  findAllScheduled(@Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.findAllScheduledInterviews(hrUserId);
  }

  @Get('upcoming')
  getUpcomingInterviews(@Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.getUpcomingInterviews(hrUserId);
  }

  @Get('application/:applicationId')
  findByApplicationId(@Param('applicationId') applicationId: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.findByApplicationId(applicationId, hrUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.findOne(id, hrUserId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto, @Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.update(id, updateInterviewDto, hrUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const hrUserId = req.user.id;
    return this.interviewService.remove(id, hrUserId);
  }
}

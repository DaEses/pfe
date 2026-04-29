import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import {
  CreateInterviewDto,
  UpdateInterviewDto,
} from '../../dtos/interview.dto';

@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post(':applicationId')
  create(
    @Param('applicationId') applicationId: string,
    @Body() createInterviewDto: CreateInterviewDto,
  ) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.create(
      applicationId,
      createInterviewDto,
      hrUserId,
    );
  }

  @Get()
  findAllScheduled() {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.findAllScheduledInterviews(hrUserId);
  }

  @Get('upcoming')
  getUpcomingInterviews() {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.getUpcomingInterviews(hrUserId);
  }

  @Get('application/:applicationId')
  findByApplicationId(@Param('applicationId') applicationId: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.findByApplicationId(applicationId, hrUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.findOne(id, hrUserId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.update(id, updateInterviewDto, hrUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.interviewService.remove(id, hrUserId);
  }
}

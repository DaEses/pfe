import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from '../../dtos/application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobPostingId')
  create(
    @Param('jobPostingId') jobPostingId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.create(jobPostingId, createApplicationDto);
  }

  @Get('job/:jobPostingId')
  findAllForJob(@Param('jobPostingId') jobPostingId: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.applicationService.findAllForJob(jobPostingId, hrUserId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.applicationService.findOne(id, hrUserId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
  ) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.applicationService.updateStatus(id, updateDto, hrUserId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Add JWT guard and get hrUserId from request
    const hrUserId = 'temp-user-id';
    return this.applicationService.remove(id, hrUserId);
  }
}

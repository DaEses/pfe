import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ChatbotInterviewService } from './chatbot-interview.service';
import {
  StartChatbotInterviewDto,
  AddQuestionAnswerDto,
  CompleteChatbotInterviewDto,
} from '../../dtos/chatbot-interview.dto';

@Controller('chatbot-interviews')
export class ChatbotInterviewController {
  constructor(private readonly chatbotInterviewService: ChatbotInterviewService) {}

  @Post('start')
  startInterview(@Body() startDto: StartChatbotInterviewDto) {
    return this.chatbotInterviewService.startInterview(startDto);
  }

  @Post(':id/answer')
  addAnswer(
    @Param('id') interviewId: string,
    @Body() addAnswerDto: AddQuestionAnswerDto,
  ) {
    return this.chatbotInterviewService.addAnswer(interviewId, addAnswerDto);
  }

  @Post(':id/complete')
  completeInterview(
    @Param('id') interviewId: string,
    @Body() completeDto: CompleteChatbotInterviewDto,
  ) {
    return this.chatbotInterviewService.completeInterview(interviewId, completeDto);
  }

  @Get(':id')
  getInterview(@Param('id') interviewId: string) {
    return this.chatbotInterviewService.getInterview(interviewId);
  }

  @Get()
  listInterviews(
    @Query('candidateEmail') candidateEmail?: string,
    @Query('status') status?: string,
    @Query('jobRole') jobRole?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const pageLimit = limit ? Math.min(parseInt(limit), 100) : 10;
    const pageOffset = offset ? parseInt(offset) : 0;
    return this.chatbotInterviewService.listInterviews(
      candidateEmail,
      status,
      jobRole,
      pageLimit,
      pageOffset,
    );
  }
}

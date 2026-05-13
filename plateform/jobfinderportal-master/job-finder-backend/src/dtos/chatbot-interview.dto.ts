import { IsString, IsEmail, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';

export class StartChatbotInterviewDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  jobRole: string;

  @IsOptional()
  @IsString()
  resumeText?: string;
}

export class AddQuestionAnswerDto {
  @IsString()
  questionText: string;

  @IsString()
  answerText: string;

  @IsNumber()
  @Min(0)
  orderIndex: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  score?: number;
}

export class CompleteChatbotInterviewDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  averageScore?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsIn(['strongly_recommend', 'recommend', 'consider', 'do_not_recommend'])
  recommendation?: string;
}

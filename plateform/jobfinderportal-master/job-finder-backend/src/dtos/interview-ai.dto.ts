import { IsString, IsOptional, IsNumber } from 'class-validator';

export class StartInterviewDto {
  @IsString()
  jobRole: string;

  @IsOptional()
  @IsString()
  candidateName?: string;
}

export class ChatDto {
  @IsString()
  sessionId: string;

  @IsString()
  message: string;
}

export class TranscribeDto {
  @IsString()
  sessionId: string;

  @IsString()
  audioBase64: string;
}

export class EmotionDto {
  @IsString()
  sessionId: string;

  @IsString()
  imageBase64: string;
}

export class RecordEmotionDto {
  @IsString()
  sessionId: string;

  @IsString()
  emotion: string;

  @IsNumber()
  confidence: number;
}

export class CompleteInterviewDto {
  @IsString()
  sessionId: string;
}

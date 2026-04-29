import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateJobPostingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  position: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  salary?: number;

  @IsOptional()
  @IsString()
  status?: 'active' | 'draft';
}

export class UpdateJobPostingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  salary?: number;

  @IsOptional()
  @IsString()
  status?: 'active' | 'closed' | 'draft';
}

import { IsString, IsEmail, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  applicantName: string;

  @IsEmail()
  applicantEmail: string;

  @IsString()
  applicantPhone: string;

  @IsString()
  applicantResume: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}

export class UpdateApplicationStatusDto {
  @IsString()
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

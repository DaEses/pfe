import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JobSeeker } from '../../entities/job-seeker.entity';
import { JobSeekerAuthService } from './job-seeker-auth.service';
import { JobSeekerAuthController } from './job-seeker-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobSeeker]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'job_seeker_secret_key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JobSeekerAuthService],
  controllers: [JobSeekerAuthController],
  exports: [JobSeekerAuthService],
})
export class JobSeekerAuthModule {}

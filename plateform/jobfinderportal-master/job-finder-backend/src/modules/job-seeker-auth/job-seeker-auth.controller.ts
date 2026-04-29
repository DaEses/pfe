import { Controller, Post, Body } from '@nestjs/common';
import { JobSeekerAuthService } from './job-seeker-auth.service';
import { RegisterJobSeekerDto, LoginJobSeekerDto } from '../../dtos/job-seeker.dto';

@Controller('auth/job-seeker')
export class JobSeekerAuthController {
  constructor(private readonly authService: JobSeekerAuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterJobSeekerDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginJobSeekerDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }
}

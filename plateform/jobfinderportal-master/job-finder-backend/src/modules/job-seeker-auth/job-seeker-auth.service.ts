import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JobSeeker } from '../../entities/job-seeker.entity';
import { RegisterJobSeekerDto, LoginJobSeekerDto } from '../../dtos/job-seeker.dto';

@Injectable()
export class JobSeekerAuthService {
  constructor(
    @InjectRepository(JobSeeker)
    private jobSeekerRepository: Repository<JobSeeker>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterJobSeekerDto) {
    const { email, password, firstName, lastName, phone, bio, skills } = registerDto;

    // Check if user already exists
    const existingSeeker = await this.jobSeekerRepository.findOne({
      where: { email },
    });

    if (existingSeeker) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new job seeker
    const jobSeeker = this.jobSeekerRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      bio,
      skills: skills || [],
      workExperience: [],
      education: [],
    });

    const savedSeeker = await this.jobSeekerRepository.save(jobSeeker);

    // Generate JWT token
    const token = this.jwtService.sign(
      { id: savedSeeker.id, email: savedSeeker.email, type: 'jobseeker' },
      { expiresIn: '7d' },
    );

    return {
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: savedSeeker.id,
        email: savedSeeker.email,
        firstName: savedSeeker.firstName,
        lastName: savedSeeker.lastName,
      },
    };
  }

  async login(loginDto: LoginJobSeekerDto) {
    const { email, password } = loginDto;

    // Find user by email
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { email },
    });

    if (!jobSeeker) {
      throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, jobSeeker.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign(
      { id: jobSeeker.id, email: jobSeeker.email, type: 'jobseeker' },
      { expiresIn: '7d' },
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: jobSeeker.id,
        email: jobSeeker.email,
        firstName: jobSeeker.firstName,
        lastName: jobSeeker.lastName,
      },
    };
  }
}

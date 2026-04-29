import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { JobPosting } from './job-posting.entity';
import { Interview } from './interview.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicantName: string;

  @Column({ unique: true })
  applicantEmail: string;

  @Column()
  applicantPhone: string;

  @Column('text')
  applicantResume: string;

  @Column('text', { nullable: true })
  coverLetter: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';

  @CreateDateColumn()
  appliedAt: Date;

  @Column({ nullable: true })
  rating: number;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications, { onDelete: 'CASCADE' })
  jobPosting: JobPosting;

  @Column()
  jobPostingId: string;

  @OneToMany(() => Interview, (interview) => interview.application)
  interviews: Interview[];
}

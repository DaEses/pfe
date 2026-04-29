import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type TranscriptEntry = {
  role: string;
  content: string;
  timestamp: string;
};
export type EmotionEntry = {
  emotion: string;
  confidence: number;
  timestamp: string;
};

@Entity('interview_sessions')
export class InterviewSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobRole: string;

  @Column({ nullable: true })
  candidateName: string;

  @Column('jsonb', { nullable: true, default: [] })
  transcript: TranscriptEntry[];

  @Column('jsonb', { nullable: true, default: [] })
  emotions: EmotionEntry[];

  @Column('jsonb', { nullable: true })
  resume: object;

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'abandoned';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

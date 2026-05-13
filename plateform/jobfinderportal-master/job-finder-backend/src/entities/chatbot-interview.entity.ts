import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ChatbotCandidate } from './chatbot-candidate.entity';
import { ChatbotQuestion } from './chatbot-question.entity';

@Entity('chatbot_interviews')
export class ChatbotInterview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatbotCandidate, (candidate) => candidate.interviews, { onDelete: 'CASCADE' })
  candidate: ChatbotCandidate;

  @Column()
  candidateId: string;

  @Column()
  jobRole: string;

  @Column({ default: 'in_progress' })
  status: 'in_progress' | 'completed' | 'abandoned';

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column('decimal', { precision: 3, scale: 1, nullable: true })
  averageScore: number;

  @Column('text', { nullable: true })
  summary: string;

  @Column({ nullable: true })
  recommendation: 'strongly_recommend' | 'recommend' | 'consider' | 'do_not_recommend';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatbotQuestion, (question) => question.interview, { cascade: true })
  questions: ChatbotQuestion[];
}

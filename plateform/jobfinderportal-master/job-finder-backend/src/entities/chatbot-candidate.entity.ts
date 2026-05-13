import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { ChatbotInterview } from './chatbot-interview.entity';

@Entity('chatbot_candidates')
@Unique(['email'])
export class ChatbotCandidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  jobRole: string;

  @Column('text', { nullable: true })
  resumeText: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChatbotInterview, (interview) => interview.candidate, { cascade: true })
  interviews: ChatbotInterview[];
}

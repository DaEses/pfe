import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ChatbotInterview } from './chatbot-interview.entity';

@Entity('chatbot_questions')
export class ChatbotQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatbotInterview, (interview) => interview.questions, { onDelete: 'CASCADE' })
  interview: ChatbotInterview;

  @Column()
  interviewId: string;

  @Column('text')
  questionText: string;

  @Column('text', { nullable: true })
  answerText: string;

  @Column()
  orderIndex: number;

  @Column({ nullable: true, type: 'decimal', precision: 2, scale: 1 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;
}

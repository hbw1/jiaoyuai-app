import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exam } from './Exam';

export enum QuestionType {
  CHOICE = 'choice',
  FILL_BLANK = 'fill_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  CALCULATION = 'calculation'
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  examId: string;

  @ManyToOne(() => Exam, exam => exam.questions)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column({ type: 'int' })
  questionNumber: number;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.CHOICE
  })
  type: QuestionType;

  @Column({ type: 'simple-array' })
  knowledgePoints: string[];

  @Column({ type: 'int', default: 3 })
  difficulty: number;

  @Column({ type: 'text', nullable: true })
  studentAnswer: string;

  @Column({ type: 'text' })
  correctAnswer: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'int', default: 0 })
  maxScore: number;

  @Column({ type: 'json', nullable: true })
  options: { label: string; content: string }[];

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}

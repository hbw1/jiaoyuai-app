import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

export enum ExamType {
  UNIT_TEST = 'unit_test',
  MIDTERM = 'midterm',
  FINAL = 'final',
  HOMEWORK = 'homework',
  PRACTICE = 'practice'
}

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.exams)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 50 })
  subject: string;

  @Column()
  grade: number;

  @Column({
    type: 'enum',
    enum: ExamType,
    default: ExamType.PRACTICE
  })
  examType: ExamType;

  @Column({ type: 'simple-array' })
  images: string[];

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'int', default: 100 })
  totalScore: number;

  @Column({ type: 'int', default: 0 })
  obtainedScore: number;

  @Column({ type: 'json', nullable: true })
  analysisResult: {
    overallScore: number;
    accuracy: number;
    knowledgeMastery: Record<string, { mastery: number; status: string; relatedQuestions: string[] }>;
    weakPoints: string[];
    recommendations: string[];
  };

  @Column({ type: 'json', nullable: true })
  thinkingAbility: {
    understanding: number;
    application: number;
    analysis: number;
    synthesis: number;
  };

  @OneToMany(() => Question, question => question.exam, { cascade: true })
  questions: Question[];

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'analyzed' | 'failed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

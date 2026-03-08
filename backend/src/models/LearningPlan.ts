import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('learning_plans')
export class LearningPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'json' })
  targetKnowledgePoints: {
    pointId: string;
    pointName: string;
    priority: number;
    estimatedTime: number;
  }[];

  @Column({ type: 'json', nullable: true })
  exercises: {
    questionId: string;
    knowledgePoint: string;
    difficulty: number;
    completed: boolean;
  }[];

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ type: 'int' })
  estimatedTime: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'paused';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

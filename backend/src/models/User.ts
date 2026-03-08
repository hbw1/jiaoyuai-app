import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exam } from './Exam';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  grade: number;

  @Column({ type: 'simple-array', nullable: true })
  subjects: string[];

  @Column({ type: 'json', nullable: true })
  learningGoals: { subject: string; target: string; deadline?: Date }[];

  @Column({ default: 'student' })
  role: 'student' | 'teacher' | 'parent';

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Exam, exam => exam.user)
  exams: Exam[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

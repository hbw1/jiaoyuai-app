import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('knowledge_points')
export class KnowledgePoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  subject: string;

  @Column()
  grade: number;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => KnowledgePoint, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: KnowledgePoint;

  @Column({ type: 'simple-array', nullable: true })
  prerequisites: string[];

  @Column({ type: 'int', default: 1 })
  difficulty: number;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({ type: 'json', nullable: true })
  examples: { question: string; answer: string }[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

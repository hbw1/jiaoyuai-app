import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { KnowledgePoint } from '../models/KnowledgePoint';
import { HttpError } from '../middleware/errorHandler';

export class KnowledgeController {
  private knowledgeRepository = AppDataSource.getRepository(KnowledgePoint);

  getSubjects = async (req: Request, res: Response) => {
    const subjects = [
      { id: 'math', name: '数学', icon: '🔢' },
      { id: 'chinese', name: '语文', icon: '📖' },
      { id: 'english', name: '英语', icon: '🔤' },
      { id: 'physics', name: '物理', icon: '⚡' },
      { id: 'chemistry', name: '化学', icon: '🧪' },
      { id: 'biology', name: '生物', icon: '🧬' }
    ];

    res.json({
      status: 'success',
      data: { subjects }
    });
  };

  getKnowledgePoints = async (req: Request, res: Response) => {
    const subjectId = req.params.subjectId as string;
    const grade = Number(req.params.grade);

    const points = await this.knowledgeRepository.find({
      where: {
        subject: subjectId,
        grade: grade,
        isActive: true
      },
      order: { name: 'ASC' }
    });

    res.json({
      status: 'success',
      data: { points }
    });
  };

  getKnowledgePointDetail = async (req: Request, res: Response) => {
    const pointId = req.params.pointId as string;

    const point = await this.knowledgeRepository.findOne({
      where: { id: pointId },
      relations: ['parent']
    });

    if (!point) {
      throw new HttpError(404, '知识点不存在');
    }

    res.json({
      status: 'success',
      data: { point }
    });
  };

  getKnowledgeTree = async (req: Request, res: Response) => {
    const subjectId = req.params.subjectId as string;
    const grade = Number(req.params.grade);

    const allPoints = await this.knowledgeRepository.find({
      where: {
        subject: subjectId,
        grade: grade,
        isActive: true
      }
    });

    const tree = this.buildTree(allPoints);

    res.json({
      status: 'success',
      data: { tree }
    });
  };

  private buildTree(points: KnowledgePoint[]): any[] {
    const pointMap = new Map<string, any>();
    const roots: any[] = [];

    points.forEach(point => {
      pointMap.set(point.id, {
        ...point,
        children: []
      });
    });

    points.forEach(point => {
      const node = pointMap.get(point.id)!;
      if (point.parentId && pointMap.has(point.parentId)) {
        pointMap.get(point.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}

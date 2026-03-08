import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Exam } from '../models/Exam';
import { HttpError } from '../middleware/errorHandler';

export class ExamController {
  private examRepository = AppDataSource.getRepository(Exam);

  uploadExam = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const files = req.files as Express.Multer.File[];
      const { subject, grade, examType, title } = req.body;

      if (!files || files.length === 0) {
        throw new HttpError(400, '请上传试卷图片');
      }

      const imageUrls = files.map(file => file.path);

      const exam = this.examRepository.create({
        userId: user.id,
        subject: subject || '数学',
        grade: grade || user.grade,
        examType: examType || 'practice',
        title: title || `${subject || '数学'}试卷`,
        images: imageUrls,
        status: 'pending'
      });

      await this.examRepository.save(exam);

      res.status(201).json({
        status: 'success',
        data: {
          exam: {
            id: exam.id,
            subject: exam.subject,
            grade: exam.grade,
            examType: exam.examType,
            title: exam.title,
            images: exam.images,
            status: exam.status,
            createdAt: exam.createdAt
          }
        }
      });
    } catch (error) {
      throw error;
    }
  };

  getExams = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { page = 1, limit = 10, subject, status } = req.query;

    const queryBuilder = this.examRepository
      .createQueryBuilder('exam')
      .where('exam.userId = :userId', { userId: user.id })
      .orderBy('exam.createdAt', 'DESC');

    if (subject) {
      queryBuilder.andWhere('exam.subject = :subject', { subject });
    }

    if (status) {
      queryBuilder.andWhere('exam.status = :status', { status });
    }

    const [exams, total] = await queryBuilder
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getManyAndCount();

    res.json({
      status: 'success',
      data: {
        exams,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  };

  getExamById = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const examId = req.params.id as string;

    const exam = await this.examRepository.findOne({
      where: { id: examId },
      relations: ['questions']
    });

    if (!exam) {
      throw new HttpError(404, '试卷不存在');
    }

    if (exam.userId !== user.id) {
      throw new HttpError(403, '无权访问此试卷');
    }

    res.json({
      status: 'success',
      data: { exam }
    });
  };

  deleteExam = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const examId = req.params.id as string;

    const exam = await this.examRepository.findOne({ where: { id: examId } });

    if (!exam) {
      throw new HttpError(404, '试卷不存在');
    }

    if (exam.userId !== user.id) {
      throw new HttpError(403, '无权删除此试卷');
    }

    await this.examRepository.remove(exam);

    res.json({
      status: 'success',
      message: '试卷已删除'
    });
  };
}

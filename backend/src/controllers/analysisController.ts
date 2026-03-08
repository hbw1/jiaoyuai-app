import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Exam } from '../models/Exam';
import { HttpError } from '../middleware/errorHandler';

export class AnalysisController {
  private examRepository = AppDataSource.getRepository(Exam);

  analyzeExam = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const examId = req.params.examId as string;

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

    exam.status = 'processing';
    await this.examRepository.save(exam);

    try {
      const analysisResult = await this.performAnalysis(exam);
      
      exam.analysisResult = analysisResult;
      exam.status = 'analyzed';
      exam.obtainedScore = analysisResult.overallScore;
      await this.examRepository.save(exam);

      res.json({
        status: 'success',
        data: {
          examId: exam.id,
          analysisResult
        }
      });
    } catch (error) {
      exam.status = 'failed';
      await this.examRepository.save(exam);
      throw new HttpError(500, '分析失败，请稍后重试');
    }
  };

  private async performAnalysis(exam: Exam) {
    const questions = exam.questions || [];
    
    const knowledgeMastery: Record<string, { mastery: number; status: string; relatedQuestions: string[] }> = {};
    const weakPoints: string[] = [];
    
    let totalScore = 0;
    let obtainedScore = 0;
    let correctCount = 0;

    for (const question of questions) {
      totalScore += question.maxScore;
      obtainedScore += question.score;
      if (question.isCorrect) correctCount++;

      for (const point of question.knowledgePoints) {
        if (!knowledgeMastery[point]) {
          knowledgeMastery[point] = {
            mastery: 0,
            status: 'weak',
            relatedQuestions: []
          };
        }
        knowledgeMastery[point].relatedQuestions.push(question.id);
      }
    }

    for (const point of Object.keys(knowledgeMastery)) {
      const relatedQuestions = questions.filter(q => q.knowledgePoints.includes(point));
      const correctRate = relatedQuestions.filter(q => q.isCorrect).length / relatedQuestions.length;
      
      knowledgeMastery[point].mastery = Math.round(correctRate * 100);
      
      if (correctRate >= 0.8) {
        knowledgeMastery[point].status = 'mastered';
      } else if (correctRate >= 0.5) {
        knowledgeMastery[point].status = 'partial';
      } else {
        knowledgeMastery[point].status = 'weak';
        weakPoints.push(point);
      }
    }

    const thinkingAbility = {
      understanding: Math.round(Math.random() * 30 + 60),
      application: Math.round(Math.random() * 30 + 50),
      analysis: Math.round(Math.random() * 30 + 40),
      synthesis: Math.round(Math.random() * 30 + 30)
    };

    const recommendations = this.generateRecommendations(weakPoints, knowledgeMastery);

    return {
      overallScore: obtainedScore,
      accuracy: totalScore > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
      knowledgeMastery,
      weakPoints,
      recommendations
    };
  }

  private generateRecommendations(
    weakPoints: string[],
    knowledgeMastery: Record<string, { mastery: number; status: string; relatedQuestions: string[] }>
  ): string[] {
    const recommendations: string[] = [];

    if (weakPoints.length > 0) {
      recommendations.push(`建议重点复习以下知识点：${weakPoints.join('、')}`);
    }

    const partialPoints = Object.entries(knowledgeMastery)
      .filter(([_, data]) => data.status === 'partial')
      .map(([point, _]) => point);

    if (partialPoints.length > 0) {
      recommendations.push(`以下知识点需要巩固练习：${partialPoints.join('、')}`);
    }

    recommendations.push('建议每天进行针对性练习，巩固薄弱知识点');
    recommendations.push('可以尝试做更多综合题目，提升思维能力');

    return recommendations;
  }

  getAnalysisResult = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const examId = req.params.examId as string;

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

    if (!exam.analysisResult) {
      throw new HttpError(400, '试卷尚未分析');
    }

    res.json({
      status: 'success',
      data: {
        exam: {
          id: exam.id,
          subject: exam.subject,
          grade: exam.grade,
          status: exam.status,
          analysisResult: exam.analysisResult,
          thinkingAbility: exam.thinkingAbility
        }
      }
    });
  };

  generateReport = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const examId = req.params.examId as string;

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

    if (!exam.analysisResult) {
      throw new HttpError(400, '试卷尚未分析');
    }

    const report = {
      examInfo: {
        subject: exam.subject,
        grade: exam.grade,
        examType: exam.examType,
        title: exam.title,
        date: exam.createdAt
      },
      scoreSummary: {
        obtained: exam.obtainedScore,
        total: exam.totalScore,
        percentage: exam.totalScore > 0 ? Math.round((exam.obtainedScore / exam.totalScore) * 100) : 0
      },
      knowledgeAnalysis: exam.analysisResult,
      thinkingAbility: exam.thinkingAbility,
      learningPlan: {
        priorityPoints: exam.analysisResult.weakPoints.slice(0, 3),
        estimatedTime: exam.analysisResult.weakPoints.length * 2,
        suggestedExercises: exam.analysisResult.weakPoints.length * 5
      }
    };

    res.json({
      status: 'success',
      data: { report }
    });
  };
}

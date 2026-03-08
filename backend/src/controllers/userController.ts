import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, grade, role } = req.body;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: '该邮箱已被注册'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        grade: grade || 1,
        role: role || 'student'
      });

      await this.userRepository.save(user);

      const secret = process.env.JWT_SECRET || 'default-secret-key';
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            grade: user.grade,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('注册错误:', error);
      res.status(500).json({
        status: 'error',
        message: '服务器错误'
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: '请输入邮箱和密码'
        });
      }

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: '邮箱或密码错误'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'fail',
          message: '邮箱或密码错误'
        });
      }

      const secret = process.env.JWT_SECRET || 'default-secret-key';
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            grade: user.grade,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('登录错误:', error);
      res.status(500).json({
        status: 'error',
        message: '服务器错误'
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    const user = (req as any).user;
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          grade: user.grade,
          subjects: user.subjects,
          learningGoals: user.learningGoals,
          role: user.role
        }
      }
    });
  };

  updateProfile = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { name, grade, subjects, learningGoals } = req.body;

    if (name) user.name = name;
    if (grade) user.grade = grade;
    if (subjects) user.subjects = subjects;
    if (learningGoals) user.learningGoals = learningGoals;

    await this.userRepository.save(user);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          grade: user.grade,
          subjects: user.subjects,
          learningGoals: user.learningGoals
        }
      }
    });
  };
}

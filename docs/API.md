# API 文档

## 基础信息

- 基础 URL: `http://localhost:3000/api`
- 认证方式: Bearer Token (JWT)
- 内容类型: `application/json`

## 认证

### 注册

**POST** `/users/register`

请求体：
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "password": "password123",
  "grade": 9
}
```

响应：
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "张三",
      "email": "zhangsan@example.com",
      "grade": 9,
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

### 登录

**POST** `/users/login`

请求体：
```json
{
  "email": "zhangsan@example.com",
  "password": "password123"
}
```

响应：
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "张三",
      "email": "zhangsan@example.com",
      "grade": 9,
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

### 获取用户信息

**GET** `/users/profile`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "张三",
      "email": "zhangsan@example.com",
      "grade": 9,
      "subjects": ["math", "chinese"],
      "learningGoals": [],
      "role": "student"
    }
  }
}
```

## 试卷管理

### 上传试卷

**POST** `/exams/upload`

请求头：
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

请求体（FormData）：
```
images: File[] (最多10张)
subject: string (math, chinese, english, etc.)
grade: number
examType: string (unit_test, midterm, final, homework, practice)
title: string (可选)
```

响应：
```json
{
  "status": "success",
  "data": {
    "exam": {
      "id": "uuid",
      "subject": "math",
      "grade": 9,
      "examType": "practice",
      "title": "数学试卷",
      "images": ["url1", "url2"],
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 获取试卷列表

**GET** `/exams?page=1&limit=10&subject=math&status=analyzed`

请求头：
```
Authorization: Bearer <token>
```

查询参数：
- `page`: 页码（默认 1）
- `limit`: 每页数量（默认 10）
- `subject`: 学科筛选
- `status`: 状态筛选

响应：
```json
{
  "status": "success",
  "data": {
    "exams": [
      {
        "id": "uuid",
        "subject": "math",
        "grade": 9,
        "title": "数学试卷",
        "status": "analyzed",
        "obtainedScore": 85,
        "totalScore": 100,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 获取试卷详情

**GET** `/exams/:id`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "status": "success",
  "data": {
    "exam": {
      "id": "uuid",
      "subject": "math",
      "grade": 9,
      "examType": "practice",
      "title": "数学试卷",
      "images": ["url1"],
      "totalScore": 100,
      "obtainedScore": 85,
      "status": "analyzed",
      "analysisResult": {
        "overallScore": 85,
        "accuracy": 85,
        "knowledgeMastery": {
          "一元二次方程": {
            "mastery": 90,
            "status": "mastered",
            "relatedQuestions": ["q1", "q2"]
          }
        },
        "weakPoints": ["函数图像"],
        "recommendations": ["建议重点复习函数图像"]
      },
      "questions": [
        {
          "id": "uuid",
          "questionNumber": 1,
          "content": "解方程 x² - 5x + 6 = 0",
          "type": "calculation",
          "knowledgePoints": ["一元二次方程"],
          "difficulty": 3,
          "studentAnswer": "x=2或x=3",
          "correctAnswer": "x=2或x=3",
          "isCorrect": true,
          "score": 10,
          "maxScore": 10
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 删除试卷

**DELETE** `/exams/:id`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "status": "success",
  "message": "试卷已删除"
}
```

## 分析功能

### 分析试卷

**POST** `/analysis/analyze/:examId`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "status": "success",
  "data": {
    "examId": "uuid",
    "analysisResult": {
      "overallScore": 85,
      "accuracy": 85,
      "knowledgeMastery": {},
      "weakPoints": [],
      "recommendations": []
    }
  }
}
```

### 获取分析报告

**GET** `/analysis/report/:examId`

请求头：
```
Authorization: Bearer <token>
```

响应：
```json
{
  "status": "success",
  "data": {
    "report": {
      "examInfo": {
        "subject": "math",
        "grade": 9,
        "examType": "practice",
        "title": "数学试卷",
        "date": "2024-01-01T00:00:00.000Z"
      },
      "scoreSummary": {
        "obtained": 85,
        "total": 100,
        "percentage": 85
      },
      "knowledgeAnalysis": {
        "overallScore": 85,
        "accuracy": 85,
        "knowledgeMastery": {},
        "weakPoints": [],
        "recommendations": []
      },
      "thinkingAbility": {
        "understanding": 75,
        "application": 70,
        "analysis": 65,
        "synthesis": 60
      },
      "learningPlan": {
        "priorityPoints": ["函数图像", "不等式"],
        "estimatedTime": 4,
        "suggestedExercises": 10
      }
    }
  }
}
```

## 知识点

### 获取学科列表

**GET** `/knowledge/subjects`

响应：
```json
{
  "status": "success",
  "data": {
    "subjects": [
      { "id": "math", "name": "数学", "icon": "🔢" },
      { "id": "chinese", "name": "语文", "icon": "📖" },
      { "id": "english", "name": "英语", "icon": "🔤" }
    ]
  }
}
```

### 获取知识点列表

**GET** `/knowledge/subjects/:subjectId/grades/:grade/points`

响应：
```json
{
  "status": "success",
  "data": {
    "points": [
      {
        "id": "uuid",
        "name": "一元二次方程",
        "description": "学习一元二次方程的解法",
        "subject": "math",
        "grade": 9,
        "difficulty": 3
      }
    ]
  }
}
```

### 获取知识点树

**GET** `/knowledge/tree/:subjectId/:grade`

响应：
```json
{
  "status": "success",
  "data": {
    "tree": [
      {
        "id": "uuid",
        "name": "方程与不等式",
        "children": [
          {
            "id": "uuid",
            "name": "一元二次方程",
            "children": []
          }
        ]
      }
    ]
  }
}
```

## 错误响应

所有错误响应格式：

```json
{
  "status": "fail",
  "message": "错误描述"
}
```

常见错误码：
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器内部错误

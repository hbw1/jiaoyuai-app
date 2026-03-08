# AI教育应用

智能试卷分析与个性化学习方案生成系统

## 项目简介

AI教育应用是一个基于人工智能的教育辅助平台，通过分析学生上传的试卷图片，自动识别知识点掌握情况，生成个性化学习方案和推荐习题。

### 核心功能

- 📷 **试卷上传**：支持拍照或相册上传试卷图片
- 🔍 **智能分析**：OCR识别 + AI分析题目和答案
- 📊 **知识点评估**：自动归类知识点，评估掌握程度
- 📝 **学习方案**：生成个性化学习清单和习题推荐
- 📈 **能力评估**：思维能力多维度分析

## 技术栈

### 后端
- Node.js + Express + TypeScript
- PostgreSQL + TypeORM
- Redis（缓存）
- JWT 认证

### 移动端
- React Native + Expo
- TypeScript
- Zustand（状态管理）
- React Navigation

### AI 能力
- OCR 服务（百度/腾讯/阿里云）
- 大语言模型（OpenAI/文心一言/通义千问）

## 项目结构

```
aijiaoyu-app/
├── backend/                # 后端服务
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由定义
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   ├── config/         # 配置文件
│   │   └── types/          # 类型定义
│   ├── uploads/            # 上传文件目录
│   └── package.json
│
├── mobile/                 # 移动端应用
│   ├── app/                # Expo Router 页面
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── screens/        # 页面
│   │   ├── services/       # API 服务
│   │   ├── stores/         # 状态管理
│   │   ├── utils/          # 工具函数
│   │   ├── hooks/          # 自定义 Hooks
│   │   ├── types/          # 类型定义
│   │   └── constants/      # 常量定义
│   ├── assets/             # 静态资源
│   └── package.json
│
├── docs/                   # 文档
├── docker-compose.yml      # Docker 编排
└── package.json            # 根 package.json
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6
- npm >= 9.0.0

### 安装依赖

```bash
# 安装所有依赖
npm install

# 或分别安装
cd backend && npm install
cd ../mobile && npm install
```

### 配置环境变量

```bash
# 后端配置
cp backend/.env.example backend/.env
# 编辑 backend/.env 填写数据库连接信息等

# 移动端配置
# 编辑 mobile/.env 配置 API 地址
```

### 启动数据库

```bash
# 使用 Docker 启动
docker-compose up -d postgres redis

# 或使用本地数据库
# 确保 PostgreSQL 和 Redis 正在运行
```

### 启动开发服务器

```bash
# 启动后端
npm run backend
# 或
cd backend && npm run dev

# 启动移动端
npm run mobile
# 或
cd mobile && npm run start
```

### 访问应用

- 后端 API: http://localhost:3000
- API 文档: http://localhost:3000/api
- 移动端: 使用 Expo Go 扫描二维码

## API 接口

### 认证相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/users/register | 用户注册 |
| POST | /api/users/login | 用户登录 |
| GET | /api/users/profile | 获取用户信息 |
| PUT | /api/users/profile | 更新用户信息 |

### 试卷相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/exams/upload | 上传试卷 |
| GET | /api/exams | 获取试卷列表 |
| GET | /api/exams/:id | 获取试卷详情 |
| DELETE | /api/exams/:id | 删除试卷 |

### 分析相关

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/analysis/analyze/:examId | 分析试卷 |
| GET | /api/analysis/result/:examId | 获取分析结果 |
| GET | /api/analysis/report/:examId | 生成分析报告 |

### 知识点相关

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/knowledge/subjects | 获取学科列表 |
| GET | /api/knowledge/subjects/:subjectId/grades/:grade/points | 获取知识点 |
| GET | /api/knowledge/tree/:subjectId/:grade | 获取知识点树 |

## 开发指南

### 数据库迁移

```bash
cd backend
npm run migration:generate -- -n MigrationName
npm run migration:run
```

### 代码规范

```bash
# 检查代码
npm run lint

# 运行测试
npm run test
```

### 构建生产版本

```bash
# 后端
cd backend && npm run build

# 移动端
cd mobile && npx expo build:android
cd mobile && npx expo build:ios
```

## 部署

### Docker 部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 手动部署

1. 构建后端代码
2. 配置生产环境变量
3. 使用 PM2 或类似工具启动服务

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请创建 Issue 或联系开发团队。

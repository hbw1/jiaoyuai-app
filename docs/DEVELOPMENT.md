# 开发指南

## 开发流程

### 1. 创建新功能

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 开发完成后
git add .
git commit -m "feat: 添加新功能描述"
git push origin feature/your-feature-name
```

### 2. 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 组件命名使用 PascalCase
- 函数命名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### 3. 提交规范

使用约定式提交：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 后端开发

### 添加新的 API 路由

1. 在 `backend/src/models/` 创建数据模型
2. 在 `backend/src/controllers/` 创建控制器
3. 在 `backend/src/routes/` 创建路由
4. 在 `backend/src/routes/index.ts` 注册路由

### 示例：添加习题模块

```typescript
// 1. 创建模型 backend/src/models/Exercise.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
  
  // ... 其他字段
}

// 2. 创建控制器 backend/src/controllers/exerciseController.ts
import { Request, Response } from 'express';

export class ExerciseController {
  getExercises = async (req: Request, res: Response) => {
    // 业务逻辑
  };
}

// 3. 创建路由 backend/src/routes/exerciseRoutes.ts
import { Router } from 'express';
import { ExerciseController } from '../controllers/exerciseController';

const router = Router();
const controller = new ExerciseController();

router.get('/', controller.getExercises);

export default router;

// 4. 注册路由 backend/src/routes/index.ts
import exerciseRoutes from './exerciseRoutes';
// ...
router.use('/exercises', exerciseRoutes);
```

## 移动端开发

### 添加新页面

1. 在 `mobile/app/` 创建页面文件
2. 在 `mobile/src/stores/` 添加状态管理（如需要）
3. 在 `mobile/src/services/api.ts` 添加 API 调用

### 示例：添加习题练习页面

```typescript
// 1. 创建页面 mobile/app/exercise/index.tsx
import { View, Text } from 'react-native';

export default function ExerciseScreen() {
  return (
    <View>
      <Text>习题练习</Text>
    </View>
  );
}

// 2. 添加 API mobile/src/services/api.ts
export const exerciseApi = {
  getList: (params) => apiService.get('/exercises', params),
  submit: (id: string, answer: string) => 
    apiService.post(`/exercises/${id}/submit`, { answer }),
};

// 3. 添加状态管理 mobile/src/stores/exerciseStore.ts
import { create } from 'zustand';

export const useExerciseStore = create((set, get) => ({
  exercises: [],
  // ... 其他状态和方法
}));
```

## 数据库操作

### 创建迁移

```bash
cd backend

# 生成迁移文件
npm run migration:generate -- -n AddExerciseTable

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

### 种子数据

```typescript
// backend/src/seeds/knowledgePoints.ts
import { AppDataSource } from '../config/database';
import { KnowledgePoint } from '../models/KnowledgePoint';

export async function seedKnowledgePoints() {
  const repository = AppDataSource.getRepository(KnowledgePoint);
  
  const points = [
    { name: '一元二次方程', subject: 'math', grade: 9 },
    // ... 更多知识点
  ];
  
  await repository.save(points);
}
```

## 测试

### 后端测试

```bash
cd backend

# 运行所有测试
npm test

# 运行特定测试
npm test -- userController.test.ts

# 测试覆盖率
npm test -- --coverage
```

### 移动端测试

```bash
cd mobile

# 运行测试
npm test
```

## 调试

### 后端调试

```bash
# 启动调试模式
cd backend
npm run dev:debug

# 使用 VS Code 调试
# 创建 .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Node",
      "port": 9229
    }
  ]
}
```

### 移动端调试

```bash
# 启动开发服务器
cd mobile
npm start

# 使用 React Native Debugger
# 或使用 Expo Go 内置调试工具
```

## 常见问题

### 数据库连接失败

1. 检查 PostgreSQL 是否运行
2. 检查 `.env` 配置是否正确
3. 检查数据库是否存在

### 移动端无法连接后端

1. 确保后端服务正在运行
2. 检查 `mobile/.env` 中的 API_URL
3. 如果使用模拟器，使用 `http://localhost:3000/api`
4. 如果使用真机，使用电脑的局域网 IP

### TypeScript 类型错误

```bash
# 重新生成类型
npm run build

# 或重启 TypeScript 服务
# VS Code: Cmd+Shift+P -> TypeScript: Restart TS Server
```

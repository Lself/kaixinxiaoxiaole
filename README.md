# 开心消消乐游戏

一款休闲益智类消除游戏，玩家通过匹配相同图案的方块来获得分数。

## 功能特性

- 多种游戏模式：步数模式和时间模式
- 多种游戏难度：简单、中等、困难
- 响应式设计，适配桌面端和移动端
- 最高分记录功能
- 流畅的动画效果

## 游戏玩法

1. 点击两个相邻的方块进行交换
2. 三个或更多相同颜色的方块连成一线即可消除
3. 消除方块获得分数
4. 在步数或时间用完前获得最高分

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand（状态管理）
- React Router

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## 部署

游戏通过GitHub Actions自动部署到GitHub Pages。每次推送到main分支都会触发自动构建和部署。

## 游戏链接

部署后可以通过以下链接访问游戏：
https://lself.github.io/kaixinxiaoxiaole/

## 许可证

MIT

# 开心消消乐游戏部署指南

本指南将帮助你将开心消消乐游戏部署到GitHub Pages，以便在微信中分享给朋友。

## 步骤1：生成GitHub个人访问令牌（PAT）

由于GitHub不再支持密码认证，你需要生成一个个人访问令牌：

1. 登录GitHub账号（jarry1989ls@163.com）
2. 点击右上角的头像 →「Settings」
3. 在左侧菜单中选择「Developer settings」→「Personal access tokens」→「Tokens (classic)」
4. 点击「Generate new token」→「Generate new token (classic)」
5. 填写以下信息：
   - Note: 开心消消乐游戏部署
   - Expiration: 选择「No expiration」
   - Scopes: 勾选「repo」（全选repo相关的权限）
6. 点击「Generate token」
7. 复制生成的令牌（这是你唯一看到它的机会）

## 步骤2：推送代码到GitHub仓库

在本地终端执行以下命令（将 `YOUR_TOKEN` 替换为你生成的个人访问令牌）：

```bash
# 1. 设置远程仓库URL，包含个人访问令牌
git remote set-url origin https://jarry1989ls%40163.com:YOUR_TOKEN@github.com/Lself/kaixinxiaoxiaole.git

# 2. 推送代码到仓库
git push -u origin main
```

## 步骤3：配置GitHub Pages

1. 登录GitHub，进入你的仓库 `https://github.com/Lself/kaixinxiaoxiaole`
2. 点击顶部的「Settings」选项卡
3. 在左侧菜单中选择「Pages」
4. 在「Build and deployment」部分：
   - 选择「Source」为「Deploy from a branch」
   - 选择「Branch」为「main」
   - 选择「Folder」为「/dist」
   - 点击「Save」按钮

## 步骤4：等待部署完成

GitHub Pages会自动构建和部署你的游戏。部署完成后，你会在「Pages」设置页面看到一个绿色的「Your site is published at」提示，并显示你的游戏URL。

## 步骤5：在微信中分享游戏

1. 复制GitHub Pages生成的URL（格式通常为 `https://lself.github.io/kaixinxiaoxiaole/`）
2. 在微信中打开聊天窗口，粘贴URL并发送给朋友
3. 朋友点击链接即可在微信浏览器中玩游戏

## 步骤6：更新游戏

如果需要更新游戏，只需：

1. 修改本地代码
2. 构建项目：`npm run build`
3. 提交代码：`git add . && git commit -m "Update game"`
4. 推送代码：`git push`
5. GitHub Pages会自动重新部署

## 注意事项

1. **个人访问令牌安全**：请妥善保管你的个人访问令牌，不要分享给他人
2. **部署时间**：GitHub Pages部署可能需要几分钟时间，请耐心等待
3. **URL格式**：GitHub Pages的URL格式为 `https://<username>.github.io/<repository-name>/`
4. **微信兼容性**：游戏已做响应式设计，应该可以在微信浏览器中正常运行
5. **网络访问**：确保你的朋友可以访问GitHub Pages（国内用户可能需要网络加速）

## 本地测试

如果你想在本地测试游戏，可以通过以下方式：

```bash
cd dist
python3 -m http.server 8000
```

然后在浏览器中访问 `http://localhost:8000`

---

祝你游戏愉快！
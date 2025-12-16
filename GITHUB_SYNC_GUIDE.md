# GitHub 同步指南

## ✅ 已同步到 GitHub

專案已成功同步到 GitHub 倉庫：
```
https://github.com/zardabab/htsproutHealthylicon
```

## 倉庫資訊

- **倉庫名稱**: htsproutHealthylicon
- **所有者**: zardabab
- **遠端URL**: https://github.com/zardabab/htsproutHealthylicon.git
- **初始分支**: master
- **初始提交**: 2ba4d9a

## 已提交的文件

### 核心檔案
- `AI個案管理名單.html` - 個案管理系統主頁面
- `AI智慧個管系統.html` - 評估系統主頁面
- `index-gpt.html` - 系統首頁
- `styles.css` - 全域樣式
- `script.js` - 共用 JavaScript

### 評估量表（14 個）
- `量表-barthel.html` - Barthel Index
- `量表-iadl.html` - IADL
- `量表-berg.html` - Berg Balance Scale
- `量表-mrs.html` - Modified Rankin Scale
- `量表-cfs.html` - Clinical Frailty Scale
- `量表-nrs.html` - Pain Scale
- `量表-gds.html` - Geriatric Depression Scale
- `量表-spmsq.html` - Short Portable Mental Status
- `量表-cam.html` - Confusion Assessment Method
- `量表-mna.html` - Mini Nutritional Assessment
- `量表-fma.html` - Fugl-Meyer Assessment
- `量表-goat.html` - Go for Objective Assessment
- `量表-gait.html` - Gait Speed
- `量表-6mwt.html` - 6-Minute Walk Test

### 其他系統頁面
- `指標.html` - 績效指標
- `排班程式.html` - 排班系統
- `文件管理.html` - 文件管理
- `深耕計劃經費追蹤表.html` - 經費追蹤
- `績效指標達成情形.html` - 績效報表
- `資安指標.html` - 資安指標

### 設定文件
- `README.md` - 專案文檔
- `GOOGLE_APPS_SCRIPT_SETUP.md` - Apps Script 設置指南
- `GOOGLE_SHEETS_SETUP.md` - Google Sheets 設置指南
- `解決401錯誤指南.md` - 常見問題解決
- `.gitignore` - Git 忽略規則

## 本地 Git 設定

```bash
# 查看遠端設定
git remote -v

# 查看分支資訊
git branch -vv

# 查看提交歷史
git log --oneline
```

## 後續 Git 操作

### 拉取最新代碼
```bash
git pull origin master
```

### 提交新的變更
```bash
# 檢查變更狀態
git status

# 新增變更
git add .

# 建立提交
git commit -m "描述你的變更"

# 推送到 GitHub
git push origin master
```

### 建立新分支開發功能
```bash
# 建立並切換到新分支
git checkout -b feature/new-feature

# 進行開發...

# 推送分支到 GitHub
git push -u origin feature/new-feature

# 在 GitHub 上建立 Pull Request
```

### 檢查歷史
```bash
# 查看詳細提交歷史
git log

# 查看單一檔案的歷史
git log -- filename.html

# 檢視特定提交
git show commit-hash
```

## GitHub 倉庫設定建議

### 保護 master 分支
1. 進入 GitHub 倉庫 → Settings → Branches
2. 新增分支保護規則
3. 啟用「Require pull request reviews」
4. 設定需要通過測試才能合併

### 啟用 GitHub Pages（可選）
1. Settings → Pages
2. 選擇「Deploy from a branch」
3. 選擇 master 分支
4. 系統會自動發布靜態網頁

GitHub Pages URL: `https://zardabab.github.io/htsproutHealthylicon/`

### 新增主題和描述
1. 倉庫首頁右上方 ⚙️ Settings
2. 新增描述和主題標籤
3. 主題建議: `health`, `assessment`, `healthcare`, `evaluation`, `google-sheets`

## 環境設定

### 首次設定
已完成以下設定：
- ✅ Git 倉庫初始化
- ✅ .gitignore 建立
- ✅ README.md 建立
- ✅ 初始提交和推送
- ✅ 遠端倉庫連接

### 本地 Git 設定（已完成）
```bash
git config user.name "GitHub User"
git config user.email "user@example.com"
```

**建議**: 修改為實際的使用者名稱和電子郵件：
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## 常見 Git 命令

### 狀態檢查
```bash
git status          # 檢查目前狀態
git diff            # 查看未暫存的變更
git diff --staged   # 查看已暫存的變更
```

### 撤銷操作
```bash
git restore filename           # 撤銷單一檔案變更
git restore --staged filename  # 取消暫存
git reset HEAD~1              # 撤銷最後一次提交（保留變更）
git revert commit-hash        # 反轉特定提交
```

### 標籤管理
```bash
git tag -a v1.0 -m "Version 1.0"  # 建立標籤
git push origin v1.0                # 推送標籤
git tag -l                         # 列出所有標籤
```

## 協作工作流程

### 建議流程
1. **從 master 建立功能分支**
   ```bash
   git checkout -b feature/description
   ```

2. **進行開發和提交**
   ```bash
   git add .
   git commit -m "描述變更"
   ```

3. **推送分支**
   ```bash
   git push -u origin feature/description
   ```

4. **建立 Pull Request**
   - 在 GitHub 上建立 PR
   - 描述變更內容
   - 邀請審核

5. **合併到 master**
   - 等待審核批准
   - 合併 PR
   - 刪除功能分支

## 疑難排解

### 推送被拒絕
```bash
# 確保本地代碼最新
git pull origin master

# 重新推送
git push origin master
```

### 合併衝突
```bash
# 查看衝突檔案
git status

# 手動解決衝突後
git add .
git commit -m "Resolve merge conflicts"
```

### 查看是誰修改了某一行
```bash
git blame filename.html
```

## 資源連結

- 倉庫地址: https://github.com/zardabab/htsproutHealthylicon
- GitHub 文檔: https://docs.github.com
- Git 官方文檔: https://git-scm.com/doc
- GitHub 流程指南: https://guides.github.com/

---

**同步完成時間**: 2025 年 12 月 16 日
**同步方式**: 本地 Git 推送

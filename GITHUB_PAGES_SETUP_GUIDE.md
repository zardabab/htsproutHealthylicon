# GitHub Pages 設定完整指南

## 📱 分步驟詳細說明

### 第 1 步：登入 GitHub

1. 打開瀏覽器，前往 [https://github.com](https://github.com)
2. 點擊右上角頭像，確認已登入帳號
3. 如果未登入，點擊 **Sign in** 並輸入帳號密碼

---

### 第 2 步：進入倉庫設定

1. 前往倉庫頁面：
   ```
   https://github.com/zardabab/htsproutHealthylicon
   ```

2. 在頁面上方找到 **Settings** 標籤（選項卡）
   - 位置：Code | Issues | Pull requests | Discussions | **Settings** ← 點擊這個

3. 左側邊欄選單會出現，找到 **Pages** 選項
   - 位置：在左邊欄找到 **Code and automation** 區塊
   - 展開後選擇 **Pages** ← 點擊這個

---

### 第 3 步：配置 Pages 設定

進入 Pages 頁面後，您會看到以下區域：

#### ⚙️ **Build and deployment**

在這個區塊中進行以下設定：

**1. Source（來源）**
   - 預設可能是 "Deploy from a branch"
   - 確保選擇：**Deploy from a branch** ✓

**2. Branch（分支）**
   - 點擊第一個下拉選單（通常顯示 "None"）
   - 選擇：**master** ✓
   - 第二個下拉選單選擇：**/ (root)** ✓

**3. 點擊 Save 按鈕**
   - 位置：在 Branch 設定下方
   - 點擊藍色的 **Save** 按鈕

---

### 第 4 步：等待部署完成

部署通常需要 **1-3 分鐘**

您會看到以下進度提示：

```
🟡 Your site is ready to be published at https://zardabab.github.io/htsproutHealthylicon/
```

稍後變為：

```
🟢 Your site is live at https://zardabab.github.io/htsproutHealthylicon/
```

---

## 🌐 訪問您的網站

部署完成後，可透過以下網址訪問：

### 聖誕版主頁
```
https://zardabab.github.io/htsproutHealthylicon/index-gpt.html
```

**🎅 直接打開試試看！**
- 會看到聖誕主題（紅色、綠色、金色配色）
- 雪花飄落動畫
- 聖誕老人、麋鹿、聖誕樹、禮物等動畫

### 其他頁面

如果需要訪問其他子系統（相對路徑）：

- AI 個案管理：
  ```
  https://zardabab.github.io/htsproutHealthylicon/AI個案管理名單.html
  ```

- 指標系統：
  ```
  https://zardabab.github.io/htsproutHealthylicon/指標.html
  ```

- 資安指標：
  ```
  https://zardabab.github.io/htsproutHealthylicon/資安指標.html
  ```

---

## ⚙️ 進階設定（可選）

### 添加自訂網域（Domain）
如果您有自己的網域名稱，可以：
1. 在 Pages 設定頁面找到 **Custom domain**
2. 輸入您的網域名稱
3. 按照提示修改 DNS 設定

### 強制 HTTPS
- 建議勾選 **Enforce HTTPS**
- 這會自動將 HTTP 流量重定向到 HTTPS

---

## 🔧 常見問題排除

### Q：部署失敗？

**檢查清單：**
- ✓ 倉庫中確實存在 `index-gpt.html` 檔案
- ✓ 分支選擇正確（master）
- ✓ Folder 選擇正確（/ root）
- ✓ `.nojekyll` 文件已提交

### Q：網站還看不到？

等待 **2-3 分鐘**，然後：
1. 重新整理瀏覽器（按 F5 或 Cmd+R）
2. 清除瀏覽器快取（Ctrl+Shift+Delete）
3. 在隱私視窗中打開網址測試

### Q：頁面樣式破損？

**解決方案：**
- 檢查瀏覽器開發者工具（F12）的 Console 標籤
- 查看是否有 CSS/JavaScript 載入錯誤
- 通常是外部資源（如字體、圖示庫）載入失敗

---

## 📸 設定畫面參考

### GitHub Pages 設定位置
```
GitHub 倉庫頁面
    ↓
Settings 標籤（頁面頂部）
    ↓
Pages（左側邊欄）
    ↓
Build and deployment
    ├─ Source: Deploy from a branch ✓
    ├─ Branch: master ✓
    └─ Folder: / (root) ✓
    
點擊 Save 按鈕
```

### Pages 狀態指示器
- 🔴 **Not published** - 未發布
- 🟡 **Ready to be published** - 準備發布中
- 🟢 **Live** - 已上線！

---

## ✅ 驗證部署成功

部署成功後，您應該能夠：

1. **訪問主頁**
   - 打開 `https://zardabab.github.io/htsproutHealthylicon/index-gpt.html`
   - 看到完整的聖誕主題頁面

2. **查看動畫效果**
   - 頁面頂部飄落的雪花 ❄️
   - 飛翔的聖誕老人 🎅
   - 跳躍的麋鹿 🦌
   - 左下角的聖誕樹 🎄
   - 右下角的禮物 🎁

3. **測試主題切換**
   - 點擊右上角的「原始模式」按鈕
   - 可切換回藍色原始主題

4. **隱藏彩蛋**
   - 連續點擊副標題「深耕計畫入口網｜AI 與醫療整合平台」5 次
   - 會出現主題切換按鈕（如果已隱藏）

---

## 🎉 完成！

您的聖誕主題入口網站現已上線！

**分享網址：**
```
https://zardabab.github.io/htsproutHealthylicon/index-gpt.html
```

**提示：** 
- 網址中的 `zardabab` 是您的 GitHub 使用者名稱
- `htsproutHealthylicon` 是倉庫名稱
- 可以將完整網址分享給團隊成員

---

## 📞 需要幫助？

如果遇到問題，請檢查：
1. GitHub Actions 是否運行成功（Repositories → Actions 標籤）
2. 文件是否正確提交到 master 分支
3. 瀏覽器開發者工具中是否有錯誤訊息
4. 嘗試清除瀏覽器快取並在隱私視窗中重試

---

**祝賀！🎄 您的深耕計畫入口網已成功部署到 GitHub Pages！**

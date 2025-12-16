# 台灣健康辦公室 - 深耕計劃入口網

健康評估與個案管理系統，提供完整的線上評估工具和個案追蹤功能。

## 功能介紹

### 1. **個案管理系統** (`AI個案管理名單.html`)
- 個案基本資料管理
- 入住、複評、結評、出院時間追蹤
- 評估進度里程碑管理
- Google Sheets 資料同步
- CRUD 操作（新增、查看、編輯、刪除）

### 2. **智慧個管評估系統** (`AI智慧個管系統.html`)
- 條件特異性評估量表
- 依據個案狀況篩選相關量表
- 支援以下四大評估條件：
  - 腦中風 (Stroke)
  - 神經損傷 (Neurological Injury)
  - 脆骨 (Frailty)
  - 衰弱高齡 (Elderly Frailty)

### 3. **14 個評估量表**
- **Barthel Index** (ADL 能力評估)
- **IADL** (工具性日常生活功能)
- **Berg Balance Scale** (平衡能力)
- **Modified Rankin Scale** (中風嚴重程度)
- **Clinical Frailty Scale** (脆弱程度)
- **Pain Scale (NRS)** (疼痛評分)
- **Geriatric Depression Scale** (老年憂鬱症)
- **Short Portable Mental Status Questionnaire** (認知功能)
- **Confusion Assessment Method** (譫妄評估)
- **Mini Nutritional Assessment** (營養狀態)
- **Fugl-Meyer Assessment** (運動恢復)
- **Go for Objective Assessment of Gait** (步態認知)
- **Gait Speed** (行走速度)
- **6-Minute Walk Test** (6 分鐘步行試驗)

## 技術堆疊

- **前端**: HTML5, Bootstrap 5.3.3, Vanilla JavaScript, jQuery 3.7.1, Font Awesome 6.5.2
- **後端/API**: Google Sheets API v4, Google Apps Script
- **資料儲存**: Google Sheets (雲端試算表)
- **部署**: 靜態 HTML 檔案 (可在任何 Web 伺服器上執行)

## 快速開始

### 前置需求
- Google 帳號
- Google Sheets 試算表 ID
- Google Apps Script 部署 URL

### 安裝步驟

1. **複製本倉庫**
```bash
git clone https://github.com/zardabab/htsproutHealthylicon.git
```

2. **設定 Google Apps Script**
   - 參考 `GOOGLE_APPS_SCRIPT_SETUP.md`
   - 在 Google Sheet 中建立 Apps Script
   - 複製部署 URL

3. **設定 API 連線**
   - 開啟 `AI個案管理名單.html`
   - 找到 `APPS_SCRIPT_URL` 常數
   - 貼上你的 Apps Script 部署 URL

4. **啟動應用**
   - 在本地 Web 伺服器上執行或直接用瀏覽器開啟 HTML 檔案
   - 訪問 `index-gpt.html` 進入系統

## 檔案結構

```
.
├── AI個案管理名單.html           # 主要的個案管理介面
├── AI智慧個管系統.html           # 條件特異性評估系統
├── index-gpt.html               # 系統首頁
├── styles.css                   # 全域樣式
├── script.js                    # 共用 JavaScript
├── 量表-*.html                  # 14 個評估量表
├── GOOGLE_APPS_SCRIPT_SETUP.md  # Apps Script 設置指南
├── GOOGLE_SHEETS_SETUP.md       # Google Sheets 設置指南
├── 解決401錯誤指南.md            # 常見問題解決
└── README.md                    # 本檔案
```

## 設定指南

### Google Apps Script 設定
詳見 `GOOGLE_APPS_SCRIPT_SETUP.md`

關鍵步驟：
1. 在 Google Sheet 中開啟 Apps Script
2. 複製提供的程式碼
3. 部署為「網頁應用程式」
4. 設定為「所有人可存取」

### Google Sheets 設定
詳見 `GOOGLE_SHEETS_SETUP.md`

表格欄位結構：
| id | name | type | condition | admissionDate | reviewDate | finalReviewDate | dischargeDate | status |
|----|------|------|-----------|---------------|----------|-----------------|---------------|--------|

## 功能特性

✅ **雲端資料同步** - 所有資料自動同步到 Google Sheets
✅ **即時評估** - 14 個評估量表即時計分
✅ **條件篩選** - 根據個案狀況自動篩選相關量表
✅ **進度追蹤** - 6 個評估里程碑進度管理
✅ **時間追蹤** - 精確到分鐘的時間記錄
✅ **Loading 提示** - 操作進行中的視覺反饋
✅ **響應式設計** - 適配各種螢幕尺寸
✅ **無需部署** - 純前端實現，靜態檔案即可運行

## 常見問題

### Q: 為什麼出現 401 錯誤？
A: 詳見 `解決401錯誤指南.md`。主要原因是 API Key 無法進行寫入操作，需要使用 Google Apps Script 作為中介層。

### Q: 如何新增自訂評估量表？
A: 複製現有量表 HTML 檔案並修改對應的題目和計分邏輯。

### Q: 資料可以備份嗎？
A: 可以。所有資料都儲存在 Google Sheets 中，可直接在 Google Drive 中備份或匯出。

### Q: 如何支援多語言？
A: 修改 HTML 檔案中的標籤文字，或實作國際化（i18n）解決方案。

## 開發指南

### 新增評估量表步驟

1. 建立新 HTML 檔案（例如：`量表-newscale.html`）
2. 複製現有量表的 HTML 結構
3. 修改題目和選項
4. 實作計分函數
5. 在 `AI智慧個管系統.html` 中新增量表連結

### 修改樣式

全域樣式在 `styles.css` 中。個別頁面的樣式在各自的 `<style>` 標籤中。

### 與 Google Sheets 同步

使用 `syncToGoogleSheets()` 函數進行資料同步：
```javascript
await syncToGoogleSheets();
```

## 授權

此專案為內部使用，具體授權條款待定。

## 聯絡方式

如有任何問題或建議，請透過 GitHub Issues 進行反饋。

---

**最後更新**: 2025 年 12 月 16 日
**版本**: 1.0.0

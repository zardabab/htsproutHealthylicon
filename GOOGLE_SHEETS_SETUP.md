# Google Sheets API 設置指南

## 試算表資訊
- **試算表 ID**: `1x32_JhOr0BTeoiS3gaw48Le8mJtiwd597DOjKyInoeU`
- **範圍**: `個案管理!A1:I1000`（根據實際欄位調整）

## 設置步驟

### 步驟 1: 建立 Google Cloud 專案
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊左上角的專案選擇器 → 新建專案
3. 命名為 `台灣健康個管系統`，點擊建立
4. 等待專案建立完成

### 步驟 2: 啟用 Google Sheets API
1. 在 Google Cloud Console 中，確保已選擇你的專案
2. 搜尋框輸入 `Google Sheets API`
3. 點擊 Google Sheets API → 點擊「啟用」

### 步驟 3: 建立 API 金鑰（API Key）
1. 左側導覽 → 選擇「認證」
2. 點擊「建立認證」→ 選擇「API 金鑰」
3. 複製產生的 API 金鑰，貼到下方的設定中
4. **重要：啟用寫入權限**
   - 點擊「編輯 API 金鑰」
   - **應用程式限制**: 選擇「HTTP 網域」
   - 新增你的域名（例如：localhost、你的伺服器 IP 或 *.github.io）
   - **API 限制**: 只選擇 Google Sheets API
   
5. **設定試算表權限**（關鍵步驟）：
   - 開啟你的 Google Sheet
   - 點擊右上角「共用」
   - 在「一般存取權」選擇：**「知道連結的任何人」都可以「編輯」**
   - ⚠️ 注意：必須設為「編輯」權限，API 才能寫入資料
   - 如果只設為「檢視」，則只能讀取，無法新增/修改/刪除

### 步驟 4: 設定試算表
1. 確保你的試算表的第一列包含欄位名稱：
   - `id` (個案編號)
   - `name` (姓名)
   - `type` (類型)
   - `condition` (狀況)
   - `admissionDate` (入住時間)
   - `reviewDate` (複評時間)
   - `finalReviewDate` (結評時間)
   - `dischargeDate` (出院時間)
   - `status` (評估進度 - JSON 格式或分欄)
   
2. 將試算表名稱設為 `個案管理`（或修改程式碼的 sheet 名稱）

### 步驟 5: 在 HTML 中設定 API 金鑰
在 `AI個案管理名單.html` 中的 JavaScript 部分找到：
```javascript
const SHEETS_API_KEY = 'YOUR_API_KEY_HERE';
```
將 `YOUR_API_KEY_HERE` 替換為你的實際 API 金鑰

## 驗證設置是否成功
- 打開 HTML 頁面，檢查瀏覽器控制台（F12）
- 如果看到 `✓ Cases loaded from Google Sheets` 或載入成功的訊息，表示設置完成
- 如果看到錯誤訊息，檢查：
  1. API 金鑰是否正確
  2. Google Sheets API 是否已啟用
  3. 試算表是否公開或設定了正確的共用權限

## 試算表欄位配置範例

| id | name | type | condition | admissionDate | reviewDate | finalReviewDate | dischargeDate | status |
|----|------|------|-----------|---------------|-----------|-----------------|---------------|--------|
| C001 | 王大明 | PAC | 腦中風 | 2024-11-01 | 2024-11-23 | 2024-12-20 | 2025-01-05 | {"初評":true,"22天複評":false,...} |
| C002 | 李小華 | PAC | 神經損傷 | 2024-10-15 | 2024-11-06 | 2024-12-05 | 2025-01-10 | {"初評":true,"22天複評":true,...} |

## 常見問題

**Q: 如何讓他人編輯試算表？**
- A: 在試算表「共用」設定中加入編輯權限

**Q: 性能考慮？**
- A: 每次讀取整個範圍，寫入時會覆蓋整個資料區域

**Q: 寫入權限安全性？**
- A: 目前使用「知道連結的任何人都可以編輯」，適合內部系統。若需更高安全性，建議：
  1. 改用 Service Account 認證（需後端）
  2. 使用 OAuth 2.0 用戶認證
  3. 設定 API 金鑰的 HTTP Referrer 限制

**Q: 為什麼寫入失敗？**
- A: 檢查以下項目：
  1. 試算表共用權限是否設為「編輯」（不是「檢視」）
  2. API 金鑰是否有效
  3. 瀏覽器控制台是否有 CORS 錯誤
  4. 網域是否在 API 金鑰的允許清單中

**Q: 如何備份資料？**
- A: Google Sheets 有版本歷史記錄（檔案 → 版本記錄），可隨時還原


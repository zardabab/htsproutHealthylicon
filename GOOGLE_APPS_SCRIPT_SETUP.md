# Google Apps Script API 設置指南

## 為什麼需要 Apps Script？
- **問題**: Google Sheets API 的 API Key 只能用於唯讀操作（GET），無法執行寫入操作（PUT/POST）
- **解決方案**: 使用 Google Apps Script 建立自訂 Web API，作為中介層處理寫入操作
- **優點**: 
  - 無需 OAuth 2.0 複雜流程
  - 完全免費
  - 安全且易於管理

## 設置步驟

### 步驟 1: 開啟 Google Sheets 並建立 Apps Script
1. 開啟你的 Google Sheet：https://docs.google.com/spreadsheets/d/1x32_JhOr0BTeoiS3gaw48Le8mJtiwd597DOjKyInoeU/edit
2. 點擊「擴充功能」→「Apps Script」
3. 刪除預設的 `myFunction()` 程式碼

### 步驟 2: 貼上以下程式碼

```javascript
// ===== Google Apps Script API 中介層 =====

// GET 請求：讀取個案資料
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個案管理');
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      error: '找不到「個案管理」工作表'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const cases = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: cases
  })).setMimeType(ContentService.MimeType.JSON);
}

// POST 請求：寫入/更新個案資料
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個案管理');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: '找不到「個案管理」工作表'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 解析請求資料
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    
    if (action === 'sync') {
      // 同步所有資料（覆蓋整個資料區）
      const cases = postData.cases;
      
      // 清除現有資料（保留標題列）
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 9).clearContent();
      }
      
      // 寫入新資料
      if (cases && cases.length > 0) {
        const values = cases.map(c => [
          c.id,
          c.name,
          c.type,
          c.condition,
          c.admissionDate,
          c.reviewDate,
          c.finalReviewDate,
          c.dischargeDate,
          JSON.stringify(c.status)
        ]);
        
        sheet.getRange(2, 1, values.length, 9).setValues(values);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: `成功同步 ${cases.length} 筆資料`
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: '未知的操作'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 步驟 3: 部署為 Web 應用程式
1. 點擊上方的「部署」→「新增部署作業」
2. 點擊「選取類型」旁的齒輪圖示 → 選擇「網頁應用程式」
3. 填寫設定：
   - **說明**: `個案管理 API v1`
   - **執行身分**: 選擇「我」
   - **具有應用程式存取權的使用者**: 選擇「**所有人**」（重要！）
4. 點擊「部署」
5. 授權應用程式（第一次需要授權）
6. 複製「網頁應用程式網址」（類似：`https://script.google.com/macros/s/AKfycby.../exec`）

### 步驟 4: 更新 HTML 中的 API 設定
在 `AI個案管理名單.html` 中找到以下部分並修改：

```javascript
// 將這一行改為你的 Apps Script Web 應用程式網址
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

## 測試部署
在瀏覽器中訪問你的 Apps Script URL：
```
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

應該會返回 JSON 格式的個案資料。

## 常見問題

**Q: 顯示「需要授權」錯誤？**
- A: 確保在步驟 3 選擇了「所有人」都可存取

**Q: 如何更新 Apps Script 程式碼？**
- A: 修改程式碼後，點擊「部署」→「管理部署作業」→ 點擊「編輯」→ 更新「版本」為「新版本」→ 部署

**Q: 資料同步失敗？**
- A: 檢查瀏覽器控制台錯誤訊息，確認 Apps Script URL 正確

## 安全性說明
- Apps Script 執行於 Google 伺服器，比 API Key 更安全
- 可透過檢查 `e.parameter` 或 `e.postData` 加入額外驗證
- 建議定期檢查「部署作業」的訪問日誌

## 進階：加入驗證機制（選用）
在 Apps Script 中加入簡單的 Token 驗證：

```javascript
const SECRET_TOKEN = 'your-secret-token-here';

function doPost(e) {
  // 驗證 token
  const token = e.parameter.token || JSON.parse(e.postData.contents).token;
  if (token !== SECRET_TOKEN) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: '無效的驗證 token'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // ... 其餘程式碼
}
```

然後在 HTML 中的請求加入 token 參數。

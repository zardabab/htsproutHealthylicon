# 系統資安機制指南

## 📋 目錄
1. [現狀分析](#現狀分析)
2. [資安威脅與風險](#資安威脅與風險)
3. [多層防護架構](#多層防護架構)
4. [實施方案](#實施方案)
5. [檢查清單](#檢查清單)

---

## 現狀分析

### 當前系統特點
- **前端**: 純 HTML/JavaScript（客戶端執行）
- **後端**: Google Apps Script（Google 託管）
- **資料儲存**: Google Sheets（Google Cloud）
- **認證**: 無認證機制（公開 API）
- **加密**: 傳輸層加密（HTTPS）

### 風險等級
🟡 **中等風險** - 需要加強防護

---

## 資安威脅與風險

### 1️⃣ API 濫用風險 (高)
**威脅**: Apps Script URL 被未授權者使用
**風險**: 資料被竄改、新增、刪除
**等級**: 🔴 高危

### 2️⃣ 資料外洩風險 (中)
**威脅**: 個案敏感資料被竄改或竊取
**風險**: 隱私洩露、醫療資訊外洩
**等級**: 🔴 高危

### 3️⃣ XSS 攻擊風險 (中)
**威脅**: 注入惡意 JavaScript 代碼
**風險**: 竊取用戶信息、植入惡意代碼
**等級**: 🟡 中危

### 4️⃣ SQL 注入風險 (低)
**威脅**: 無（使用 Google Sheets，無 SQL）
**等級**: 🟢 低危

### 5️⃣ CSRF 攻擊風險 (中)
**威脅**: 跨站請求偽造
**風險**: 未經授權的資料操作
**等級**: 🟡 中危

---

## 多層防護架構

```
┌─────────────────────────────────────┐
│   第 1 層：前端安全                   │
│  (输入验证、XSS防护、CSP)            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   第 2 層：傳輸層安全                 │
│  (HTTPS、CORS、簽名驗證)             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   第 3 層：API 安全                   │
│  (Token 驗證、請求簽名、限速)        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   第 4 層：資料安全                   │
│  (加密、驗證、授權檢查)              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│   第 5 層：監控與記錄                 │
│  (審計日誌、異常檢測)                │
└─────────────────────────────────────┘
```

---

## 實施方案

### 📌 方案 1: 簡單安全 (立即可用)

#### 1.1 為 Apps Script 新增 Token 驗證

**修改 Google Apps Script 程式碼**:

```javascript
// 設置安全 Token（修改為強密碼）
const SECURITY_TOKEN = 'your-secure-token-here-change-this';

// 驗證 Token 函數
function validateToken(token) {
  if (!token || token !== SECURITY_TOKEN) {
    return false;
  }
  return true;
}

// 修改 doGet 函數
function doGet(e) {
  // 驗證 Token
  const token = e.parameter.token;
  if (!validateToken(token)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unauthorized: Invalid token'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 原有邏輯...
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個案管理');
  // ... 其他代碼
}

// 修改 doPost 函數
function doPost(e) {
  // 驗證 Token
  const postData = JSON.parse(e.postData.contents);
  const token = postData.token;
  
  if (!validateToken(token)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unauthorized: Invalid token'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 原有邏輯...
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個案管理');
  // ... 其他代碼
}
```

#### 1.2 在 HTML 中新增 Token

在 `AI個案管理名單.html` 中修改：

```javascript
// 設置 API Token（必須與 Apps Script 中的相同）
const SECURITY_TOKEN = 'your-secure-token-here-change-this';

// 修改所有 fetch 請求
const payload = {
    action: 'sync',
    token: SECURITY_TOKEN,  // 新增
    cases: cases.map(c => ({...}))
};
```

#### 1.3 輸入驗證

```javascript
// 輸入驗證函數
function validateCaseData(caseData) {
    // 驗證個案編號格式
    if (!caseData.id || !/^C\d{3}$/.test(caseData.id)) {
        throw new Error('個案編號格式不正確，應為 C + 3 位數字');
    }
    
    // 驗證姓名（不超過 50 字元）
    if (!caseData.name || caseData.name.length > 50) {
        throw new Error('姓名長度不正確');
    }
    
    // 驗證類型
    const validTypes = ['PAC', '居家', '社區'];
    if (!validTypes.includes(caseData.type)) {
        throw new Error('類型不正確');
    }
    
    // 驗證狀況
    const validConditions = ['脆骨', '神經損傷', '腦中風', '衰弱高齡'];
    if (!validConditions.includes(caseData.condition)) {
        throw new Error('狀況不正確');
    }
    
    return true;
}
```

#### 1.4 XSS 防護

```javascript
// HTML 轉義函數
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 在顯示資料時使用
tr.innerHTML = `
    <td><strong>${escapeHtml(c.id)}</strong></td>
    <td><i class="fas fa-user-circle text-primary me-2"></i>${escapeHtml(c.name)}</td>
    <td><span class="badge bg-primary">${escapeHtml(c.type)}</span></td>
    <td><span class="badge-condition ${escapeHtml(conditionClass)}">${escapeHtml(c.condition)}</span></td>
    <!-- 其他欄位... -->
`;
```

---

### 📌 方案 2: 中等安全 (建議實施)

#### 2.1 HMAC 簽名驗證

**在 Apps Script 中**:

```javascript
// 使用 HMAC-SHA256 簽名
const SECRET_KEY = 'your-secret-key-generate-random-string';

function generateSignature(data, timestamp) {
  const message = data + timestamp;
  const signature = Utilities.computeHmacSignature(
    Utilities.MacAlgorithm.HMAC_SHA_256,
    message,
    SECRET_KEY,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64Encode(signature);
}

function verifySignature(data, timestamp, signature) {
  const expectedSignature = generateSignature(data, timestamp);
  return signature === expectedSignature;
}

function doPost(e) {
  const postData = JSON.parse(e.postData.contents);
  const timestamp = postData.timestamp;
  const signature = postData.signature;
  const data = JSON.stringify(postData.data);
  
  // 檢查時間戳（防止重放攻擊）
  const now = Date.now();
  if (Math.abs(now - timestamp) > 300000) { // 5 分鐘
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Request timestamp expired'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 驗證簽名
  if (!verifySignature(data, timestamp, signature)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unauthorized: Invalid signature'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 原有邏輯...
}
```

**在 HTML 中**:

```javascript
const SECRET_KEY = 'your-secret-key-generate-random-string';

function generateSignature(data, timestamp) {
  const message = data + timestamp;
  // 使用 CryptoJS 或內置加密 API
  return CryptoJS.HmacSHA256(message, SECRET_KEY).toString();
}

async function syncToGoogleSheets() {
  const timestamp = Date.now();
  const payload = {
    action: 'sync',
    data: {
      cases: cases.map(c => ({...}))
    },
    timestamp: timestamp
  };
  
  const dataStr = JSON.stringify(payload.data);
  const signature = generateSignature(dataStr, timestamp);
  
  const finalPayload = {
    ...payload,
    signature: signature
  };
  
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(finalPayload)
  });
  
  // 處理響應...
}
```

#### 2.2 API 限速

**在 Apps Script 中**:

```javascript
// 使用 Properties Service 記錄請求
function isRateLimited(userId) {
  const properties = PropertiesService.getScriptProperties();
  const key = `rateLimit_${userId}`;
  const data = JSON.parse(properties.getProperty(key) || '{}');
  const now = Date.now();
  
  // 1 分鐘內最多 30 個請求
  const limitData = data.requests || [];
  const recentRequests = limitData.filter(t => now - t < 60000);
  
  if (recentRequests.length >= 30) {
    return true;
  }
  
  recentRequests.push(now);
  properties.setProperty(key, JSON.stringify({
    requests: recentRequests
  }));
  
  return false;
}

function doPost(e) {
  const userId = 'user'; // 可改為真實用戶 ID
  
  if (isRateLimited(userId)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Rate limit exceeded. Please try again later.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 原有邏輯...
}
```

#### 2.3 CORS 防護

**在 Apps Script 中**:

```javascript
function doPost(e) {
  const allowedOrigins = [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ];
  
  const origin = e.parameter.origin || e.source.getUrl();
  
  if (!allowedOrigins.includes(origin)) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'CORS policy violation'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 原有邏輯...
}
```

---

### 📌 方案 3: 強安全 (完整保護)

#### 3.1 添加審計日誌

**在 Apps Script 中**:

```javascript
function logAuditTrail(action, userId, data, success, error) {
  const auditSheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('審計日誌') || 
    SpreadsheetApp.getActiveSpreadsheet()
    .insertSheet('審計日誌', 0);
  
  auditSheet.appendRow([
    new Date().toISOString(),
    userId,
    action,
    JSON.stringify(data),
    success ? 'SUCCESS' : 'FAILED',
    error || '',
    Utilities.getUuid()
  ]);
}
```

#### 3.2 資料加密

```javascript
// 在傳輸時加密敏感資料
function encryptData(data, encryptionKey) {
  // 使用 TweetNaCl.js 或 libsodium
  const encrypted = nacl.secretbox(
    nacl.util.decodeUTF8(JSON.stringify(data)),
    nacl.util.decodeBase64(encryptionKey)
  );
  return nacl.util.encodeBase64(encrypted);
}

function decryptData(encryptedData, encryptionKey) {
  const decrypted = nacl.secretbox.open(
    nacl.util.decodeBase64(encryptedData),
    nacl.util.decodeBase64(encryptionKey)
  );
  return JSON.parse(nacl.util.encodeUTF8(decrypted));
}
```

---

## 檢查清單

### 🔐 立即實施 (優先級: 🔴 高)
- [ ] 為 Apps Script 新增 Token 驗證
- [ ] 在 HTML 中添加 Token
- [ ] 實施輸入驗證
- [ ] 添加 XSS 防護（HTML 轉義）
- [ ] 使用 HTTPS（已有）
- [ ] 定期修改 Token

### 🛡️ 建議實施 (優先級: 🟡 中)
- [ ] 實施 HMAC-SHA256 簽名驗證
- [ ] 添加 API 限速
- [ ] 配置 CORS 白名單
- [ ] 新增時間戳驗證（防重放攻擊）
- [ ] 設置內容安全策略 (CSP)
- [ ] 啟用 HTTP 安全頭

### 🔒 進階保護 (優先級: 🟢 低)
- [ ] 實施審計日誌
- [ ] 添加資料加密
- [ ] 實施加密備份
- [ ] 添加雙因素認證 (2FA)
- [ ] 實施角色基訪問控制 (RBAC)
- [ ] 添加異常檢測

---

## 實施步驟

### 第 1 週：基礎安全
1. 修改 Google Apps Script 新增 Token
2. 更新所有 HTML 檔案
3. 測試 Token 驗證
4. 新增輸入驗證

### 第 2 週：進階安全
1. 實施 HMAC 簽名
2. 添加 API 限速
3. 配置 CORS
4. 設置 CSP 頭

### 第 3 週：監控與記錄
1. 建立審計日誌表
2. 實施日誌記錄
3. 建立監控面板
4. 定期審查日誌

---

## 安全最佳實踐

### ✅ DO（應該做）
- ✅ 定期更新 Token
- ✅ 使用 HTTPS
- ✅ 驗證所有輸入
- ✅ 記錄所有操作
- ✅ 定期進行安全審計
- ✅ 使用強密碼 / Token
- ✅ 限制 API 存取次數
- ✅ 備份敏感資料

### ❌ DON'T（不應該做）
- ❌ 在代碼中暴露密鑰
- ❌ 使用弱密碼或預設密碼
- ❌ 信任用戶輸入
- ❌ 在日誌中記錄敏感資料
- ❌ 禁用 HTTPS
- ❌ 使用已知易受攻擊的庫
- ❌ 在前端硬編碼敏感資料
- ❌ 忽視安全警告

---

## 常見安全問題 Q&A

### Q: Token 被洩露怎麼辦？
A: 立即修改 Apps Script 中的 Token，並更新所有 HTML 檔案。

### Q: 如何檢測異常操作？
A: 查看審計日誌，找出異常的時間、IP、操作。

### Q: 是否需要加密資料庫？
A: Google Sheets 已有傳輸加密，敏感個案資訊建議額外加密。

### Q: 如何定期檢查安全性？
A: 每月進行安全審計，檢查日誌、更新依賴。

---

## 資源連結

- [OWASP 安全指南](https://owasp.org/)
- [Google Cloud 安全最佳實踐](https://cloud.google.com/security/best-practices)
- [MDN Web 安全指南](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

**最後更新**: 2025 年 12 月 16 日
**版本**: 1.0.0
**責任單位**: 資安管理部門

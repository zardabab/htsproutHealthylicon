// ===== Google Apps Script - 安全版本 =====
// 複製整個代碼到你的 Apps Script 編輯器中

// ❗ 重要：修改以下安全設定
const SECURITY_TOKEN = 'CHANGE_ME_TO_STRONG_PASSWORD_12345'; // 改為複雜密碼
const ALLOWED_DOMAINS = [
  'localhost:8000',
  'localhost:3000',
  'your-domain.com'  // 改為你的域名
];

// ===== 驗證函數 =====

/**
 * 驗證安全 Token
 * @param {string} token - 提供的 token
 * @returns {boolean} 驗證結果
 */
function validateToken(token) {
  if (!token || token !== SECURITY_TOKEN) {
    console.warn('Invalid token attempt');
    return false;
  }
  return true;
}

/**
 * 驗證請求來源
 * @param {string} origin - 請求來源
 * @returns {boolean} 驗證結果
 */
function validateOrigin(origin) {
  if (!origin) return true; // 本地測試允許
  return ALLOWED_DOMAINS.some(domain => origin.includes(domain));
}

/**
 * 驗證個案資料格式
 * @param {object} caseData - 個案資料
 * @throws {Error} 如果資料無效
 */
function validateCaseData(caseData) {
  if (!caseData.id || typeof caseData.id !== 'string' || caseData.id.length === 0) {
    throw new Error('Invalid case ID');
  }
  if (!caseData.name || typeof caseData.name !== 'string' || caseData.name.length > 100) {
    throw new Error('Invalid case name');
  }
  const validTypes = ['PAC', '居家', '社區'];
  if (!validTypes.includes(caseData.type)) {
    throw new Error('Invalid case type');
  }
  const validConditions = ['脆骨', '神經損傷', '腦中風', '衰弱高齡'];
  if (!validConditions.includes(caseData.condition)) {
    throw new Error('Invalid case condition');
  }
}

/**
 * 審計日誌記錄
 * @param {string} action - 操作類型
 * @param {string} status - 操作狀態 (SUCCESS/FAILED)
 * @param {object} data - 操作資料
 * @param {string} error - 錯誤訊息（如有）
 */
function logAuditTrail(action, status, data, error = '') {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let auditSheet = spreadsheet.getSheetByName('審計日誌');
    
    // 若沒有審計日誌工作表，自動建立
    if (!auditSheet) {
      auditSheet = spreadsheet.insertSheet('審計日誌', 0);
      auditSheet.appendRow(['時間', '操作', '狀態', '資料筆數', '錯誤', '識別碼']);
    }
    
    auditSheet.appendRow([
      new Date().toISOString(),
      action,
      status,
      data ? Object.keys(data).length : 0,
      error,
      Utilities.getUuid()
    ]);
  } catch (e) {
    console.error('Audit log error:', e);
  }
}

// ===== 主要 API 函數 =====

/**
 * GET 請求：讀取個案資料
 */
function doGet(e) {
  try {
    // 驗證 Token
    const token = e.parameter.token;
    if (!validateToken(token)) {
      logAuditTrail('READ', 'FAILED', null, 'Invalid token');
      return createJsonResponse({
        success: false,
        error: 'Unauthorized: Invalid token'
      }, 401);
    }

    // 驗證來源
    const origin = e.parameter.origin;
    if (!validateOrigin(origin)) {
      logAuditTrail('READ', 'FAILED', null, 'Invalid origin');
      return createJsonResponse({
        success: false,
        error: 'Unauthorized: Invalid origin'
      }, 403);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個案管理');
    
    if (!sheet) {
      logAuditTrail('READ', 'FAILED', null, 'Sheet not found');
      return createJsonResponse({
        success: false,
        error: '找不到「個案管理」工作表'
      }, 404);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).filter(row => row[0]); // 過濾空白列
    
    const cases = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    logAuditTrail('READ', 'SUCCESS', { count: cases.length });
    
    return createJsonResponse({
      success: true,
      data: cases,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('doGet error:', error);
    logAuditTrail('READ', 'FAILED', null, error.toString());
    return createJsonResponse({
      success: false,
      error: error.toString()
    }, 500);
  }
}

/**
 * POST 請求：寫入/更新個案資料
 */
function doPost(e) {
  try {
    // 解析請求
    const postData = JSON.parse(e.postData.contents);
    const token = postData.token;
    const action = postData.action;
    
    // 驗證 Token
    if (!validateToken(token)) {
      logAuditTrail('WRITE_' + action, 'FAILED', null, 'Invalid token');
      return createJsonResponse({
        success: false,
        error: 'Unauthorized: Invalid token'
      }, 401);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('個案管理');
    
    if (!sheet) {
      logAuditTrail('WRITE_' + action, 'FAILED', null, 'Sheet not found');
      return createJsonResponse({
        success: false,
        error: '找不到「個案管理」工作表'
      }, 404);
    }
    
    if (action === 'sync') {
      // 同步個案資料
      const cases = postData.cases || [];
      
      // 驗證所有個案資料
      for (let i = 0; i < cases.length; i++) {
        try {
          validateCaseData(cases[i]);
        } catch (validationError) {
          logAuditTrail('SYNC', 'FAILED', { index: i }, validationError.toString());
          return createJsonResponse({
            success: false,
            error: `資料驗證失敗 (行 ${i + 1}): ${validationError.message}`
          }, 400);
        }
      }
      
      // 清除現有資料（保留標題列）
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 9).clearContent();
      }
      
      // 寫入新資料
      if (cases.length > 0) {
        const values = cases.map(c => [
          c.id,
          c.name,
          c.type,
          c.condition,
          c.admissionDate || '',
          c.reviewDate || '',
          c.finalReviewDate || '',
          c.dischargeDate || '',
          c.status ? JSON.stringify(c.status) : '{}'
        ]);
        
        sheet.getRange(2, 1, values.length, 9).setValues(values);
      }
      
      logAuditTrail('SYNC', 'SUCCESS', { count: cases.length });
      
      return createJsonResponse({
        success: true,
        message: `成功同步 ${cases.length} 筆資料`,
        timestamp: new Date().toISOString()
      });
    }
    
    logAuditTrail('WRITE', 'FAILED', { action }, 'Unknown action');
    return createJsonResponse({
      success: false,
      error: '未知的操作'
    }, 400);
    
  } catch (error) {
    console.error('doPost error:', error);
    logAuditTrail('WRITE', 'FAILED', null, error.toString());
    return createJsonResponse({
      success: false,
      error: error.toString()
    }, 500);
  }
}

/**
 * 建立 JSON 響應
 */
function createJsonResponse(data, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== 管理函數 =====

/**
 * 重置 Token（需手動執行）
 * 在 Apps Script 編輯器中選擇此函數並按 Run
 */
function resetSecurityToken() {
  const newToken = 'NEW_TOKEN_' + Utilities.getUuid().substring(0, 20);
  console.log('New security token:');
  console.log(newToken);
  console.log('記住將此 token 更新到 HTML 檔案中！');
}

/**
 * 檢查審計日誌
 */
function viewAuditTrail() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const auditSheet = spreadsheet.getSheetByName('審計日誌');
  
  if (!auditSheet) {
    console.log('No audit trail found');
    return;
  }
  
  const data = auditSheet.getDataRange().getValues();
  console.log(`Found ${data.length - 1} audit entries`);
  
  // 顯示最近 10 筆
  for (let i = Math.max(1, data.length - 10); i < data.length; i++) {
    console.log(data[i]);
  }
}

/**
 * 清除審計日誌（謹慎使用）
 */
function clearAuditTrail() {
  if (!confirm('確定要清除所有審計日誌嗎？此操作無法撤銷。')) {
    return;
  }
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const auditSheet = spreadsheet.getSheetByName('審計日誌');
  
  if (auditSheet) {
    const lastRow = auditSheet.getLastRow();
    if (lastRow > 1) {
      auditSheet.getRange(2, 1, lastRow - 1, 6).clearContent();
      console.log('Audit trail cleared');
    }
  }
}

// ===== 前端安全實施代碼段 =====
// 將以下代碼添加到 AI個案管理名單.html 中

// ===== 第 1 部分：安全設定 =====

// ❗ 重要：修改為你的 Token（必須與 Apps Script 中的相同）
const SECURITY_TOKEN = 'CHANGE_ME_TO_STRONG_PASSWORD_12345';

// 當前域名（用於來源驗證）
const CURRENT_ORIGIN = window.location.origin;

// ===== 第 2 部分：輸入驗證函數 =====

/**
 * 驗證個案資料格式
 * @throws {Error} 如果資料無效
 */
function validateCaseInput(caseData) {
  // 驗證個案編號
  if (!caseData.id || caseData.id.trim().length === 0) {
    throw new Error('個案編號不能為空');
  }
  if (caseData.id.length > 20) {
    throw new Error('個案編號過長');
  }
  
  // 驗證姓名
  if (!caseData.name || caseData.name.trim().length === 0) {
    throw new Error('姓名不能為空');
  }
  if (caseData.name.length > 100) {
    throw new Error('姓名過長');
  }
  
  // 驗證類型
  const validTypes = ['PAC', '居家', '社區'];
  if (!validTypes.includes(caseData.type)) {
    throw new Error('類型選擇不正確');
  }
  
  // 驗證狀況
  const validConditions = ['脆骨', '神經損傷', '腦中風', '衰弱高齡'];
  if (!validConditions.includes(caseData.condition)) {
    throw new Error('狀況選擇不正確');
  }
  
  // 驗證日期格式（ISO 8601）
  const dateFields = ['admissionDate', 'reviewDate', 'finalReviewDate', 'dischargeDate'];
  dateFields.forEach(field => {
    if (caseData[field] && !isValidDateTime(caseData[field])) {
      throw new Error(`${field} 格式不正確`);
    }
  });
  
  return true;
}

/**
 * 驗證日期時間格式
 */
function isValidDateTime(dateString) {
  if (!dateString) return true;
  // ISO 8601 格式: YYYY-MM-DDTHH:MM 或 YYYY-MM-DD HH:MM
  const isoRegex = /^\d{4}-\d{2}-\d{2}T?\s?\d{2}:\d{2}/;
  return isoRegex.test(dateString);
}

/**
 * 轉義 HTML 防止 XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 轉義 JavaScript 字符串
 */
function escapeJs(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

// ===== 第 3 部分：修改 saveCase 函數 =====

/**
 * 修改後的 saveCase 函數（添加驗證）
 */
async function saveCaseWithSecurity() {
  const form = document.getElementById('caseForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  try {
    const status = {};
    milestones.forEach(m => {
      const checkbox = document.getElementById(`status-${m}`);
      status[m] = checkbox ? checkbox.checked : false;
    });

    const caseData = {
      id: document.getElementById('caseId').value.trim(),
      name: document.getElementById('caseName').value.trim(),
      type: document.getElementById('caseType').value,
      condition: document.getElementById('caseCondition').value,
      admissionDate: document.getElementById('admissionDate').value,
      reviewDate: document.getElementById('reviewDate').value,
      finalReviewDate: document.getElementById('finalReviewDate').value,
      dischargeDate: document.getElementById('dischargeDate').value,
      status: status,
      closed: false
    };

    // 驗證輸入
    validateCaseInput(caseData);

    const index = document.getElementById('caseIndex').value;
    if (index === '') {
      cases.push(caseData);
    } else {
      cases[parseInt(index)] = caseData;
    }

    // 同步到 Google Sheets
    showLoading('正在同步資料到 Google Sheets...');
    try {
      await syncToGoogleSheetsWithSecurity();
      renderTable();
      bootstrap.Modal.getInstance(document.getElementById('caseModal')).hide();
      hideLoading();
      alert('✓ 個案已成功儲存並同步到 Google Sheets！');
    } catch (error) {
      console.error('同步失敗:', error);
      renderTable();
      bootstrap.Modal.getInstance(document.getElementById('caseModal')).hide();
      hideLoading();
      alert(`⚠️ 個案已在本地儲存，但同步到 Google Sheets 失敗：\n${error.message}`);
    }
  } catch (validationError) {
    alert(`❌ 輸入驗證失敗：\n${validationError.message}`);
  }
}

// ===== 第 4 部分：修改同步函數（添加 Token） =====

/**
 * 帶安全驗證的同步函數
 */
async function syncToGoogleSheetsWithSecurity() {
  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE') {
    throw new Error('請先設定 APPS_SCRIPT_URL');
  }

  if (!SECURITY_TOKEN || SECURITY_TOKEN === 'CHANGE_ME_TO_STRONG_PASSWORD_12345') {
    throw new Error('請先設定安全 Token');
  }

  const payload = {
    token: SECURITY_TOKEN,  // 添加 Token
    origin: CURRENT_ORIGIN,  // 添加來源驗證
    action: 'sync',
    cases: cases.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      condition: c.condition,
      admissionDate: c.admissionDate,
      reviewDate: c.reviewDate,
      finalReviewDate: c.finalReviewDate,
      dischargeDate: c.dischargeDate,
      status: c.status
    })),
    timestamp: new Date().toISOString()  // 添加時間戳
  };

  // 詳細的 URL 構建（包含查詢參數）
  const url = `${APPS_SCRIPT_URL}?token=${encodeURIComponent(SECURITY_TOKEN)}&origin=${encodeURIComponent(CURRENT_ORIGIN)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'  // CSRF 防護
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP 錯誤 ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || '同步失敗');
  }

  console.log('✓ 資料已成功同步到 Google Sheets:', result.message);
  return result;
}

// ===== 第 5 部分：修改 loadCasesFromGoogleSheets（添加安全驗證） =====

/**
 * 帶安全驗證的載入函數
 */
async function loadCasesFromGoogleSheetsWithSecurity() {
  showLoading('正在載入個案資料...');
  try {
    if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL_HERE') {
      throw new Error('請先設定 APPS_SCRIPT_URL！');
    }

    if (!SECURITY_TOKEN || SECURITY_TOKEN === 'CHANGE_ME_TO_STRONG_PASSWORD_12345') {
      throw new Error('請先設定安全 Token');
    }

    console.log('🔍 透過 Apps Script 載入資料...');
    
    // 添加 Token 和來源驗證
    const url = `${APPS_SCRIPT_URL}?token=${encodeURIComponent(SECURITY_TOKEN)}&origin=${encodeURIComponent(CURRENT_ORIGIN)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP 錯誤 ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '載入失敗');
    }

    const rows = result.data || [];

    cases = rows.map(row => {
      try {
        // 驗證資料格式
        if (!row.id) return null;
        
        let status = {};
        if (row.status) {
          try {
            status = typeof row.status === 'string' ? JSON.parse(row.status) : row.status;
          } catch (e) {
            status = {};
          }
        } else {
          status = milestones.reduce((obj, m) => ({ ...obj, [m]: false }), {});
        }

        return {
          id: String(row.id).trim(),
          name: String(row.name || '').trim(),
          type: String(row.type || 'PAC').trim(),
          condition: String(row.condition || '').trim(),
          admissionDate: row.admissionDate || '',
          reviewDate: row.reviewDate || '',
          finalReviewDate: row.finalReviewDate || '',
          dischargeDate: row.dischargeDate || '',
          status: status,
          closed: false
        };
      } catch (e) {
        console.error('行資料解析錯誤:', row, e);
        return null;
      }
    }).filter(c => c !== null && c.id);

    console.log(`✓ 成功從 Google Sheets 載入 ${cases.length} 筆個案資料`);
    renderTable();
  } catch (error) {
    console.error('❌ 載入 Google Sheets 資料失敗:', error);
    showErrorMessage(error.message);
  } finally {
    hideLoading();
  }
}

// ===== 第 6 部分：頁面初始化時調用安全版本 =====

// 修改 DOMContentLoaded 事件監聽器：
// document.addEventListener('DOMContentLoaded', loadCasesFromGoogleSheets);
// 改為：
document.addEventListener('DOMContentLoaded', loadCasesFromGoogleSheetsWithSecurity);

// ===== 第 7 部分：添加內容安全策略 (CSP) =====

/**
 * 在 HTML <head> 中添加以下 meta 標籤：
 * 
 * <meta http-equiv="Content-Security-Policy" 
 *       content="default-src 'self'; 
 *                script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://code.jquery.com https://cdnjs.cloudflare.com; 
 *                style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; 
 *                img-src 'self' data: https:; 
 *                font-src 'self' https://cdnjs.cloudflare.com; 
 *                connect-src 'self' https://script.google.com;">
 * 
 * 注意：如果使用了 unsafe-inline，請在生產環境考慮移除
 */

// ===== 第 8 部分：添加安全日誌 =====

/**
 * 客戶端安全日誌
 */
class SecurityLogger {
  static log(action, details, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      details,
      level,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log(`[${level.toUpperCase()}] ${action}:`, details);
    
    // 可選：發送到後端日誌服務
    if (level === 'error' || level === 'warning') {
      // await sendToLoggingService(logEntry);
    }
  }

  static info(action, details) {
    this.log(action, details, 'info');
  }

  static warning(action, details) {
    this.log(action, details, 'warning');
  }

  static error(action, details) {
    this.log(action, details, 'error');
  }
}

// 使用範例：
// SecurityLogger.info('CASE_SAVED', { id: caseId, name: caseName });
// SecurityLogger.error('SYNC_FAILED', { error: errorMessage });

// ===== 第 9 部分：添加重試機制 =====

/**
 * 帶重試的 fetch 包裝
 */
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      
      // 可重試的錯誤
      if ([408, 429, 500, 502, 503, 504].includes(response.status)) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 指數退避
          console.log(`重試 ${attempt}/${maxRetries}，等待 ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`網絡錯誤，重試 ${attempt}/${maxRetries}，等待 ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// ===== 實施檢查清單 =====

/**
 * 實施步驟：
 * 
 * 1. 後端 (Google Apps Script):
 *    ✓ 複製 SECURE_APPS_SCRIPT.gs 的全部代碼
 *    ✓ 修改 SECURITY_TOKEN 為強密碼
 *    ✓ 設定 ALLOWED_DOMAINS 為你的域名
 *    ✓ 保存並部署新版本
 * 
 * 2. 前端 (HTML):
 *    ✓ 在 AI個案管理名單.html 中添加此檔案的代碼
 *    ✓ 修改 SECURITY_TOKEN 為與後端相同的值
 *    ✓ 修改 loadCasesFromGoogleSheets 為 loadCasesFromGoogleSheetsWithSecurity
 *    ✓ 修改 saveCase 為 saveCaseWithSecurity
 *    ✓ 添加 CSP meta 標籤到 <head>
 *    ✓ 在 HTML 頭部添加此檔案
 * 
 * 3. 測試:
 *    ✓ 測試資料載入
 *    ✓ 測試新增個案
 *    ✓ 測試編輯個案
 *    ✓ 測試刪除個案
 *    ✓ 檢查審計日誌
 * 
 * 4. 部署:
 *    ✓ 更新所有 HTML 檔案的 Token
 *    ✓ 測試生產環境
 *    ✓ 監控錯誤日誌
 */

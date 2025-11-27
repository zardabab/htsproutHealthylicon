// 全域變數用於計算標題點擊次數
let clickCount = 0;
const REQUIRED_CLICKS = 5;

document.addEventListener('DOMContentLoaded', function() {
    const mainTitle = document.getElementById('main-title');
    const settingsNavItem = document.getElementById('settings-nav-item');
    
    // === 新增：標題點擊功能邏輯 (連點 5 下顯示設定檔頁籤) ===
    // 確保初始隱藏 (雖然 HTML 已經設置 style="display: none;")
    if (settingsNavItem) {
        settingsNavItem.style.display = 'none'; 
    }

    if (mainTitle && settingsNavItem) {
        mainTitle.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount >= REQUIRED_CLICKS) {
                // 達到點擊次數，顯示設定檔頁籤
                settingsNavItem.style.display = 'block';
                // 重置計數器，避免重複觸發
                clickCount = 0; 
                alert('🎉 設定檔頁籤已解鎖！'); // 給用戶一個提示
            }
        });
    }

    // === 原檔案中的評分與互動邏輯 (精簡版) ===
    
    // 常數定義
    const NRS_DESC = {
        0: "無痛", 1: "輕微疼痛", 2: "輕微疼痛", 3: "輕微疼痛", 4: "中度疼痛",
        5: "中度疼痛", 6: "中度疼痛", 7: "重度疼痛", 8: "重度疼痛", 9: "重度疼痛", 10: "最劇烈疼痛"
    };

    const CFS_DESC = {
        1: "1：非常健康", 2: "2：健康", 3: "3：維持良好", 4: "4：脆弱較易受傷害",
        5: "5：輕度衰弱", 6: "6：中度衰弱", 7: "7：嚴重衰弱", 8: "8：極度衰弱", 9: "9：末期病患"
    };
    
    // mRS 描述
    const MRS_DESC = {
        0: "0: 無任何症狀", 1: "1: 有症狀但無明顯殘障", 2: "2: 輕度殘障", 3: "3: 中度殘障",
        4: "4: 中重度殘障", 5: "5: 重度殘障", 6: "6: 死亡"
    };

    // 輔助函數：更新滑桿/選單顯示 (使用 jQuery)
    function updateSliderDisplay(slider, descMap) {
        const score = parseInt(slider.val());
        const displaySpan = $(`[data-for="${slider.attr('id')}"]`);
        displaySpan.text(descMap[score]);
        // 同步更新總分區塊的顏色
        const totalBox = $(`#${slider.attr('id')}`).closest('.tab-pane').find('.total-score-box');
        totalBox.removeClass('bg-success bg-info bg-warning bg-danger').addClass(getScoreColor(score, slider.attr('id')));
        return score;
    }
    
    // 輔助函數：根據分數 ID 獲取顏色
    function getScoreColor(score, id) {
        switch (id) {
            case 'cfs-score': return (score <= 3) ? 'bg-success' : (score <= 4) ? 'bg-warning' : 'bg-danger';
            case 'nrs-score-input': return (score >= 7) ? 'bg-danger' : (score >= 4) ? 'bg-warning' : (score >= 1) ? 'bg-info' : 'bg-success';
            default: return 'bg-primary';
        }
    }


    // 輔助函數：計算年齡
    function getPatientInfo() {
        const dobInput = $('#patientDOB').val();
        const today = new Date();
        $('#assessmentDate').text(today.toLocaleDateString('zh-TW'));
        if (dobInput) {
            const birthDate = new Date(dobInput);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            $('#patientAge').text(age);
        } else {
            $('#patientAge').text('--');
        }
    }

    // A. Barthel Index function
    function updateBarthelScore() {
        let totalScore = 0;
        $('#barthelForm input:checked').each(function() { totalScore += parseInt($(this).val()); });
        $('#barthelTotalScore').text(totalScore);
        
        let interpretation;
        let colorClass;
        if (totalScore >= 100) { interpretation = '完全獨立/不需協助'; colorClass = 'bg-success'; } 
        else if (totalScore >= 65) { interpretation = '輕度或中度依賴'; colorClass = 'bg-warning'; } 
        else { interpretation = '嚴重依賴'; colorClass = 'bg-danger'; }
        
        $('#barthelInterpretation').text(interpretation);
        $('#barthel').find('.total-score-box').removeClass('bg-primary bg-success bg-warning bg-danger').addClass(colorClass);
    }

    // B. Lawton-Brody IADL function
    function updateIadlScore() {
        let totalScore = 0;
        // 注意：這裡只計算了 HTML 中存在的 3 個項目
        $('#iadlForm input:checked').each(function() { totalScore += parseInt($(this).val()); });
        $('#iadlTotalScore').text(totalScore);
        
        // 假設總分以 3 個項目計算的判讀標準
        let interpretation;
        let colorClass;
        if (totalScore >= 3) { interpretation = '此部分獨立 (共 3 題)'; colorClass = 'bg-success'; } 
        else if (totalScore >= 2) { interpretation = '輕度功能受損'; colorClass = 'bg-warning'; } 
        else { interpretation = '中/重度功能受損'; colorClass = 'bg-danger'; }
        
        $('#iadlInterpretation').text(interpretation);
        $('#iadl').find('.total-score-box').removeClass('bg-primary bg-success bg-warning bg-danger').addClass(colorClass);
    }
    
    // C. Berg Balance Scale (BBS) function (已修正為 56 分滿分)
    function updateBergScore() {
        let totalScore = 0;
        // 確保讀取 data-value
        $('#bergForm .berg-item').each(function() { totalScore += parseInt($(this).data('value')); });
        $('#bergTotalScore').text(totalScore);
        
        // 標準 BBS 56 分的判讀標準
        let interpretation;
        let colorClass;
        if (totalScore >= 45) { 
            interpretation = '低跌倒風險 (>= 45)'; 
            colorClass = 'bg-success'; 
        } 
        else if (totalScore >= 41) { 
            interpretation = '中度跌倒風險 (41-44)'; 
            colorClass = 'bg-warning'; 
        } 
        else { 
            interpretation = '高度跌倒風險 (< 40)'; 
            colorClass = 'bg-danger'; 
        }
        
        $('#bergInterpretation').text(interpretation);
        $('#berg').find('.total-score-box').removeClass('bg-primary bg-success bg-warning bg-danger').addClass(colorClass);
    }
    
    // D. Modified Rankin Scale (mRS) function
    function updateMrsScore() {
        const score = parseInt($('#mrs-score').val());
        $('#mrsTotalScore').text(score);
        $('#mrsDescription').text(MRS_DESC[score]); // 更新下拉選單旁邊的描述

        let interpretation;
        let colorClass;
        if (score <= 2) { interpretation = '功能輕微受損'; colorClass = 'bg-success'; } 
        else if (score <= 4) { interpretation = '功能中重度受損/需協助'; colorClass = 'bg-warning'; } 
        else { interpretation = '重度殘障/完全依賴'; colorClass = 'bg-danger'; }
        
        $('#mrsInterpretation').text(interpretation);
        $('#mrs').find('.total-score-box').removeClass('bg-primary bg-success bg-warning bg-danger').addClass(colorClass);
    }

    // E. Clinical Frailty Scale (CFS) function
    function updateCfsScore() {
        const score = parseInt($('#cfs-score').val());
        $('#cfsTotalScore').text(score);
        $('[data-for="cfs-score"]').text(CFS_DESC[score]); // 更新滑桿旁邊的描述

        let interpretation;
        let colorClass;
        if (score <= 3) { interpretation = '非衰弱/健康'; colorClass = 'bg-success'; } 
        else if (score <= 4) { interpretation = '脆弱較易受傷害'; colorClass = 'bg-warning'; } 
        else { interpretation = '衰弱 (需進一步評估)'; colorClass = 'bg-danger'; }
        
        $('#cfsInterpretation').text(interpretation);
        $('#cfs').find('.total-score-box').removeClass('bg-primary bg-success bg-warning bg-danger').addClass(colorClass);
        // 同步更新滑桿顯示顏色
        $('[data-for="cfs-score"]').removeClass('bg-success bg-warning bg-danger').addClass(colorClass);
    }

    // F. Numerical Rating Scale (NRS) function
    function updateNrsScore() {
        const score = parseInt($('#nrs-score-input').val());
        $('#nrsTotalScore').text(score);
        $('[data-for="nrs-score-input"]').text(`${score}：${NRS_DESC[score]}`); // 更新滑桿旁邊的描述
        
        let interpretation = '無痛';
        let colorClass = 'bg-success';
        if (score >= 7) { interpretation = '重度疼痛'; colorClass = 'bg-danger'; } 
        else if (score >= 4) { interpretation = '中度疼痛'; colorClass = 'bg-warning'; } 
        else if (score >= 1) { interpretation = '輕度疼痛'; colorClass = 'bg-info'; }
        
        $('#nrsInterpretation').text(interpretation);
        $('#nrs').find('.total-score-box').removeClass('bg-success bg-info bg-warning bg-danger').addClass(colorClass);
        // 同步更新滑桿顯示顏色
        $('[data-for="nrs-score-input"]').removeClass('bg-success bg-info bg-warning bg-danger').addClass(colorClass);
    }
    
    // G. Gait Speed (步行速度) function
    function updateGaitSpeed() {
        const distance = 10; // 假設是 10 公尺
        const time = parseFloat($('#gaitTime').val());
        let speed = 0;
        if (time > 0) { speed = (distance / time).toFixed(2); }
        $('#gaitSpeed').text(speed);
        
        let interpretation = '無法完成';
        let colorClass = 'bg-danger';
        if (speed >= 1.0) { interpretation = '獨立行走/低風險 (>1.0 m/s)'; colorClass = 'bg-success'; } 
        else if (speed >= 0.8) { interpretation = '社區行走臨界值 (0.8-1.0 m/s)'; colorClass = 'bg-warning'; } 
        else if (speed > 0) { interpretation = '高度跌倒風險/需協助 (<0.8 m/s)'; colorClass = 'bg-danger'; }
        
        $('#gaitInterpretation').text(interpretation);
        $('#gaitBox').find('.total-score-box').removeClass('bg-success bg-warning bg-danger').addClass(colorClass);
    }

    // H. 6-Minute Walk Test (6MWT) function
    function updateSixMinsPerformance() {
        const distance = parseInt($('#sixMinsDistance').val());
        $('#sixMinsInterpretation').text(distance > 0 ? `${distance} 公尺` : '--');
        
        let interpretation = '無資料';
        let colorClass = 'bg-secondary';
        if (distance >= 450) { interpretation = '功能良好/低風險'; colorClass = 'bg-success'; } 
        else if (distance >= 300) { interpretation = '中度功能受限'; colorClass = 'bg-warning'; } 
        else if (distance > 0) { interpretation = '功能嚴重受限/高風險'; colorClass = 'bg-danger'; }
        
        // 修正 ID：上一步誤用了 #sixMinsBoxInterpretation
        $('#sixMinsBox').find('p span').text(interpretation);
        $('#sixMinsBox').find('.total-score-box').removeClass('bg-secondary bg-success bg-warning bg-danger').addClass(colorClass);
    }

    // I. Geriatric Depression Scale (GDS-5) function
    function updateGdsScore() {
        let totalScore = 0;
        $('#gdsForm select').each(function() { totalScore += parseInt($(this).val()); });
        $('#gdsTotalScore').text(totalScore);
        
        let interpretation = (totalScore >= 2) ? '可能有憂鬱傾向 (需進一步評估)' : '無憂鬱傾向';
        let colorClass = (totalScore >= 2) ? 'bg-danger' : 'bg-success';
        
        $('#gdsInterpretation').text(interpretation);
        $('#gds').find('.total-score-box').removeClass('bg-success bg-danger').addClass(colorClass);
    }

    // J. Short Portable Mental Status Questionnaire (SPMSQ) function
    function updateSpmsqScore() {
        let totalScore = 0;
        $('#spmsqForm select').each(function() { totalScore += parseInt($(this).val()); });
        $('#spmsqTotalScore').text(totalScore);
        
        let interpretation = '';
        let colorClass = 'bg-success';
        if (totalScore === 0) { interpretation = '認知功能正常'; colorClass = 'bg-success'; } 
        else if (totalScore <= 2) { interpretation = '輕度認知障礙 (0-2 錯誤)'; colorClass = 'bg-info'; } 
        else if (totalScore <= 4) { interpretation = '中度認知障礙 (3-4 錯誤)'; colorClass = 'bg-warning'; } 
        else { interpretation = '重度認知障礙 (>= 5 錯誤)'; colorClass = 'bg-danger'; }
        
        $('#spmsqInterpretation').text(interpretation);
        $('#spmsq').find('.total-score-box').removeClass('bg-success bg-info bg-warning bg-danger').addClass(colorClass);
    }

    // K. Confusion Assessment Method (CAM) function
    function updateCamScore() {
        const feat1 = parseInt($('#cam-feat1').val());
        const feat2 = parseInt($('#cam-feat2').val());
        const feat3 = parseInt($('#cam-feat3').val());
        const feat4 = parseInt($('#cam-feat4').val());
        
        // CAM 陽性條件: (Feature 1 AND Feature 2) AND (Feature 3 OR Feature 4)
        let isDelirium = (feat1 === 1 && feat2 === 1) && (feat3 === 1 || feat4 === 1);
        
        const icon = isDelirium ? '<i class="fas fa-exclamation-triangle"></i>' : '<i class="fas fa-check-circle"></i>';
        const interpretation = isDelirium ? '**符合** 瞻妄診斷 (Delirium Positive)' : '不符合瞻妄診斷';
        const colorClass = isDelirium ? 'bg-danger' : 'bg-success';

        $('#camTotalScore').html(icon);
        $('#camInterpretation').text(interpretation);
        $('#cam').find('.total-score-box').removeClass('bg-secondary bg-success bg-danger').addClass(colorClass);
    }

    // L. Mini Nutritional Assessment - Short Form (MNA-SF) function
    function updateMnaScore() {
        let totalScore = 0;
        $('#mnaForm .mna-item').each(function() { totalScore += parseInt($(this).val()); });
        $('#mnaTotalScore').text(totalScore);
        
        let interpretation = '';
        let colorClass = 'bg-success';
        if (totalScore >= 12) { interpretation = '營養狀況正常'; colorClass = 'bg-success'; } 
        else if (totalScore >= 8) { interpretation = '有營養不良風險'; colorClass = 'bg-warning'; } 
        else { interpretation = '營養不良'; colorClass = 'bg-danger'; }
        
        $('#mnaInterpretation').text(interpretation);
        $('#mna').find('.total-score-box').removeClass('bg-success bg-warning bg-danger').addClass(colorClass);
    }
    
    // M. Fugl-Meyer Assessment (FMA) function
    function updateFmaScore() {
        let totalScore = 0;
        $('#fmaForm input:checked').each(function() { totalScore += parseInt($(this).val()); });
        $('#fmaTotalScore').text(totalScore);
        
        let colorClass = (totalScore >= 50) ? 'bg-success' : (totalScore >= 34) ? 'bg-warning' : 'bg-danger';
        $('#fmaInterpretation').text('分數：' + totalScore);
        $('#fma').find('.total-score-box').removeClass('bg-info bg-success bg-warning bg-danger').addClass(colorClass);
    }
    
    // N. Galveston Orientation and Amnesia Test (GOAT) function
    function updateGoatScore() {
        // GOAT Score = 100 - (Total Deductions)
        const orientationDeduction = parseInt($('#goat-orientation').val()) || 0;
        const amnesiaDeduction = parseInt($('#goat-amnesia').val()) || 0;
        const totalDeduction = orientationDeduction + amnesiaDeduction;
        const totalScore = 100 - totalDeduction;
        $('#goatTotalScore').text(totalScore);
        
        let interpretation;
        let colorClass;
        if (totalScore >= 75) { interpretation = '定向力恢復'; colorClass = 'bg-success'; } 
        else if (totalScore >= 66) { interpretation = '輕微認知障礙'; colorClass = 'bg-warning'; } 
        else { interpretation = '中/重度認知障礙'; colorClass = 'bg-danger'; }
        
        $('#goatInterpretation').text(interpretation);
        $('#goat').find('.total-score-box').removeClass('bg-info bg-success bg-warning bg-danger').addClass(colorClass);
    }
    
    // O. Tab Toggler Functionality (控制量表顯示/隱藏)
    $('.tab-toggler').on('change', function() {
        const targetId = $(this).data('target');
        const isChecked = $(this).is(':checked');
        const targetNav = $(`[data-tab-id="${targetId}"]`);
        
        if (isChecked) {
            targetNav.show();
        } else {
            targetNav.hide();
            // 如果隱藏的是當前 active 的 tab，則切換到 'info' tab
            if (targetNav.find('.nav-link').hasClass('active')) {
                $('#info-tab').tab('show');
            }
        }
    });

    // === 事件綁定 ===
    $('#barthelForm input').on('change', updateBarthelScore);
    $('#iadlForm input').on('change', updateIadlScore);
    $('#mrs-score').on('change', updateMrsScore); // 使用 change 事件確保選單變動即時更新
    $('#gdsForm select').on('change', updateGdsScore);
    $('#spmsqForm select').on('change', updateSpmsqScore);
    $('#camForm select').on('change', updateCamScore);
    $('#mnaForm select').on('change', updateMnaScore);
    $('#fmaForm input').on('change', updateFmaScore);
    
    // Berg 變動觸發
    $('#bergForm .berg-item .score-select-group button').on('click', function() {
        const group = $(this).closest('.berg-item');
        const score = parseInt($(this).data('score'));
        
        // 更新 data-value
        group.data('value', score);
        
        // 更新按鈕視覺
        group.find('button').removeClass('active btn-info').addClass('btn-outline-info');
        $(this).removeClass('btn-outline-info').addClass('active btn-info');
        
        updateBergScore();
    });

    // CFS/NRS/Gait/6MWT/GOAT 變動觸發
    $('#cfs-score').on('input', updateCfsScore);
    $('#nrs-score-input').on('input', updateNrsScore);
    $('#gaitTime').on('input', updateGaitSpeed);
    $('#sixMinsDistance').on('input', updateSixMinsPerformance);
    $('#goat-orientation').on('input', updateGoatScore);
    $('#goat-amnesia').on('input', updateGoatScore);

    // 初始載入時計算年齡
    $('#patientDOB').on('change', getPatientInfo);
    
    // 確保 Berg 項目預設為 4 分 (最高分)
    $('#bergForm .berg-item').each(function() {
        const score = parseInt($(this).data('value')) || 4; // 從 HTML 的 data-value 讀取，預設為 4
        $(this).data('value', score);
        $(this).find(`button[data-score="${score}"]`).removeClass('btn-outline-info').addClass('active btn-info');
        // 確保其他按鈕是 outline
        $(this).find('button').not(`[data-score="${score}"]`).removeClass('active btn-info').addClass('btn-outline-info');
    });

    // 初始執行所有計分函數與資訊抓取
    updateBarthelScore();
    updateIadlScore();
    updateBergScore(); // 執行完整的 56 分計算
    updateMrsScore();
    updateCfsScore();
    updateNrsScore();
    updateGaitSpeed();
    updateSixMinsPerformance();
    updateGdsScore();
    updateSpmsqScore();
    updateCamScore();
    updateMnaScore();
    updateFmaScore();
    updateGoatScore();
    getPatientInfo();

    // 確保部分元素有預設選取值 (重新觸發)
    $('#mrs-score').val(0).trigger('change'); 
    $('#cfs-score').val(1).trigger('input'); 
    $('#nrs-score-input').val(0).trigger('input'); 
    $('#gdsForm select').each(function() { $(this).val($(this).find('option:first').val()).trigger('change'); });
    $('#spmsqForm select').each(function() { $(this).val($(this).find('option:first').val()).trigger('change'); });
    $('#mnaForm select').each(function() { $(this).val($(this).find('option:first').val()).trigger('change'); });
    $('#camForm select').each(function() { $(this).val($(this).find('option:first').val()).trigger('change'); });
});
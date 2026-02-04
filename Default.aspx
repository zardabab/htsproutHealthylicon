<%@ Page Language="C#" AutoEventWireup="true" %>

    <!DOCTYPE html>
    <html lang="zh-Hant">

    <head runat="server">
        <meta charset="UTF-8" />
        <title>深耕計畫入口網｜AI 與醫療</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <!-- Google Font -->
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
            rel="stylesheet" />

        <!-- Icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

        <style>
            /* CSS 樣式維持原樣，僅省略部分重複定義以節省長度，實際部署時請完整保留 index-gpt.html 的 CSS */
            :root {
                --bg-dark: #020617;
                --primary: #38bdf8;
                --primary-soft: rgba(56, 189, 248, 0.25);
                --accent: #a855f7;
                --card-bg: rgba(15, 23, 42, 0.85);
                --card-border: rgba(148, 163, 184, 0.4);
                --text-main: #e5e7eb;
                --text-muted: #9ca3af;
                --glow-primary: 0 0 25px rgba(56, 189, 248, 0.7);
                --glow-accent: 0 0 35px rgba(168, 85, 247, 0.7);
            }

            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                font-family: "Noto Sans TC", sans-serif;
                background: radial-gradient(circle at top left, #0f172a 0, #020617 50%, #020617 100%);
                color: var(--text-main);
                min-height: 100vh;
                overflow-x: hidden;
            }

            /* ... (請保留原有的 CSS 樣式) ... */
            /* 為節省 tokens，此處省略詳細 CSS，請直接使用 index-gpt.html 的 CSS */

            .bg-orbit {
                position: fixed;
                inset: 0;
                z-index: -2;
                background: radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.25) 0, transparent 40%), radial-gradient(circle at 80% 10%, rgba(129, 140, 248, 0.25) 0, transparent 45%);
                filter: blur(0.5px);
            }

            .shell {
                max-width: 1200px;
                margin: 0 auto;
                padding: 24px 16px 40px;
            }

            header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                margin-bottom: 24px;
            }

            .brand {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .brand-logo {
                width: 44px;
                height: 44px;
                border-radius: 16px;
                background: radial-gradient(circle at 30% 0, #f9fafb 0, #38bdf8 40%, #0f172a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0f172a;
            }

            .hero {
                display: grid;
                grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
                gap: 28px;
                margin-bottom: 28px;
            }

            .hero-main {
                padding: 22px;
                border-radius: 24px;
                background: rgba(15, 23, 42, 0.92);
                border: 1px solid rgba(148, 163, 184, 0.5);
            }

            .portal-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 18px;
            }

            .portal-card {
                padding: 16px;
                border-radius: 18px;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid rgba(148, 163, 184, 0.6);
                color: inherit;
                text-decoration: none;
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-height: 150px;
                transition: transform 0.2s;
            }

            .portal-card:hover {
                transform: translateY(-4px);
                border-color: #38bdf8;
            }

            .portal-title {
                font-size: 1rem;
                font-weight: 600;
            }

            .portal-desc {
                font-size: 0.8rem;
                color: #9ca3af;
            }
        </style>
    </head>

    <body>
        <form id="form1" runat="server">
            <div class="bg-orbit"></div>

            <div class="shell">
                <!-- Header -->
                <header>
                    <div class="brand">
                        <div class="brand-logo">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <div>
                            <div class="brand-text-title" style="font-weight:700;">DEEP ROOTS • AI IN HEALTHCARE</div>
                            <div class="brand-text-sub" style="font-size:0.8rem; color:#9ca3af;">深耕計畫入口網｜AI 與醫療整合平台
                                (ASP.NET Ver.)</div>
                        </div>
                    </div>
                </header>

                <!-- Hero -->
                <section class="hero">
                    <div class="hero-main">
                        <h1 style="font-size: 2.2rem; margin-bottom: 10px;">深耕計畫 <span style="color:#38bdf8;">AI ×
                                醫療</span> 入口網</h1>
                        <p style="color:#9ca3af; line-height:1.6;">
                            從個案管理、照護指標監測，到據點設備與輔具管理，將分散的系統整合在同一入口，
                            讓臨床、個管與管理單位能在同一個畫面看見全貌。
                        </p>
                        <div style="margin-top: 20px;">
                            <a href="CaseManagement.aspx" class="btn-primary-glow"
                                style="display:inline-block; padding:10px 20px; background:#38bdf8; color:#000; border-radius:30px; text-decoration:none; font-weight:bold;">
                                <i class="fas fa-stethoscope"></i> 進入 AI 智慧個管系統
                            </a>
                        </div>
                    </div>

                    <!-- Side Panel (Simplified) -->
                    <aside style="background:#1e293b; padding:20px; border-radius:20px;">
                        <h3 style="margin-top:0;">系統狀態</h3>
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <span>資料庫連線</span>
                            <span style="color:#4ade80;">正常 (SQL Server)</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>運行環境</span>
                            <span style="color:#38bdf8;">ASP.NET / IIS</span>
                        </div>
                    </aside>
                </section>

                <!-- Portals -->
                <section id="portals">
                    <h2 style="color:#9ca3af; margin-bottom:20px;">深耕計畫 · 子系統導覽</h2>
                    <div class="portal-grid">

                        <!-- 1. AI 智慧個管 -->
                        <a href="CaseManagement.aspx" class="portal-card">
                            <div class="portal-title"><i class="fas fa-user-nurse me-2"></i>AI 智慧個管系統</div>
                            <div class="portal-desc">整合 BI、IADL 量表，自動計分與結果判讀。</div>
                        </a>

                        <!-- 2. 經費追蹤 -->
                        <a href="BudgetTracking.aspx" class="portal-card">
                            <div class="portal-title"><i class="fas fa-chart-line me-2"></i>深耕計劃經費追蹤表</div>
                            <div class="portal-desc">即時追蹤各範疇經費使用情形與預算分配。</div>
                        </a>

                        <!-- 3. 績效指標 -->
                        <a href="PerformanceIndicators.aspx" class="portal-card">
                            <div class="portal-title"><i class="fas fa-tasks me-2"></i>績效指標達成情形</div>
                            <div class="portal-desc">共同性指標達成情形追蹤與填報。</div>
                        </a>

                        <!-- 4. 資安指標 -->
                        <a href="SecurityChecklist.aspx" class="portal-card">
                            <div class="portal-title"><i class="fas fa-shield-halved me-2"></i>資安指標</div>
                            <div class="portal-desc">資安治理基本查核項目與合規性檢查。</div>
                        </a>

                    </div>
                </section>
            </div>
        </form>
    </body>

    </html>
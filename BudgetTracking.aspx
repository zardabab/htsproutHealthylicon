<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BudgetTracking.aspx.cs" Inherits="BudgetTracking" %>

    <!DOCTYPE html>
    <html lang="zh-Hant">

    <head runat="server">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>深耕計劃經費追蹤表 (ASP.NET)</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

        <style>
            body {
                font-family: 'Microsoft JhengHei', 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px 0;
            }

            .main-container {
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                margin: 0 auto;
                max-width: 1400px;
                padding: 20px;
            }

            .header-section {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px;
                margin-bottom: 20px;
            }

            .table-container {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 30px;
                overflow-x: auto;
            }

            .budget-table {
                width: 100%;
                font-size: 0.9rem;
            }

            .budget-table th {
                background: #e9ecef;
                text-align: center;
                border: 2px solid #dee2e6;
                padding: 8px;
                vertical-align: middle;
            }

            .budget-table td {
                border: 1px solid #dee2e6;
                padding: 4px;
                text-align: right;
                vertical-align: middle;
            }

            .cell-input {
                width: 100%;
                border: 1px solid transparent;
                background: transparent;
                text-align: right;
                padding: 4px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
            }

            .cell-input:focus {
                background: white;
                border: 2px solid #007bff;
                outline: none;
            }

            .cell-input:hover {
                background: #fff3cd;
            }

            .category-header {
                background: #6c757d;
                color: white;
                text-align: center;
                font-weight: bold;
            }

            .subcategory-header {
                background: #adb5bd;
                font-weight: bold;
                text-align: center;
            }

            .total-row {
                background: #fff3cd;
                font-weight: bold;
            }

            /* 隱藏 ASP.NET ViewState 造成的多餘空間 */
            input[type="hidden"] {
                display: none;
            }
        </style>
    </head>

    <body>
        <form id="form1" runat="server">
            <div class="container-fluid">
                <!-- 返回按鈕 -->
                <button type="button" class="btn btn-primary" onclick="window.location.href='index-gpt.html'"
                    style="position:fixed; top:20px; right:20px; z-index:1000;">
                    <i class="fas fa-arrow-left me-1"></i>返回首頁
                </button>

                <!-- 保存按鈕 (固定右下角) -->
                <asp:LinkButton ID="btnSave" runat="server" CssClass="btn btn-success btn-lg" OnClick="btnSave_Click"
                    Style="position:fixed; bottom:20px; right:20px; z-index:1000; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <i class="fas fa-save me-2"></i>保存所有變更
                </asp:LinkButton>

                <div class="main-container">
                    <div class="header-section">
                        <h1><i class="fas fa-chart-line me-3"></i>深耕計劃經費追蹤表 (ASP.NET)</h1>
                        <p class="mb-0 fs-5">資料直接連結 SQL Server</p>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        說明：請直接點擊數字進行修改，完成後點擊右下角「保存所有變更」按鈕將資料寫入資料庫。
                    </div>

                    <div class="table-container">
                        <h4 class="mb-3"><i class="fas fa-file-invoice-dollar me-2"></i>申請數 - 第一階段</h4>
                        <table class="table budget-table table-bordered">
                            <thead>
                                <tr>
                                    <th rowspan="2">範疇</th>
                                    <th colspan="2">範疇一</th>
                                    <th colspan="2">範疇二</th>
                                    <th colspan="2">範疇三</th>
                                    <th colspan="2">範疇四</th>
                                </tr>
                                <tr>
                                    <th>補助款</th>
                                    <th>配合款</th>
                                    <th>補助款</th>
                                    <th>配合款</th>
                                    <th>補助款</th>
                                    <th>配合款</th>
                                    <th>補助款</th>
                                    <th>配合款</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 人事費 -->
                                <tr>
                                    <td class="subcategory-header">人事費</td>

                                    <!-- 範疇一 -->
                                    <td>
                                        <asp:TextBox ID="txt_S1_Sub_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S1_Mat_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <!-- 範疇二 -->
                                    <td>
                                        <asp:TextBox ID="txt_S2_Sub_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S2_Mat_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <!-- 範疇三 -->
                                    <td>
                                        <asp:TextBox ID="txt_S3_Sub_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S3_Mat_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <!-- 範疇四 -->
                                    <td>
                                        <asp:TextBox ID="txt_S4_Sub_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S4_Mat_Personnel" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                </tr>

                                <!-- 業務費 -->
                                <tr>
                                    <td class="subcategory-header">業務費</td>

                                    <td>
                                        <asp:TextBox ID="txt_S1_Sub_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S1_Mat_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <td>
                                        <asp:TextBox ID="txt_S2_Sub_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S2_Mat_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <td>
                                        <asp:TextBox ID="txt_S3_Sub_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S3_Mat_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <td>
                                        <asp:TextBox ID="txt_S4_Sub_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S4_Mat_Affairs" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                </tr>

                                <!-- 資本門 -->
                                <tr>
                                    <td class="subcategory-header">資本門</td>

                                    <td>
                                        <asp:TextBox ID="txt_S1_Sub_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S1_Mat_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <td>
                                        <asp:TextBox ID="txt_S2_Sub_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S2_Mat_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <td>
                                        <asp:TextBox ID="txt_S3_Sub_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S3_Mat_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>

                                    <td>
                                        <asp:TextBox ID="txt_S4_Sub_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="txt_S4_Mat_Capital" runat="server" CssClass="cell-input">
                                        </asp:TextBox>
                                    </td>
                                </tr>

                                <!-- 總計列 (範例：僅顯示文字，實際可由後端計算後填入 Label) -->
                                <tr class="total-row">
                                    <td>小計</td>
                                    <td colspan="8" class="text-center text-muted">包含於後端計算邏輯中 (依需求實作)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </form>
    </body>

    </html>
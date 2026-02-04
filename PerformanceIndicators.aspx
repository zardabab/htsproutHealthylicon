<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PerformanceIndicators.aspx.cs" Inherits="PerformanceIndicators"
    %>

    <!DOCTYPE html>
    <html lang="zh-Hant">

    <head runat="server">
        <meta charset="UTF-8">
        <title>績效指標達成情形 (ASP.NET)</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
        <style>
            /* 保留原版 CSS 風格 */
            body {
                font-family: 'Segoe UI', sans-serif;
                background-color: #f4f6f9;
            }

            .header {
                background: linear-gradient(135deg, #0078d4 0%, #00a8e8 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
            }

            .section-title {
                background-color: #e3f2fd;
                color: #005a9e;
                padding: 12px 15px;
                margin: 25px 0 15px 0;
                border-left: 4px solid #0078d4;
                font-weight: bold;
            }

            .table-responsive {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .category-row {
                background-color: #e8f4f8;
                font-weight: bold;
                color: #005a9e;
            }

            input[type="text"],
            textarea {
                width: 100%;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 3px;
            }

            input[type="text"]:focus,
            textarea:focus {
                border-color: #0078d4;
                outline: none;
            }
        </style>
    </head>

    <body>
        <form id="form1" runat="server">
            <div class="container-fluid p-4">
                <div style="margin-bottom: 15px;">
                    <a href="Default.aspx" class="btn btn-outline-primary"><i
                            class="fas fa-arrow-left me-2"></i>返回首頁</a>
                </div>

                <div class="header">
                    <h1><i class="fas fa-chart-line me-2"></i>績效指標達成情形</h1>
                    <p>共同性指標達成情形追蹤</p>
                </div>

                <!-- 操作按鈕 -->
                <div class="mb-3 d-flex gap-2">
                    <asp:LinkButton ID="btnSave" runat="server" CssClass="btn btn-success" OnClick="btnSave_Click">
                        <i class="fas fa-save me-2"></i>保存編輯
                    </asp:LinkButton>
                </div>

                <!-- 範疇一 -->
                <div class="section-title">一、優化醫療工作條件</div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th style="width:15%">績效指標</th>
                                <th style="width:15%">衡量定義</th>
                                <th style="width:15%">比較基準</th>
                                <th style="width:15%">預定達成值</th>
                                <th style="width:15%">實際達成值</th>
                                <th style="width:25%">說明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- 範例：重複 3 列供填寫，實務上可用 Repeater 控制項動態產生 -->
                            <% for(int i=1; i<=3; i++) { %>
                                <tr>
                                    <td>
                                        <asp:TextBox ID="t_Cat1_Name_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat1_Def_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat1_Base_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat1_Target_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat1_Achieved_<%=i%>" runat="server"
                                            CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat1_Note_<%=i%>" runat="server" CssClass="form-control"
                                            TextMode="MultiLine" Rows="1" />
                                    </td>
                                </tr>
                                <% } %>
                        </tbody>
                    </table>
                </div>

                <!-- 範疇二 -->
                <div class="section-title">二、規劃多元人才培訓</div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <!-- 表頭省略，同上 -->
                        <tbody>
                            <% for(int i=1; i<=3; i++) { %>
                                <tr>
                                    <td>
                                        <asp:TextBox ID="t_Cat2_Name_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat2_Def_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat2_Base_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat2_Target_<%=i%>" runat="server" CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat2_Achieved_<%=i%>" runat="server"
                                            CssClass="form-control" />
                                    </td>
                                    <td>
                                        <asp:TextBox ID="t_Cat2_Note_<%=i%>" runat="server" CssClass="form-control"
                                            TextMode="MultiLine" Rows="1" />
                                    </td>
                                </tr>
                                <% } %>
                        </tbody>
                    </table>
                </div>

                <!-- 為了展示簡潔，僅列出前兩個範疇，其他範疇可依此類推 -->

                <div class="alert alert-warning mt-3">
                    <i class="fas fa-info-circle me-2"></i>
                    注意：範疇三、四的結構與上述相同，請在程式碼中擴充即可。
                </div>
            </div>
        </form>
    </body>

    </html>
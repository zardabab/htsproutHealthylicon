<%@ Page Language="C#" AutoEventWireup="true" CodeFile="CaseManagement.aspx.cs" Inherits="CaseManagement" %>

    <!DOCTYPE html>
    <html lang="zh-Hant">

    <head runat="server">
        <meta charset="UTF-8">
        <title>AI 個案管理系統 (ASP.NET)</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    </head>

    <body style="background: #f5f7fa;">
        <form id="form1" runat="server">
            <asp:ScriptManager runat="server" />

            <div class="container-fluid mt-4 px-4">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4 p-4 rounded-3 text-white"
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <div>
                        <h1 class="m-0"><i class="fas fa-heartbeat me-2"></i>AI 個案管理系統</h1>
                    </div>
                    <div>
                        <!-- 觸發 Modal 的按鈕 -->
                        <button type="button" class="btn btn-success btn-lg" data-bs-toggle="modal"
                            data-bs-target="#addCaseModal">
                            <i class="fas fa-plus me-2"></i>新增個案
                        </button>
                        <a href="Default.aspx" class="btn btn-light btn-lg"><i class="fas fa-home me-2"></i>回首頁</a>
                    </div>
                </div>

                <!-- GridView -->
                <div class="card shadow border-0 rounded-4">
                    <div class="card-body p-4">
                        <asp:UpdatePanel ID="upList" runat="server">
                            <ContentTemplate>
                                <asp:GridView ID="gvCases" runat="server" AutoGenerateColumns="False"
                                    CssClass="table table-hover align-middle" GridLines="None"
                                    OnRowCommand="gvCases_RowCommand">
                                    <Columns>
                                        <asp:BoundField DataField="CaseID" HeaderText="個案編號"
                                            HeaderStyle-CssClass="fw-bold" />
                                        <asp:BoundField DataField="Name" HeaderText="姓名" />
                                        <asp:BoundField DataField="CaseType" HeaderText="類型" />
                                        <asp:BoundField DataField="Condition" HeaderText="狀況" />
                                        <asp:BoundField DataField="AdmissionDate" HeaderText="入住時間"
                                            DataFormatString="{0:yyyy-MM-dd}" />

                                        <asp:TemplateField HeaderText="評估進度">
                                            <ItemTemplate>
                                                <!-- 這裡可以放根據狀態變色的 Badge 或按鈕 -->
                                                <span class="badge bg-primary">
                                                    <%# Eval("MilestoneStatus") %>
                                                </span>
                                            </ItemTemplate>
                                        </asp:TemplateField>

                                        <asp:TemplateField HeaderText="操作">
                                            <ItemTemplate>
                                                <asp:LinkButton ID="btnEdit" runat="server" CommandName="EditCase"
                                                    CommandArgument='<%# Eval("ID") %>'
                                                    CssClass="btn btn-sm btn-warning">
                                                    <i class="fas fa-edit"></i>
                                                </asp:LinkButton>
                                                <asp:LinkButton ID="btnDelete" runat="server" CommandName="DeleteCase"
                                                    CommandArgument='<%# Eval("ID") %>' CssClass="btn btn-sm btn-danger"
                                                    OnClientClick="return confirm('確定刪除?');">
                                                    <i class="fas fa-trash"></i>
                                                </asp:LinkButton>
                                            </ItemTemplate>
                                        </asp:TemplateField>
                                    </Columns>
                                    <HeaderStyle CssClass="table-light" />
                                </asp:GridView>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                    </div>
                </div>
            </div>

            <!-- Add Modal (Bootstrap) -->
            <div class="modal fade" id="addCaseModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">新增個案</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label>編號</label>
                                <asp:TextBox ID="txtNewID" runat="server" CssClass="form-control" placeholder="C001" />
                            </div>
                            <div class="mb-3">
                                <label>姓名</label>
                                <asp:TextBox ID="txtNewName" runat="server" CssClass="form-control" />
                            </div>
                            <div class="mb-3">
                                <label>類型</label>
                                <asp:DropDownList ID="ddlNewType" runat="server" CssClass="form-select">
                                    <asp:ListItem>PAC</asp:ListItem>
                                    <asp:ListItem>居家</asp:ListItem>
                                    <asp:ListItem>社區</asp:ListItem>
                                </asp:DropDownList>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <asp:Button ID="btnAdd" runat="server" Text="儲存" CssClass="btn btn-primary"
                                OnClick="btnAdd_Click" />
                        </div>
                    </div>
                </div>
            </div>

        </form>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>

    </html>
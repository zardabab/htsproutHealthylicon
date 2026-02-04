using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class BudgetTracking : System.Web.UI.Page
{
    // 連線字串 (需在 Web.config 設定 HTSproutConn)
    string connStr = ConfigurationManager.ConnectionStrings["HTSproutConn"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadData();
        }
    }

    // 載入資料
    private void LoadData()
    {
        using (SqlConnection conn = new SqlConnection(connStr))
        {
            try
            {
                conn.Open();
                string sql = "SELECT * FROM BudgetTracking";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    string category = reader["Category"].ToString();     // e.g. 範疇一
                    string subCat = reader["SubCategory"].ToString();    // e.g. 補助款/配合款
                    string item = reader["ItemName"].ToString();         // e.g. 人事費
                    decimal amount = Convert.ToDecimal(reader["RequestAmount"]);

                    // 根據資料庫內容填入對應的 TextBox
                    // 這裡需要一個對照邏輯，或簡單的 switch case
                    SetTextBoxValue(category, subCat, item, amount);
                }
            }
            catch (Exception ex)
            {
                // 錯誤處理 (例如資料表不存在)
                ClientScript.RegisterStartupScript(this.GetType(), "alert", $"alert('資料載入錯誤: {ex.Message}');", true);
            }
        }
    }

    // 將資料庫數值填入對應 ID 的 TextBox
    private void SetTextBoxValue(string cat, string sub, string item, decimal amount)
    {
        // ID 命名規則: txt_S[1-4]_[Sub]_[Item]
        // Sub: Sub (補助款), Mat (配合款)
        // Item: Personnel (人事), Affairs (業務), Capital (資本)
        
        string catCode = "";
        if (cat == "範疇一") catCode = "S1";
        else if (cat == "範疇二") catCode = "S2";
        else if (cat == "範疇三") catCode = "S3";
        else if (cat == "範疇四") catCode = "S4";

        string subCode = (sub == "補助款") ? "Sub" : "Mat";
        
        string itemCode = "";
        if (item == "人事費") itemCode = "Personnel";
        else if (item == "業務費") itemCode = "Affairs";
        else if (item == "資本門") itemCode = "Capital";

        string controlID = $"txt_{catCode}_{subCode}_{itemCode}";
        
        // 尋找控制項
        TextBox txt = this.FindControl(controlID) as TextBox;
        if (txt != null)
        {
            txt.Text = amount.ToString("N0"); // 加上千分位
        }
    }

    // 保存按鈕點擊
    protected void btnSave_Click(object sender, EventArgs e)
    {
        using (SqlConnection conn = new SqlConnection(connStr))
        {
            conn.Open();
            SqlTransaction tran = conn.BeginTransaction();
            
            try
            {
                // 遍歷所有範疇、子項目和費用項目進行更新
                string[] categories = { "範疇一", "範疇二", "範疇三", "範疇四" };
                string[] subCats = { "補助款", "配合款" };
                string[] items = { "人事費", "業務費", "資本門" };

                foreach (string cat in categories)
                {
                    foreach (string sub in subCats)
                    {
                        foreach (string item in items)
                        {
                            string val = GetTextBoxValue(cat, sub, item);
                            decimal amount = 0;
                            decimal.TryParse(val.Replace(",", ""), out amount); // 移除千分位

                            // 使用 MERGE 語法 (若存在則更新，不存在則新增)
                            string sql = @"
                                MERGE BudgetTracking AS target
                                USING (SELECT @Category AS Category, @SubCategory AS SubCategory, @ItemName AS ItemName) AS source
                                ON (target.Category = source.Category AND target.SubCategory = source.SubCategory AND target.ItemName = source.ItemName)
                                WHEN MATCHED THEN
                                    UPDATE SET RequestAmount = @Amount, UpdatedAt = GETDATE()
                                WHEN NOT MATCHED THEN
                                    INSERT (Category, SubCategory, ItemName, RequestAmount)
                                    VALUES (@Category, @SubCategory, @ItemName, @Amount);";

                            SqlCommand cmd = new SqlCommand(sql, conn, tran);
                            cmd.Parameters.AddWithValue("@Category", cat);
                            cmd.Parameters.AddWithValue("@SubCategory", sub);
                            cmd.Parameters.AddWithValue("@ItemName", item);
                            cmd.Parameters.AddWithValue("@Amount", amount);
                            
                            cmd.ExecuteNonQuery();
                        }
                    }
                }

                tran.Commit();
                ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('✅ 保存成功！所有變更已寫入資料庫。');", true);
            }
            catch (Exception ex)
            {
                tran.Rollback();
                ClientScript.RegisterStartupScript(this.GetType(), "alert", $"alert('❌ 保存失敗: {ex.Message}');", true);
            }
        }
        
        // 重新載入以確保顯示正確
        LoadData();
    }

    private string GetTextBoxValue(string cat, string sub, string item)
    {
        string catCode = "";
        if (cat == "範疇一") catCode = "S1";
        else if (cat == "範疇二") catCode = "S2";
        else if (cat == "範疇三") catCode = "S3";
        else if (cat == "範疇四") catCode = "S4";

        string subCode = (sub == "補助款") ? "Sub" : "Mat";

        string itemCode = "";
        if (item == "人事費") itemCode = "Personnel";
        else if (item == "業務費") itemCode = "Affairs";
        else if (item == "資本門") itemCode = "Capital";

        string controlID = $"txt_{catCode}_{subCode}_{itemCode}";

        TextBox txt = this.FindControl(controlID) as TextBox;
        return (txt != null) ? txt.Text : "0";
    }
}

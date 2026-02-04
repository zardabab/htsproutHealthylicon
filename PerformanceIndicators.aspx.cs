using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class PerformanceIndicators : System.Web.UI.Page
{
    string connStr = ConfigurationManager.ConnectionStrings["HTSproutConn"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            LoadData();
        }
    }

    private void LoadData()
    {
        using (SqlConnection conn = new SqlConnection(connStr))
        {
            conn.Open();
            // 讀取資料並填入對應的 TextBox
            // 假設資料表儲存了每個 TextBox 的 ID 對應的值，或者是根據 RowIndex 順序取出
            // 這裡示範簡單邏輯: 讀取所有資料，依據 Category 和 順序填入
            
            string sql = "SELECT * FROM PerformanceIndicators ORDER BY ID";
            SqlCommand cmd = new SqlCommand(sql, conn);
            SqlDataReader reader = cmd.ExecuteReader();

            int cat1Idx = 1;
            int cat2Idx = 1;

            while (reader.Read())
            {
                string cat = reader["Category"].ToString();
                int idx = 0;
                
                if (cat == "Cat1") idx = cat1Idx++;
                else if (cat == "Cat2") idx = cat2Idx++;
                
                if (idx > 3) continue; // 超過預設行數忽略

                SetText($"t_{cat}_Name_{idx}", reader["IndicatorName"].ToString());
                SetText($"t_{cat}_Def_{idx}", reader["Definition"].ToString());
                SetText($"t_{cat}_Base_{idx}", reader["BaselineValue"].ToString());
                SetText($"t_{cat}_Target_{idx}", reader["TargetValue"].ToString());
                SetText($"t_{cat}_Achieved_{idx}", reader["AchievedValue"].ToString());
                SetText($"t_{cat}_Note_{idx}", reader["Note"].ToString());
            }
        }
    }

    private void SetText(string id, string text)
    {
        TextBox txt = FindControlRecursive(this, id) as TextBox;
        if (txt != null) txt.Text = text;
    }

    private Control FindControlRecursive(Control root, string id)
    {
        if (root.ID == id) return root;
        foreach (Control c in root.Controls)
        {
            Control t = FindControlRecursive(c, id);
            if (t != null) return t;
        }
        return null;
    }

    protected void btnSave_Click(object sender, EventArgs e)
    {
         using (SqlConnection conn = new SqlConnection(connStr))
        {
            conn.Open();
            // 先清除舊資料 (或使用 MERGE 更新)
            // 簡單起見：刪除該範疇舊資料，重新插入
            new SqlCommand("DELETE FROM PerformanceIndicators", conn).ExecuteNonQuery();

            SaveCategory(conn, "Cat1", "優化醫療工作條件", 3);
            SaveCategory(conn, "Cat2", "規劃多元人才培訓", 3);
            
            ClientScript.RegisterStartupScript(this.GetType(), "alert", "alert('保存成功');", true);
        }
    }

    private void SaveCategory(SqlConnection conn, string catCode, string catName, int count)
    {
        for (int i = 1; i <= count; i++)
        {
            string name = GetText($"t_{catCode}_Name_{i}");
            if (string.IsNullOrWhiteSpace(name)) continue; // 空行不存

            string sql = @"INSERT INTO PerformanceIndicators 
                           (Category, IndicatorName, Definition, BaselineValue, TargetValue, AchievedValue, Note)
                           VALUES (@Cat, @Name, @Def, @Base, @Target, @Achieved, @Note)";
            
            SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Cat", catCode);
            cmd.Parameters.AddWithValue("@Name", name);
            cmd.Parameters.AddWithValue("@Def", GetText($"t_{catCode}_Def_{i}"));
            cmd.Parameters.AddWithValue("@Base", GetText($"t_{catCode}_Base_{i}"));
            cmd.Parameters.AddWithValue("@Target", GetText($"t_{catCode}_Target_{i}"));
            cmd.Parameters.AddWithValue("@Achieved", GetText($"t_{catCode}_Achieved_{i}"));
            cmd.Parameters.AddWithValue("@Note", GetText($"t_{catCode}_Note_{i}"));
            
            cmd.ExecuteNonQuery();
        }
    }

    private string GetText(string id)
    {
        TextBox txt = FindControlRecursive(this, id) as TextBox;
        return txt != null ? txt.Text : "";
    }
}

using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class CaseManagement : System.Web.UI.Page
{
    string connStr = ConfigurationManager.ConnectionStrings["HTSproutConn"].ConnectionString;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            BindGrid();
        }
    }

    private void BindGrid()
    {
        using (SqlConnection conn = new SqlConnection(connStr))
        {
            conn.Open();
            string sql = "SELECT * FROM CaseManagement ORDER BY CreatedAt DESC";
            SqlDataAdapter da = new SqlDataAdapter(sql, conn);
            DataTable dt = new DataTable();
            da.Fill(dt);
            
            gvCases.DataSource = dt;
            gvCases.DataBind();
        }
    }

    protected void btnAdd_Click(object sender, EventArgs e)
    {
        using (SqlConnection conn = new SqlConnection(connStr))
        {
            conn.Open();
            string sql = "INSERT INTO CaseManagement (CaseID, Name, CaseType, CreatedAt) VALUES (@ID, @Name, @Type, GETDATE())";
            SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@ID", txtNewID.Text);
            cmd.Parameters.AddWithValue("@Name", txtNewName.Text);
            cmd.Parameters.AddWithValue("@Type", ddlNewType.SelectedValue);
            
            cmd.ExecuteNonQuery();
        }
        
        // Refresh Grid
        BindGrid();
        
        // Close Modal via JS (simplified)
        ClientScript.RegisterStartupScript(this.GetType(), "closeModal", 
            "var myModal = bootstrap.Modal.getInstance(document.getElementById('addCaseModal')); myModal.hide();", true);
    }

    protected void gvCases_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName == "DeleteCase")
        {
            int id = Convert.ToInt32(e.CommandArgument);
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                string sql = "DELETE FROM CaseManagement WHERE ID = @ID";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@ID", id);
                cmd.ExecuteNonQuery();
            }
            BindGrid();
        }
        else if (e.CommandName == "EditCase")
        {
            // Redirect to Detail Page (Not implemented in this batch)
            // Response.Redirect("CaseDetail.aspx?ID=" + e.CommandArgument);
        }
    }
}

namespace task_management_server.Data
{
    using FluentMigrator;

    [Migration(2025071401)] // use a unique timestamp or incrementing number
    public class AddTaskItemsTable : Migration
    {
        public override void Up()
        {
            if (!Schema.Table("Tasks").Exists())
            {
                Create.Table("Tasks")
                    .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                    .WithColumn("Title").AsString(255).NotNullable()
                    .WithColumn("Description").AsString(int.MaxValue).Nullable()
                    .WithColumn("Status").AsInt32().NotNullable()
                    .WithColumn("DueDate").AsDateTime().NotNullable()
                    .WithColumn("CreatedDate").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime)
                    .WithColumn("UpdatedAt").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime);
            }
        }

        public override void Down()
        {
            Delete.Table("TaskItems");
        }
    }

}

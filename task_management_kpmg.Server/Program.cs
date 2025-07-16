using DotNetEnv;
using FluentMigrator.Runner;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using task_management_kpmg.Server.Data;
using task_management_server.Data;
using Dapper;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

Env.Load();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
});

builder.Services
    .AddFluentMigratorCore()
    .ConfigureRunner(rb => rb
        .AddSqlServer()
        .WithGlobalConnectionString(Environment.GetEnvironmentVariable("DB_CONNECTION")
                           ?? builder.Configuration.GetConnectionString("DefaultConnection"))
        .ScanIn(typeof(AddTaskItemsTable).Assembly).For.Migrations())
    .AddLogging(lb => lb.AddFluentMigratorConsole());

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();
    try
    {
        runner.MigrateUp();

        // === Seed data starts here ===
        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION")
                               ?? config.GetConnectionString("DefaultConnection");

        using var connection = new SqlConnection(connectionString);
        connection.Open();

        var count = connection.ExecuteScalar<int>("SELECT COUNT(1) FROM Tasks");

        if (count == 0)
        {
            var sql = @"
                INSERT INTO Tasks (Title, Description, AssignedTo, Status, DueDate, CreatedDate, UpdatedAt, Priority)
                VALUES (@Title, @Description, @AssignedTo, @Status, @DueDate, GETUTCDATE(), GETUTCDATE(), @Priority)";

            var tasks = new[]
            {
                new {
                    Title = "Seed Task 1",
                    Description = "This is a seeded task inserted by Dapper.",
                    AssignedTo = "Priya Patel",
                    Status = 0, 
                    DueDate = DateTime.UtcNow.AddDays(7),
                    Priority = 0 
                },
                new {
                    Title = "Seed Task 2",
                    Description = "Another seeded task with high priority.",
                    AssignedTo = "Priya Patel",
                    Status = 1, 
                    DueDate = DateTime.UtcNow.AddDays(3),
                    Priority = 2 
                },
                new {
                    Title = "Optimize SQL Queries",
                    Description = "Review and optimize all SQL queries used in reporting module to improve performance by at least 30%. Focus on indexing and query refactoring.",
                    AssignedTo = "Priya Patel",
                    Status = 0, 
                    DueDate = DateTime.UtcNow.AddDays(10),
                    Priority = 0 
                }
            };

            foreach (var task in tasks)
            {
                connection.Execute(sql, task);
            }
        }
        // === Seed data ends here ===
    }
    catch (Exception ex)
    {
        // Error
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Migration failed");

    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.UseHttpsRedirection();

app.Run();


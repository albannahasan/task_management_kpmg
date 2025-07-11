using Dapper;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using task_management_kpmg.Server.Data;
using task_management_kpmg.Server.Models;

namespace task_management_kpmg.Server.Controllers
{



    [Microsoft.AspNetCore.Mvc.Route("api/tasks")]
    [ApiController]


    public class TaskController : ControllerBase
    {
        private readonly IDbConnection _db;
        private readonly string _connectionString;
        public TaskController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        // List all tasks
        [HttpGet]

        public async Task<IActionResult> GetAll()
        {
            using var connection = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Tasks";
            var tasks = await connection.QueryAsync<TaskItem>(sql);

            return Ok(tasks);
        }


        // Get Task by ID
        [HttpGet("{id}")]
        public IActionResult GetTaskById(int id)
        {
            using var connection = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Tasks WHERE Id = @Id";

            var tasks = connection.QueryFirstOrDefault<TaskItem>(sql, new { Id = id });
            if (tasks == null)
            {
                return NotFound();
            }
            return Ok(tasks);
        }


        //Create a new task
        [HttpPost]

        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            using var connection = new SqlConnection(_connectionString);

            var sql = @"
    INSERT INTO Tasks (Title, Description, Status, DueDate)
    OUTPUT INSERTED.Id
    VALUES (@Title, @Description, @Status, @DueDate)";

            var newId = await connection.ExecuteScalarAsync<int>(sql, task);
            task.Id = newId;
            return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
        }

        public async Task<IActionResult> DeleteTask(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "DELETE FROM Tasks WHERE Id = @Id";

            var affectedRows = await connection.ExecuteAsync(sql, id);

            if (affectedRows == 0)
                return NotFound();

            return NoContent();

        }


    }
}

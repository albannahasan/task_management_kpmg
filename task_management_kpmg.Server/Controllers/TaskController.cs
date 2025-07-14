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
        private readonly string _connectionString;
        public TaskController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }


        private TaskItem GetTaskByIdInternal(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM Tasks WHERE Id = @Id";
            return connection.QueryFirstOrDefault<TaskItem>(sql, new { Id = id });
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
            var task = GetTaskByIdInternal(id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        //Update a task
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask([FromBody] TaskItem updatedTask, int id)
        {

            if (id != updatedTask.Id)
                return BadRequest("ID in URL does not match ID in body");

            var existingTask = GetTaskByIdInternal(id);

            if (existingTask == null)
                return NotFound();

            using var connection = new SqlConnection(_connectionString);

            var sql = "UPDATE Tasks SET " +
                "Title = @Title," +
                "Description = @Description," +
                "Status = @Status," +
                "DueDate = @DueDate," +
                " UpdatedAt = GETUTCDATE() " +
                "WHERE Id = @Id";


            connection.Execute(sql, new
            {
                updatedTask.Title,
                updatedTask.Description,
                updatedTask.Status,
                updatedTask.DueDate,
                Id = id
            });

            return NoContent();
        }




        //Create a new task
        [HttpPost]

        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            using var connection = new SqlConnection(_connectionString);

            var sql = @"
    INSERT INTO Tasks (Title, Description, Status, DueDate, CreatedDate, UpdatedAt)
    OUTPUT INSERTED.Id
    VALUES (@Title, @Description, @Status, @DueDate, GETUTCDATE(), GETUTCDATE())";

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

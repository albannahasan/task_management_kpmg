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

        public IActionResult GetAll()
        {
            using var connection = new SqlConnection(_connectionString);

            var sql = "SELECT * FROM Tasks";
            var tasks = connection.Query<TaskItem>(sql).ToList();

            return Ok(tasks);
        }


        // Get Task by ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
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


    }
}

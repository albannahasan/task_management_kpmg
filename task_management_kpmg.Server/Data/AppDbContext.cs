using Microsoft.EntityFrameworkCore;
using task_management_kpmg.Server.Models;

namespace task_management_kpmg.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TaskItem> Tasks { get; set; }
    }
}

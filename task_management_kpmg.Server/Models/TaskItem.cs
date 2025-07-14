using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace task_management_kpmg.Server.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }
        public string Description { get; set; }
        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public DateTime DueDate { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}

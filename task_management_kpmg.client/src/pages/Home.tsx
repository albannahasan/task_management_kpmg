import { useEffect, useState } from "react";
import TaskCard from "../Components/TaskCard";
import { useTasks } from "../hooks/useTasks";
import { useTaskFilters, type SortOption } from "../hooks/useTaskFilters";
import CreateTaskModal from "../Components/CreateTaskModal";
import ViewTaskModal from "../Components/ViewTaskModal";
import SearchIcon from "../assets/search.svg?react";
import SummaryCard from "../Components/SummaryCard";



const Home: React.FC = () => {
  // Custom Tasks hooks
  const { tasks, loading, error, addTask, deleteTask, updateTask } = useTasks();
  const {
    filters,
    filteredTasks,
    updateFilter,
    clearFilters,
    getTaskStats,
    sort,
    updateSort,
  } = useTaskFilters(tasks);
  // const [theme, setTheme] = useLocalStorage("theme", "light");

  const [displayCreateTaskModal, setDisplayCreateTaskModal] =
    useState<boolean>(false);
  const [displayViewTaskModal, setDisplayViewTaskModal] =
    useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9; //

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDisplayViewTaskModal(true);
  };

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div style={{ padding: "2rem" }}>
      <div className="title-container fade-in">
        <div className="title-container-left">
          <h1 className="title-container-left-title">Task Management</h1>
          <p>Your personal task management dashboard</p>
        </div>

        <div>
          <button onClick={() => setDisplayCreateTaskModal(true)}>
            New Task
          </button>
          {displayCreateTaskModal && (
            <CreateTaskModal
              isOpen={displayCreateTaskModal}
              onClose={() => setDisplayCreateTaskModal(false)}
              onCreate={addTask}
            />
          )}

          {displayViewTaskModal && (
            <ViewTaskModal
              taskId={selectedTaskId}
              isOpen={displayViewTaskModal}
              onClose={() => setDisplayViewTaskModal(false)}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </div>
      </div>
      <div className="task-summary-container">
        {(() => {
          const stats = getTaskStats();
          return (
            <>
              <SummaryCard
                title="Total Tasks"
                color="blue"
                value={stats.total.toString()}
              />
              <SummaryCard
                title="To Do"
                color="blue"
                value={stats.todo.toString()}
              />
              <SummaryCard
                title="In Progress"
                color="orange"
                value={stats.inProgress.toString()}
              />
              <SummaryCard
                title="Completed"
                color="green"
                value={stats.completed.toString()}
              />
            </>
          );
        })()}
      </div>
      <div className="task-filter-container fade-in">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4
            style={{
              marginBottom: "1rem",
              marginTop: "0",
              textAlign: "left",
              marginRight: "1rem",
            }}
          >
            Filters & Sort
          </h4>
          <button onClick={() => clearFilters()}>Clear Filters</button>
        </div>

        <div className="task-filter-grid">
          <div className="task-filter-container-left">
            <p className="filter-description">Search</p>

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ position: "absolute", left: "0.75rem" }}>
                <SearchIcon width={18} height={18} />
              </span>
              <input
                type="text"
                className="filter-search"
                placeholder="Search"
                style={{ paddingLeft: "2.5rem" }}
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>
          </div>
          <div className="task-filter-container-left">
            <p className="filter-description">Status</p>
            <select
              className="filter-select"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">All</option>
              <option value="toDo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="task-filter-container-left">
            <p className="filter-description">Priority</p>
            <select
              className="filter-select"
              value={filters.priority}
              onChange={(e) => updateFilter("priority", e.target.value)}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="task-filter-container-left">
            <p className="filter-description">Sort By</p>
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => updateSort(e.target.value as SortOption)}
            >
              <option value="title_asc">Title A–Z</option>
              <option value="title_desc">Title Z–A</option>
              <option value="dueDate_desc">Furthest Due Date First</option>
              <option value="dueDate_asc">Closest Due Date First</option>
              <option value="createdAt_desc">
                Created Date (Newest First)
              </option>
              <option value="createdAt_asc">Created Date (Oldest First)</option>
              <option value="updatedAt_desc">
                Last Updated (Newest First)
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="task-container">
        <div className="task-container-header">
          <div>
            <h3
              style={{
                textAlign: "left",
                marginBottom: "1rem",
                marginTop: "0",
                fontWeight: "600",
              }}
            >
              Tasks ({filteredTasks.length})
            </h3>
          </div>
          <div className="pagination-container-right">
            <p className="pagination-text">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>

        {loading ? (
          <div>Loading tasks...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="task-grid fade-in">
            {currentTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                status={task.status}
                dueDate={task.dueDate}
                priority={task.priority}
                onClick={() => handleTaskClick(task.id.toString())}
              />
            ))}
          </div>
        )}
        <div className="pagination-container">
          <div className="pagination-text"></div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useTaskFilters, type SortOption } from "../hooks/useTaskFilters";

//Components
import CreateTaskModal from "../components/CreateTaskModal";
import SummaryCard from "../components/SummaryCard";
import TaskCard from "../components/TaskCard";
import ViewTaskModal from "../components/ViewTaskModal";

//SVG Icons
import GridIcon from "../assets/grid.svg?react";
import KanbanIcon from "../assets/kanban.svg?react";
import SearchIcon from "../assets/search.svg?react";
import KanbanBoard from "../components/KanbanBoard";
import { users } from "../constant/user";
import Utils from "../utils/utils";

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
  const tasksPerPage = 9;
  const [viewType, setViewType] = useState<"grid" | "kanban">("grid");

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

        <div className="title-container-right">
          <div className="title-container-view-type">
            <button
              className="view-type-button"
              aria-label="Grid View"
              onClick={() => setViewType("grid")}
              style={
                viewType === "grid"
                  ? {
                      color: "#2563eb",
                      backgroundColor: "white",
                    }
                  : undefined
              }
            >
              <GridIcon width={20} height={20} />
            </button>
            <button
              className="view-type-button"
              aria-label="Kanban View"
              onClick={() => setViewType("kanban")}
              style={
                viewType === "kanban"
                  ? {
                      color: "#2563eb",
                      backgroundColor: "white",
                    }
                  : undefined
              }
            >
              <KanbanIcon width={20} height={20} />
            </button>
          </div>

          <button className="new-task-button" onClick={() => setDisplayCreateTaskModal(true)}>
           + New Task
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
                title="Done"
                color="green"
                value={stats.done.toString()}
              />
            </>
          );
        })()}
      </div>

      {viewType === "grid" ? (
        <div>
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
                  <option value="createdAt_asc">
                    Created Date (Oldest First)
                  </option>
                  <option value="updatedAt_desc">
                    Last Updated (Newest First)
                  </option>
                </select>
              </div>
              <div className="task-filter-container-left">
                <p className="filter-description">Assigned To</p>
                <select
                  className="filter-select"
                  value={filters.assignedTo}
                  onChange={(e) => updateFilter("assignedTo", e.target.value)}
                >
                  <option value="">All</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.name}>
                      {`${user.name} (${Utils.getUserAbbreviation(user.role)})`}
                    </option>
                  ))}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                    assignedTo={task.assignedTo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
       <KanbanBoard
        filteredTasks={filteredTasks}
        handleTaskClick={handleTaskClick}
        updateTask={updateTask}
       />
      )}
    </div>
  );
};

export default Home;

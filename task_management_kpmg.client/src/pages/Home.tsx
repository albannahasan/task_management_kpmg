import { useEffect, useState } from "react";

interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface SummaryCardProps {
    title: string;
    color: string;
    value: string;
}

const getLightColor = (color: string) => {
    const colorMap = {
        blue: "#EBF8FF",
        green: "#DCFCE7",
        red: "#FEE2E2",
        orange: "#FEF3C7",
    }

    return colorMap[color as keyof typeof colorMap] || color;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, color, value }) => {
    return (
        <div className="summary-card">
            <div className="summary-card-count">
                <h2 style={{ backgroundColor: getLightColor(color) || color , color: color}}>{value}</h2>
            </div>
            <div className="summary-card-container">
                <p className="summary-card-title">{title}</p>
                <p className="summary-card-value">{value}</p>
            </div>
        </div>
    )
}

const Home: React.FC = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>();

  useEffect(() => {
    populateWeatherData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <div className="title-container">
        <div className="title-container-left">
          <h1 className="title-container-left-title">Task Management</h1>
          <p>Your personal task management dashboard</p>
        </div>

        <div>
          <button>New Task</button>
        </div>
      </div>
      <div className="task-summary-container">
        <SummaryCard title="Total Tasks" color="blue" value="10" />
        <SummaryCard title="To Do" color="blue" value="5" />
        <SummaryCard title="In Progress" color="orange" value="5" />
        <SummaryCard title="Completed" color="green" value="5" />

      </div>
      <div className="task-filter-container">
        <div className="task-filter-container-left">Search</div>
        <div className="task-filter-container-left">Status</div>
        <div className="task-filter-container-left">Priority</div>
        <div className="task-filter-container-left">Asignee</div>
      </div>
    </div>
  );

  async function populateWeatherData() {
    const response = await fetch("weatherforecast");
    if (response.ok) {
      const data = await response.json();
      setForecasts(data);
    }
  }
};

export default Home;

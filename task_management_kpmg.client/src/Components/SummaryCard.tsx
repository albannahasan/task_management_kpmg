import Utils from "../utils/utils";

interface SummaryCardProps {
    title: string;
    color: string;
    value: string;
  }
  
const SummaryCard: React.FC<SummaryCardProps> = ({ title, color, value }) => {
    return (
      <div className="summary-card">
        <div className="summary-card-count">
          <h2
            style={{
              backgroundColor: Utils.getLightColor(color) || color,
              color: color,
            }}
          >
            {value}
          </h2>
        </div>
        <div className="summary-card-container">
          <p className="summary-card-title">{title}</p>
          <p className="summary-card-value">{value}</p>
        </div>
      </div>
    );
  };

  export default SummaryCard;
  
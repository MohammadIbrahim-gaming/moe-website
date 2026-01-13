import React from 'react';
import './Recommendations.css';

function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <div className="recommendations">
      <h3>Security Recommendations</h3>
      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`recommendation recommendation-${rec.priority}`}
          >
            <div className="recommendation-header">
              <span className="priority-icon">
                {getPriorityIcon(rec.priority)}
              </span>
              <h4>{rec.title}</h4>
              <span className="priority-badge">{rec.priority}</span>
            </div>
            <p className="recommendation-description">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;

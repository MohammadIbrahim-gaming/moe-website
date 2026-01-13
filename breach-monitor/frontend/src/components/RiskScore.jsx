import React from 'react';
import './RiskScore.css';

function RiskScore({ score }) {
  const getRiskLevel = (score) => {
    if (score === 0) return { level: 'None', color: 'success', icon: '✅' };
    if (score < 30) return { level: 'Low', color: 'low', icon: '🟢' };
    if (score < 60) return { level: 'Medium', color: 'medium', icon: '🟡' };
    if (score < 80) return { level: 'High', color: 'high', icon: '🟠' };
    return { level: 'Critical', color: 'critical', icon: '🔴' };
  };

  const risk = getRiskLevel(score);

  return (
    <div className={`risk-score risk-${risk.color}`}>
      <div className="risk-header">
        <div>
          <h3>Risk Score</h3>
          <p className="risk-level">
            <span className="risk-icon">{risk.icon}</span>
            {risk.level} Risk
          </p>
        </div>
        <div className="score-value">{score}/100</div>
      </div>
      <div className="score-bar">
        <div
          className="score-fill"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="risk-description">
        {score === 0
          ? 'Your information appears to be safe from known breaches.'
          : score < 30
          ? 'Minimal risk detected. Monitor your accounts regularly.'
          : score < 60
          ? 'Moderate risk. Consider changing passwords and enabling 2FA.'
          : score < 80
          ? 'High risk. Immediate action recommended to secure your accounts.'
          : 'Critical risk. Take immediate steps to protect your accounts and personal information.'}
      </p>
    </div>
  );
}

export default RiskScore;

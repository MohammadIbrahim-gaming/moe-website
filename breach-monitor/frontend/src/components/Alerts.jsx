import React, { useState, useEffect } from 'react';
import './Alerts.css';

function Alerts({ alerts, onUpdate }) {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filteredAlerts = unreadOnly
    ? alerts.filter(a => !a.read)
    : alerts;

  const handleMarkRead = async (alertId) => {
    try {
      await fetch(`/api/alerts/${alertId}/read`, {
        method: 'PUT',
      });
      onUpdate();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadAlerts = alerts.filter(a => !a.read);
      await Promise.all(
        unreadAlerts.map(alert => 
          fetch(`/api/alerts/${alert.id}/read`, { method: 'PUT' })
        )
      );
      onUpdate();
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  if (alerts.length === 0) {
    return (
      <div className="alerts-container">
        <div className="empty-alerts">
          <p>No alerts yet.</p>
          <p className="empty-hint">You'll receive alerts when new breaches are detected for your monitored items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>Security Alerts</h2>
        <div className="alerts-controls">
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
            />
            Show unread only
          </label>
          {unreadCount > 0 && (
            <button className="mark-all-read" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="no-alerts">No unread alerts</div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.read ? 'read' : 'unread'}`}
            >
              <div className="alert-icon">
                {alert.alert_type === 'new_breach' ? '🔴' : '⚠️'}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>{alert.message}</h4>
                  {!alert.read && (
                    <span className="unread-badge">New</span>
                  )}
                </div>
                <div className="alert-meta">
                  <span className="alert-type">{alert.type}: {alert.value}</span>
                  <span className="alert-time">
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              {!alert.read && (
                <button
                  className="mark-read-button"
                  onClick={() => handleMarkRead(alert.id)}
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;

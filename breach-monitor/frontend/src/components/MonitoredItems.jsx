import React, { useState, useEffect } from 'react';
import './MonitoredItems.css';

function MonitoredItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [breaches, setBreaches] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/monitored');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching monitored items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreaches = async (itemId) => {
    try {
      const response = await fetch(`/api/breaches/${itemId}`);
      const data = await response.json();
      setBreaches(data);
    } catch (error) {
      console.error('Error fetching breaches:', error);
    }
  };

  const handleItemClick = (item) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setBreaches([]);
    } else {
      setSelectedItem(item);
      fetchBreaches(item.id);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to remove this monitored item?')) {
      return;
    }

    try {
      await fetch(`/api/monitored/${itemId}`, {
        method: 'DELETE',
      });
      fetchItems();
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
        setBreaches([]);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const getRiskColor = (score) => {
    if (score === 0) return 'success';
    if (score < 30) return 'low';
    if (score < 60) return 'medium';
    if (score < 80) return 'high';
    return 'critical';
  };

  if (loading) {
    return <div className="loading">Loading monitored items...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No monitored items yet.</p>
        <p className="empty-hint">Check for breaches to start monitoring your data.</p>
      </div>
    );
  }

  return (
    <div className="monitored-items">
      <h2>Monitored Items</h2>
      <p className="subtitle">Items you've checked are automatically monitored for new breaches</p>

      <div className="items-list">
        {items.map((item) => (
          <div key={item.id} className="monitored-item">
            <div
              className="item-header"
              onClick={() => handleItemClick(item)}
            >
              <div className="item-info">
                <div className="item-type-badge">{item.type}</div>
                <div className="item-value">{item.value}</div>
                <div className="item-meta">
                  <span>
                    Last checked: {item.last_checked
                      ? new Date(item.last_checked).toLocaleString()
                      : 'Never'}
                  </span>
                  <span>•</span>
                  <span>{item.breach_count} breach{item.breach_count !== 1 ? 'es' : ''}</span>
                </div>
              </div>
              <div className="item-actions">
                <div className={`risk-badge risk-${getRiskColor(item.risk_score)}`}>
                  Risk: {item.risk_score}
                </div>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {selectedItem?.id === item.id && (
              <div className="item-details">
                {breaches.length > 0 ? (
                  <div className="breaches-list">
                    <h4>Breach History</h4>
                    {breaches.map((breach) => (
                      <div key={breach.id} className="breach-history-item">
                        <div className="breach-name">{breach.breach_name}</div>
                        <div className="breach-info">
                          {breach.breach_date && (
                            <span>Date: {new Date(breach.breach_date).toLocaleDateString()}</span>
                          )}
                          {breach.exposed_data && (
                            <span>Data: {breach.exposed_data}</span>
                          )}
                        </div>
                        <div className="breach-discovered">
                          Discovered: {new Date(breach.discovered_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-breaches">No breach history recorded</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonitoredItems;

import React, { useState, useEffect } from 'react';
import './App.css';
import BreachChecker from './components/BreachChecker';
import RiskScore from './components/RiskScore';
import Recommendations from './components/Recommendations';
import MonitoredItems from './components/MonitoredItems';
import PasswordAnalyzer from './components/PasswordAnalyzer';
import Alerts from './components/Alerts';

function App() {
  const [activeTab, setActiveTab] = useState('check');
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      const data = await response.json();
      setAlerts(data);
      setAlertCount(data.filter(a => !a.read).length);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🔐 Breach Monitor</h1>
          <p>Personal Data Breach & Dark-Web Exposure Monitor</p>
        </div>
        {alertCount > 0 && (
          <div className="alert-badge" onClick={() => setActiveTab('alerts')}>
            {alertCount} new alert{alertCount > 1 ? 's' : ''}
          </div>
        )}
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'check' ? 'active' : ''}
          onClick={() => setActiveTab('check')}
        >
          Check Breach
        </button>
        <button
          className={activeTab === 'monitored' ? 'active' : ''}
          onClick={() => setActiveTab('monitored')}
        >
          Monitored Items
        </button>
        <button
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Password Analyzer
        </button>
        <button
          className={activeTab === 'alerts' ? 'active' : ''}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts {alertCount > 0 && <span className="badge">{alertCount}</span>}
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'check' && <BreachChecker />}
        {activeTab === 'monitored' && <MonitoredItems />}
        {activeTab === 'password' && <PasswordAnalyzer />}
        {activeTab === 'alerts' && <Alerts alerts={alerts} onUpdate={fetchAlerts} />}
      </main>
    </div>
  );
}

export default App;

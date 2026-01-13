import React, { useState } from 'react';
import './BreachChecker.css';
import RiskScore from './RiskScore';
import Recommendations from './Recommendations';

function BreachChecker() {
  const [type, setType] = useState('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    
    if (!value.trim()) {
      setError('Please enter a value to check');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, value: value.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to check breach');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while checking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="breach-checker">
      <div className="checker-card">
        <h2>Check for Data Breaches</h2>
        <p className="subtitle">
          Enter your email, username, or phone number to see if it's been exposed in known data breaches
        </p>

        <form onSubmit={handleCheck} className="check-form">
          <div className="form-group">
            <label htmlFor="type">Check Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-select"
            >
              <option value="email">Email Address</option>
              <option value="username">Username</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="value">Value to Check</label>
            <input
              id="value"
              type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                type === 'email'
                  ? 'example@email.com'
                  : type === 'phone'
                  ? '+1234567890'
                  : 'username'
              }
              className="form-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="check-button"
            disabled={loading || !value.trim()}
          >
            {loading ? 'Checking...' : 'Check for Breaches'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className={`breach-status ${result.breached ? 'breached' : 'safe'}`}>
              {result.breached ? (
                <>
                  <span className="status-icon">🔴</span>
                  <div>
                    <h3>Breach Detected</h3>
                    <p>Your {type} was found in {result.breaches.length} data breach{result.breaches.length > 1 ? 'es' : ''}</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="status-icon">✅</span>
                  <div>
                    <h3>No Breaches Found</h3>
                    <p>Your {type} does not appear in known data breaches</p>
                  </div>
                </>
              )}
            </div>

            {result.breached && result.breaches.length > 0 && (
              <div className="breaches-list">
                <h4>Breach Details</h4>
                {result.breaches.map((breach, index) => (
                  <div key={index} className="breach-item">
                    <div className="breach-header">
                      <h5>{breach.Name}</h5>
                      {breach.BreachDate && (
                        <span className="breach-date">
                          {new Date(breach.BreachDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {breach.Description && (
                      <p className="breach-description">{breach.Description}</p>
                    )}
                    {breach.DataClasses && breach.DataClasses.length > 0 && (
                      <div className="breach-data">
                        <strong>Exposed Data:</strong>
                        <div className="data-tags">
                          {breach.DataClasses.map((dataClass, idx) => (
                            <span key={idx} className="data-tag">
                              {dataClass}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <RiskScore score={result.riskScore} />
            <Recommendations recommendations={result.recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}

export default BreachChecker;

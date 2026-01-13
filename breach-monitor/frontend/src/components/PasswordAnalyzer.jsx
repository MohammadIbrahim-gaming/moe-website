import React, { useState } from 'react';
import './PasswordAnalyzer.css';

function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const analyzePassword = (pwd) => {
    if (!pwd) {
      setAnalysis(null);
      return;
    }

    const checks = {
      length: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      common: !['password', '123456', 'password123', 'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'qwerty', 'abc123'].includes(pwd.toLowerCase()),
      noRepeats: !/(.)\1{2,}/.test(pwd),
      noSequences: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(pwd)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const strength = score <= 3 ? 'Weak' : score <= 5 ? 'Fair' : score <= 7 ? 'Good' : 'Strong';

    const recommendations = [];
    if (!checks.length) recommendations.push('Use at least 12 characters');
    if (!checks.uppercase) recommendations.push('Include uppercase letters');
    if (!checks.lowercase) recommendations.push('Include lowercase letters');
    if (!checks.numbers) recommendations.push('Include numbers');
    if (!checks.special) recommendations.push('Include special characters');
    if (!checks.common) recommendations.push('Avoid common passwords');
    if (!checks.noRepeats) recommendations.push('Avoid repeating characters');
    if (!checks.noSequences) recommendations.push('Avoid sequential patterns');

    setAnalysis({
      score,
      strength,
      checks,
      recommendations,
      estimatedTime: estimateCrackTime(pwd, checks)
    });
  };

  const estimateCrackTime = (pwd, checks) => {
    let entropy = 0;
    if (checks.lowercase) entropy += 26;
    if (checks.uppercase) entropy += 26;
    if (checks.numbers) entropy += 10;
    if (checks.special) entropy += 32;

    const combinations = Math.pow(entropy, pwd.length);
    const guessesPerSecond = 1e9; // 1 billion guesses per second
    const seconds = combinations / guessesPerSecond;

    if (seconds < 60) return 'Less than a minute';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    analyzePassword(value);
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return 'weak';
      case 'Fair': return 'fair';
      case 'Good': return 'good';
      case 'Strong': return 'strong';
      default: return 'weak';
    }
  };

  return (
    <div className="password-analyzer">
      <div className="analyzer-card">
        <h2>Password Strength Analyzer</h2>
        <p className="subtitle">
          Analyze your password strength locally. Your password is never sent to any server.
        </p>

        <div className="password-input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password to analyze"
            className="password-input"
          />
          <button
            type="button"
            className="toggle-visibility"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {analysis && (
          <div className="analysis-results">
            <div className={`strength-indicator strength-${getStrengthColor(analysis.strength)}`}>
              <div className="strength-header">
                <h3>Password Strength: {analysis.strength}</h3>
                <div className="strength-score">{analysis.score}/9</div>
              </div>
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{ width: `${(analysis.score / 9) * 100}%` }}
                />
              </div>
            </div>

            <div className="checks-list">
              <h4>Security Checks</h4>
              <div className="checks-grid">
                <div className={`check-item ${analysis.checks.length ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.length ? '✅' : '❌'}</span>
                  <span>At least 12 characters</span>
                </div>
                <div className={`check-item ${analysis.checks.uppercase ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.uppercase ? '✅' : '❌'}</span>
                  <span>Uppercase letters</span>
                </div>
                <div className={`check-item ${analysis.checks.lowercase ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.lowercase ? '✅' : '❌'}</span>
                  <span>Lowercase letters</span>
                </div>
                <div className={`check-item ${analysis.checks.numbers ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.numbers ? '✅' : '❌'}</span>
                  <span>Numbers</span>
                </div>
                <div className={`check-item ${analysis.checks.special ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.special ? '✅' : '❌'}</span>
                  <span>Special characters</span>
                </div>
                <div className={`check-item ${analysis.checks.common ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.common ? '✅' : '❌'}</span>
                  <span>Not a common password</span>
                </div>
                <div className={`check-item ${analysis.checks.noRepeats ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.noRepeats ? '✅' : '❌'}</span>
                  <span>No repeating characters</span>
                </div>
                <div className={`check-item ${analysis.checks.noSequences ? 'pass' : 'fail'}`}>
                  <span className="check-icon">{analysis.checks.noSequences ? '✅' : '❌'}</span>
                  <span>No sequential patterns</span>
                </div>
              </div>
            </div>

            <div className="crack-time">
              <strong>Estimated time to crack:</strong> {analysis.estimatedTime}
            </div>

            {analysis.recommendations.length > 0 && (
              <div className="password-recommendations">
                <h4>Recommendations</h4>
                <ul>
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="privacy-note">
          <strong>🔒 Privacy Note:</strong> All password analysis is performed entirely in your browser. 
          Your password is never transmitted over the network or stored anywhere.
        </div>
      </div>
    </div>
  );
}

export default PasswordAnalyzer;

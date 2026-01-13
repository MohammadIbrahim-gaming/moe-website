# 🔐 Personal Data Breach & Dark-Web Exposure Monitor

A comprehensive web application that helps users monitor their personal data exposure in known data breaches, track ongoing risks, and receive security recommendations.

## Features

- ✅ **Breach Checking**: Check if your email, username, or phone number appears in known data breaches
- 🔔 **Ongoing Monitoring**: Automatically monitor checked items for new breaches
- 📊 **Risk Scoring**: Get a detailed risk score based on breach severity and recency
- 💡 **Security Recommendations**: Receive personalized security recommendations
- 🔒 **Password Analyzer**: Analyze password strength locally (never uploaded to servers)
- 🚨 **Alert System**: Get notified when new breaches are detected for monitored items

## Tech Stack

### Backend
- **Node.js** with Express
- **SQLite** database for storing monitored items and breach history
- **Have I Been Pwned API** integration for breach data

### Frontend
- **React** with modern hooks
- **Vite** for fast development and building
- **CSS** with CSS variables for theming

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd breach-monitor/backend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Have I Been Pwned API key for better rate limits:
   - Get a free API key from [Have I Been Pwned](https://haveibeenpwned.com/API/Key)
   - Create a `.env` file in the backend directory:
   ```
   HIBP_API_KEY=your_api_key_here
   ```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd breach-monitor/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Check for Breaches**: 
   - Navigate to the "Check Breach" tab
   - Select the type (email, username, or phone)
   - Enter the value and click "Check for Breaches"
   - View breach details, risk score, and recommendations

2. **Monitor Items**:
   - Items you check are automatically added to monitoring
   - View all monitored items in the "Monitored Items" tab
   - Click on an item to see its breach history
   - Items are automatically checked for new breaches

3. **Password Analysis**:
   - Go to the "Password Analyzer" tab
   - Enter a password to analyze its strength
   - All analysis happens locally in your browser
   - Get recommendations for improving password security

4. **View Alerts**:
   - Check the "Alerts" tab for new breach notifications
   - Alerts are created when new breaches are detected for monitored items
   - Mark alerts as read when you've addressed them

## API Endpoints

### `POST /api/check`
Check if an email, username, or phone is breached.

**Request Body:**
```json
{
  "type": "email",
  "value": "example@email.com"
}
```

**Response:**
```json
{
  "breached": true,
  "breaches": [...],
  "riskScore": 75,
  "recommendations": [...]
}
```

### `GET /api/monitored`
Get all monitored items.

### `GET /api/breaches/:id`
Get breach history for a specific monitored item.

### `GET /api/alerts`
Get all alerts.

### `PUT /api/alerts/:id/read`
Mark an alert as read.

### `DELETE /api/monitored/:id`
Remove a monitored item.

## Security & Privacy

- **Password Analysis**: All password analysis is performed entirely in the browser. Passwords are never sent to any server.
- **Data Storage**: Breach data is stored locally in SQLite database.
- **API Integration**: Uses Have I Been Pwned API with k-anonymity for email checking.
- **No Data Collection**: The application does not collect or store personal information beyond what you explicitly check.

## Limitations

- Phone number checking requires a specialized service (not fully implemented)
- Breach data is limited to what's available in the Have I Been Pwned database
- The application checks for known breaches, not real-time dark web monitoring

## Future Enhancements

- User authentication and accounts
- Scheduled automatic breach checks
- Email notifications for new breaches
- Integration with additional breach databases
- Dark web monitoring (requires specialized services)
- Password breach checking (using HIBP password API)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

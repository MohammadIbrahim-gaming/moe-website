# Quick Start Guide

Get the Breach Monitor up and running in minutes!

## Step 1: Install Backend Dependencies

```bash
cd breach-monitor/backend
npm install
```

## Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Step 3: Start the Backend

In the `backend` directory:
```bash
npm start
```

The backend will start on `http://localhost:3001`

## Step 4: Start the Frontend

In a new terminal, navigate to the `frontend` directory:
```bash
cd breach-monitor/frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 5: Open in Browser

Navigate to `http://localhost:3000` in your web browser.

## Optional: Add API Key

For better rate limits with the Have I Been Pwned API:

1. Get a free API key from [https://haveibeenpwned.com/API/Key](https://haveibeenpwned.com/API/Key)
2. Create a `.env` file in the `backend` directory:
   ```
   HIBP_API_KEY=your_api_key_here
   ```
3. Restart the backend server

## Troubleshooting

- **Port already in use**: Change the port in `backend/server.js` or `frontend/vite.config.js`
- **Database errors**: Delete `breach_monitor.db` in the backend directory and restart
- **API rate limits**: Add an HIBP API key to improve rate limits

## Next Steps

- Check your email for breaches
- Monitor items for ongoing exposure
- Analyze password strength
- Set up alerts for new breaches

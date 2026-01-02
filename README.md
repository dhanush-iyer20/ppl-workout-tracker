# PPL Workout Tracker

A beautiful calendar-based workout tracker for Push/Pull/Legs (PPL) routines with server-side data storage and visual analytics.

## Features

- 📅 **Calendar Interface** - Click on any date to add or edit workouts
- 💪 **PPL Routine** - Pre-configured Push, Pull, and Legs exercises
- 📊 **Monthly Analytics** - Visual charts and statistics for monthly progress
- 🖥️ **Server API** - Data stored on server, accessible from anywhere
- 📱 **Mobile Friendly** - Works great on phones and tablets

## Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Server:**
```bash
cd server
npm install
```

### 2. Start the Server

```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3001`

### 3. Start the Frontend

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Server API

The server provides REST API endpoints:

- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:userId` - Get workouts for a specific user
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout
- `GET /api/health` - Health check

Data is stored in `server/data/workouts.json`

## Deployment

### Deploy Server

You can deploy the server to:
- **Railway** (recommended) - Free tier available
- **Render** - Free tier available
- **Heroku** - Paid
- **VPS** - Any VPS provider

1. Push your code to GitHub
2. Connect to Railway/Render
3. Set environment variables if needed
4. Deploy!

### Deploy Frontend to Netlify

1. Update `src/services/storage.js` with your server URL:
   ```javascript
   const API_URL = 'https://your-server-url.com/api'
   ```

2. Or set environment variable:
   ```
   VITE_API_URL=https://your-server-url.com/api
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy the `dist` folder to Netlify

## Monthly Analytics

The app shows:
- **Monthly Stats Cards** - Total workouts, volume, average volume
- **Workout Type Distribution** - Pie chart showing Push/Pull/Legs breakdown
- **Weekly Workouts** - Bar chart of workouts per week
- **Daily Frequency** - Line chart showing workout frequency throughout the month

## Default Values

- Sets: 3 (default placeholder)
- Reps: 12 (default placeholder)
- Weight: Enter manually

## Exercises Included

### Push Day
- Overhead Press
- Lateral Raises
- Incline Bench Press
- Bench Press
- Decline Dumbbell Press
- Overhead Tricep Extension

### Pull Day
- Face Pull
- Seated Cable Row
- Chest Rows
- Lat Pulldown
- Hammer Curl
- Concentration Curls

### Legs Day
- Calf Raises
- Leg Extension
- Romanian Deadlift
- Hip Thrust
- Leg Curl
- Squat

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express
- **Storage:** JSON file (can be migrated to database)

## License

MIT

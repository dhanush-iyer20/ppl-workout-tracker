# Deployment Guide

## Quick Start - Local Development

1. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   ```
   Server runs on `http://localhost:3001`

2. **Start the frontend (in a new terminal):**
   ```bash
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## Deploy Server

### Option 1: Railway (Recommended - Free Tier)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js
6. Set the start command: `cd server && npm start`
7. Set PORT environment variable (Railway provides this automatically)
8. Deploy!

Your server URL will be: `https://your-app-name.railway.app`

### Option 2: Render (Free Tier)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Environment:** Node
6. Deploy!

Your server URL will be: `https://your-app-name.onrender.com`

### Option 3: VPS (DigitalOcean, AWS, etc.)

1. SSH into your server
2. Install Node.js
3. Clone your repository
4. Install dependencies: `cd server && npm install`
5. Use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name workout-api
   pm2 save
   pm2 startup
   ```

## Deploy Frontend to Netlify

1. **Update API URL:**
   
   Create a `.env.production` file:
   ```
   VITE_API_URL=https://your-server-url.com/api
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder, OR
   - Connect GitHub and auto-deploy
   - Add environment variable: `VITE_API_URL` = your server URL

## Environment Variables

### Server
- `PORT` - Server port (default: 3001)

### Frontend
- `VITE_API_URL` - Your server API URL (default: http://localhost:3001/api)

## Testing Deployment

1. Check server health: `https://your-server.com/api/health`
2. Test API: `https://your-server.com/api/workouts`
3. Update frontend with server URL
4. Deploy frontend
5. Test from your phone!

## Data Persistence

The server stores data in `server/data/workouts.json`. 

**For production**, consider migrating to a database:
- **PostgreSQL** (via Supabase)
- **MongoDB** (via MongoDB Atlas - free tier)
- **SQLite** (simple file-based database)

The current JSON file storage works fine for single-server deployments.


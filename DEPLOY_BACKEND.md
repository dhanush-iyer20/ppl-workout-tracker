# Deploy Backend Server

## Option 1: Railway (Recommended - Free Tier)

### Step 1: Sign Up
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js

### Step 3: Configure
1. Click on your service
2. Go to "Settings"
3. Set **Root Directory:** `server`
4. Set **Start Command:** `npm start`
5. Railway automatically sets PORT (no need to configure)

### Step 4: Deploy
1. Railway will automatically deploy
2. Wait for deployment to complete
3. Click "Settings" → "Generate Domain"
4. Your server URL will be: `https://your-app-name.up.railway.app`

### Step 5: Update Frontend
Update your frontend's API URL to: `https://your-app-name.up.railway.app/api`

---

## Option 2: Render (Free Tier)

### Step 1: Sign Up
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select your repository

### Step 3: Configure
- **Name:** workout-tracker-api (or any name)
- **Environment:** Node
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`
- **Plan:** Free

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will build and deploy
3. Your server URL will be: `https://your-app-name.onrender.com`

### Step 5: Update Frontend
Update your frontend's API URL to: `https://your-app-name.onrender.com/api`

---

## Option 3: VPS (DigitalOcean, AWS, etc.)

### Step 1: SSH into Server
```bash
ssh user@your-server-ip
```

### Step 2: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Clone Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/server
npm install
```

### Step 4: Install PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start index.js --name workout-api
pm2 save
pm2 startup
```

### Step 5: Configure Nginx (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Test Your Deployment

1. **Health Check:**
   ```
   https://your-server-url.com/api/health
   ```
   Should return: `{"status":"ok","message":"Workout Tracker API is running"}`

2. **Test GET:**
   ```
   https://your-server-url.com/api/workouts
   ```
   Should return: `[]` (empty array initially)

3. **Test POST:**
   ```bash
   curl -X POST https://your-server-url.com/api/workouts \
     -H "Content-Type: application/json" \
     -d '{"date":"2024-01-01","type":"push","exercises":[],"user_id":"test"}'
   ```

---

## Environment Variables

If needed, add in your hosting platform:
- `PORT` (usually auto-set by platform)
- `NODE_ENV=production`

---

## Troubleshooting

### Server not starting?
- Check logs in Railway/Render dashboard
- Make sure `server/package.json` has correct start script
- Verify Node.js version (18+ recommended)

### CORS errors?
- Server already has CORS enabled
- If issues persist, check your frontend URL is allowed

### Data not persisting?
- Railway/Render: Data persists in `server/data/workouts.json`
- For production, consider migrating to a database


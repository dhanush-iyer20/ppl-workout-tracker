# Deploy Frontend to Netlify

## Step-by-Step Guide

### 1. Prepare Your Code

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Update API URL

Before building, update the API URL in your code or environment variables.

**Option A: Update directly in code**
Edit `src/services/storage.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com/api'
```

**Option B: Use environment variable (Recommended)**
Create `.env.production` file:
```
VITE_API_URL=https://your-backend-url.com/api
```

### 3. Build the Project

```bash
npm run build
```

This creates a `dist` folder with all the production files.

### 4. Deploy to Netlify

#### Method 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop the `dist` folder onto Netlify
4. Your site is live! 🎉

#### Method 2: GitHub Integration (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.com/api`
7. Click "Deploy site"

### 5. Your Site is Live!

Netlify will give you a URL like: `https://your-app-name.netlify.app`

---

## Quick Deploy Commands

```bash
# 1. Build
npm run build

# 2. Deploy (if using Netlify CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```


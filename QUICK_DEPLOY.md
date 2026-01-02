# Quick Deployment Guide

## 🚀 Complete Deployment in 10 Minutes

### Part 1: Deploy Backend (5 minutes)

#### Using Railway (Easiest)

1. **Go to Railway:**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects everything!

3. **Configure:**
   - Click on your service
   - Settings → Root Directory: `server`
   - Settings → Start Command: `npm start`
   - Generate a domain

4. **Copy your URL:**
   - Example: `https://workout-api.up.railway.app`
   - Your API is at: `https://workout-api.up.railway.app/api`

---

### Part 2: Deploy Frontend (5 minutes)

#### Using Netlify

1. **Update API URL:**
   
   Create `.env.production` in root:
   ```
   VITE_API_URL=https://workout-api.up.railway.app/api
   ```
   
   Or edit `src/services/storage.js`:
   ```javascript
   const API_URL = 'https://workout-api.up.railway.app/api'
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag & drop the `dist` folder
   - OR connect GitHub for auto-deploy

4. **Add Environment Variable (if using .env):**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://workout-api.up.railway.app/api`
   - Redeploy

5. **Done!** 🎉
   - Your app is live at: `https://your-app.netlify.app`

---

## 📱 Test on Your Phone

1. Open the Netlify URL on your phone
2. Add a workout
3. Check if it saves
4. Open on another device - data should sync!

---

## 🔄 Update After Changes

### Backend:
- Push to GitHub
- Railway auto-deploys

### Frontend:
- Push to GitHub (if connected)
- OR: `npm run build` → drag `dist` to Netlify

---

## 🆘 Common Issues

### Frontend can't connect to backend?
- Check CORS is enabled (it is by default)
- Verify API URL is correct
- Check browser console for errors

### Data not saving?
- Check backend logs in Railway dashboard
- Verify API endpoint is accessible
- Test API directly: `https://your-api.com/api/health`

### Build errors?
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript/ESLint errors
- Verify Node.js version (18+)

---

## 💰 Cost

- **Railway:** Free tier (500 hours/month)
- **Netlify:** Free tier (100GB bandwidth)
- **Total:** $0/month! 🎉

---

## 📝 Checklist

- [ ] Backend deployed on Railway
- [ ] Backend URL copied
- [ ] Frontend API URL updated
- [ ] Frontend built (`npm run build`)
- [ ] Frontend deployed on Netlify
- [ ] Tested on desktop
- [ ] Tested on phone
- [ ] Data persists across devices

---

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Railway: Add custom domain in settings
   - Netlify: Add custom domain in settings

2. **Database Migration** (Optional):
   - Migrate from JSON file to PostgreSQL
   - Use Railway's PostgreSQL addon
   - Update server code to use database

3. **Authentication** (Optional):
   - Add user authentication
   - Secure API endpoints
   - Multi-user support


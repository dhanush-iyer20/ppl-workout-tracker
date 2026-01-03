# Netlify Environment Variable Setup

## Environment Variable Name

The environment variable to set in Netlify is:

```
VITE_API_URL
```

## How to Set It in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add variable**
5. Set:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://ppl-workout-tracker-groe.onrender.com/api`
6. Click **Save**
7. **Redeploy** your site for the changes to take effect

## Current API URL

The app currently uses:
- **Backend**: `https://ppl-workout-tracker-groe.onrender.com/api`
- **Fallback**: If `VITE_API_URL` is not set, it defaults to the Render URL above

## Understanding Netlify vs Render Requests

### Netlify (Frontend Hosting)
- **What it does**: Serves static HTML/CSS/JS files
- **Requests**: Only when someone visits your website
- **Cost**: Usually free for reasonable traffic
- **Not affected by**: API calls (those go to Render)

### Render (Backend API)
- **What it does**: Handles API requests (GET/POST/PUT/DELETE)
- **Requests**: Every time the app fetches/saves workouts
- **Free tier limits**: 750 hours/month, may spin down after inactivity
- **This is where API calls go**, not Netlify

## Request Optimization

I've added **caching** to reduce API calls:
- Workouts are cached for 30 seconds
- Multiple page interactions won't trigger new API calls
- Cache is cleared when you save/update/delete workouts
- This reduces requests to Render significantly

## If You're Seeing Excessive Requests

1. **Check Render dashboard** (not Netlify) - that's where API calls go
2. **Possible causes**:
   - Multiple devices/tabs open
   - Bots/crawlers visiting your site
   - Render's health checks
   - Browser auto-refresh extensions

3. **Solutions**:
   - The caching I added will help reduce duplicate requests
   - Consider adding authentication to prevent bot access
   - Monitor Render dashboard for actual request patterns


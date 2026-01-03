# About Netlify Requests

## The 2 Requests Every 2 Minutes from USA

These requests are **NOT from your code**. Your app only makes API calls when:
- A user loads the page (1 request to Render API)
- A user saves/updates/deletes a workout (1 request to Render API)

## What's Causing the Requests

The requests every 2 minutes from USA are likely:

1. **Netlify's Built-in Monitoring**
   - Netlify automatically monitors your site for uptime
   - This is a free service to check if your site is online
   - These requests go to Netlify (frontend), not your API

2. **Search Engine Bots/Crawlers**
   - Google, Bing, etc. crawl websites automatically
   - They visit to index your site
   - This is normal and expected

3. **Third-Party Monitoring Services**
   - If you've set up any uptime monitoring (like UptimeRobot, Pingdom, etc.)
   - They check your site periodically

## How to Check

1. **Netlify Dashboard** → **Analytics** → **Traffic**
   - See where requests are coming from
   - Check User-Agent strings to identify bots

2. **Netlify Dashboard** → **Functions** → **Logs**
   - See what's being requested
   - Check if it's just the homepage being pinged

## Important Notes

- **These requests are normal** and don't cost you anything on Netlify's free tier
- They're just checking if your site is online (health checks)
- They're NOT making API calls to Render
- Your code doesn't have any polling or automatic requests

## If You Want to Reduce Them

1. **Disable Netlify Monitoring** (if possible in settings)
2. **Add robots.txt** to block some crawlers (won't stop all)
3. **Use Netlify's bot detection** to filter out bot traffic in analytics

But honestly, these requests are harmless and expected for any public website.


# Deploying to Cloudflare Workers (Free Forever)

This guide explains how to deploy your LMS backend to **Cloudflare Workers**. Cloudflare offers a generous "Free Forever" tier that is perfect for hosting your API at the edge with zero cost for up to 100,000 requests per day.

## Prerequisites

1.  **Cloudflare Account**: [Sign up here](https://dash.cloudflare.com/sign-up).
2.  **MongoDB Atlas**: Ensure your Database is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloudflare cannot host the DB itself).
3.  **Cloudinary**: Keep your Cloudinary account for media storage.

---

## 🚀 Step-by-Step Deployment

### 1. Install Wrangler CLI
Cloudflare uses a CLI tool called `wrangler` to manage deployments. Run this in your `server` directory:

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
Authenticate the CLI with your account:

```bash
wrangler login
```

### 3. Initialize the Project
Create a `wrangler.toml` file in your **server** directory:

```toml
name = "bhavin-academy-api"
main = "server.js"
compatibility_date = "2024-01-01"
compatibility_flags = [ "nodejs_compat" ]

[vars]
# Add non-sensitive variables here if needed
```

### 4. Configure Environment Secrets
DO NOT put your passwords in the `wrangler.toml` file. Instead, use Cloudflare's secure secret management. Run these commands one by one and paste your values:

```bash
wrangler secret put MONGODB_URI
wrangler secret put JWT_SECRET
wrangler secret put CLOUDINARY_CLOUD_NAME
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET
```

### 5. Adapt Server for Workers (Optional)
Cloudflare Workers uses a slightly different environment than traditional Node.js. In your `server.js`, ensure you are exporting the app correctly. 

If using standard `express`, make sure you have:
```javascript
// At the bottom of server.js
export default app; 
```

### 6. Deploy!
Run the deployment command:

```bash
wrangler deploy
```

Your API will be live at a URL like: `https://bhavin-academy-api.your-username.workers.dev`

---

## 💎 Why Cloudflare for Lifetime?

1.  **Cost**: The Free tier gives you 100,000 requests/day for $0/month.
2.  **Global Speed**: Your server runs on the "edge," meaning it's physically close to your users anywhere in the world.
3.  **Auto-Scaling**: You never have to worry about the server crashing from too many users; Cloudflare handles the scale for you automatically.

## ⚠️ Important Notes
- **Cold Starts**: Workers have nearly zero "cold start" time compared to Vercel or Heroku.
- **Database Connection**: Ensure your MongoDB Atlas IP Whitelist allows "Access from Anywhere" (`0.0.0.0/0`) since Cloudflare Workers use dynamic IP addresses.

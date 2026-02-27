# How to Deploy the Server on Render

This guide explains how to deploy the LMS server to [Render](https://render.com/).

**Backend URL**: `https://bhabvinacademy.onrender.com/`

## Prerequisites

1. A Render account linked to your GitHub repository.
2. Access to your MongoDB connection string, Cloudinary credentials, and JWT secret.

## Deployment Steps

1. **Go to Render Dashboard**:
   - Log in to [Render](https://render.com/).
   - Click **New +** and select **Web Service**.

2. **Connect Repository**:
   - Connect your GitHub repository containing the LMS project.

3. **Configure the Web Service**:
   - **Name**: `bhabvin-academy-server` (or your preferred name)
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

4. **Add Environment Variables**:
   Under the **Environment** tab, add the following variables:

   | Key | Value |
   | :--- | :--- |
   | `PORT` | `5000` (or leave empty, Render handles this) |
   | `MONGO_URI` | `your_mongodb_connection_string` |
   | `CLIENT_URL` | `https://your-frontend-url.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | `your_cloudinary_cloud_name` |
   | `CLOUDINARY_API_KEY` | `your_cloudinary_api_key` |
   | `CLOUDINARY_API_SECRET` | `your_cloudinary_api_secret` |
   | `JWT_SECRET` | `your_jwt_secret` |
   | `JWT_EXPIRES_IN` | `7d` |

5. **Advanced Settings (Optional)**:
   - Ensure the node version is compatible by adding a `NODE_VERSION` environment variable if needed (e.g., `20.x`).

6. **Deploy**:
   - Click **Create Web Service**.
   - Wait for the build and deployment process to complete.

## Troubleshooting

- **CORS Errors**: Ensure the `CLIENT_URL` in your server's environment variables matches the actual URL where your frontend is hosted.
- **Connection Issues**: Double-check that your MongoDB IP whitelist allows access from anywhere (`0.0.0.0/0`) or specific Render IP ranges.
- **Start Command**: If the deployment fails due to the start command, verify that `node server.js` is the correct entry point.

---
*Note: Make sure to update the `CLIENT_URL` in the server environment variables whenever your frontend URL changes.*

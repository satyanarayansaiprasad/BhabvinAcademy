# How to Connect Cloudinary to the LMS Project

This guide explains how to integrate Cloudinary for cloud-based media management (like user avatars and course thumbnails).

## Step 1: Get Cloudinary Credentials
1. Log in to your [Cloudinary Dashboard](https://cloudinary.com/console).
2. At the top of the dashboard, locate your **Product Environment Credentials**.
3. Note down the following three values:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Configure Environment Variables
1. Open the `.env` file in the root directory of your LMS backend.
2. Add the following variables and paste your credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 3: Connect in Code
The application should use the `cloudinary` npm package. Ensure you have a configuration file (e.g., `config/cloudinary.js`):

```javascript
import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary Connected");
};

export default connectCloudinary;
```

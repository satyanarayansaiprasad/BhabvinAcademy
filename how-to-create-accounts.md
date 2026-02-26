# How to Create Accounts for LMS Project

This guide covers creating the essential accounts required to set up and run the LMS project.

## 1. MongoDB Atlas Account (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Sign up or log in using your Google or GitHub account.
3. Create a new Project and deploy a Free Tier Cluster (M0 Sandbox).
4. Save your database credentials (username and password).

## 2. Cloudinary Account (Media Storage)
1. Go to [Cloudinary](https://cloudinary.com/users/register/free).
2. Sign up for a free account.
3. Once logged in, go to the Dashboard.
4. Note down your `Cloud Name`, `API Key`, and `API Secret`.

## 3. JWT (JSON Web Tokens)
*Note: JWT does not require an account. It is an open standard used built into the application logic using a secret key.*
- You just need to create a strong random string (e.g., using `require("crypto").randomBytes(64).toString("hex")` in Node.js) and save it as your `JWT_SECRET` in your `.env` file.

After creating these accounts, proceed to the respective configuration guides to connect them to the project.

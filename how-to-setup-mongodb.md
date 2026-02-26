# How to Connect MongoDB to the LMS Project

This guide explains how to connect your MongoDB Atlas database to the LMS project.

## Step 1: Get the Connection String
1. Log in to your [MongoDB Atlas dashboard](https://cloud.mongodb.com/).
2. Navigate to your cluster and click the **Connect** button.
3. Select **Drivers** (Node.js).
4. Copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

## Step 2: Configure Environment Variables
1. Open the `.env` file in the root directory of your LMS backend.
2. Add the `MONGO_URI` variable and paste your connection string.
3. Replace `<username>` and `<password>` with the database user credentials you created earlier.

```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.abcde.mongodb.net/lms_database?retryWrites=true&w=majority
```

## Step 3: Connect in Code
The application should use Mongoose to connect to this URI. Ensure your backend code has a database connection utility similar to:

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

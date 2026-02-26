# How to Set Up JWT (JSON Web Tokens) in the LMS Project

This guide explains how to configure JWT for secure authentication in the LMS project.

## Step 1: Generate a Secret Key
You need a secure, random string to sign your tokens. You can generate one using Node.js:
1. Open your terminal.
2. Run the node repl by typing `node`.
3. Run: `require('crypto').randomBytes(64).toString('hex')`
4. Copy the generated string.

## Step 2: Configure Environment Variables
1. Open the `.env` file in the root directory of your LMS backend.
2. Add the `JWT_SECRET` variable and set it to the string you generated.
3. Add a `JWT_EXPIRES_IN` variable (e.g., `7d` for 7 days).

```env
JWT_SECRET=your_generated_random_secret_string_here
JWT_EXPIRES_IN=7d
```

## Step 3: Implementation Detail
The application uses the `jsonwebtoken` package to sign and verify tokens.
- **Signing in/Registering:** The server generates a token using `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })`.
- **Protecting Routes:** Middleware extracts the token from the `Authorization` header and verifies it using `jwt.verify(token, process.env.JWT_SECRET)`.

# CookBook App

## Tech Stack
- **Backend:** Node.js, Express.js 5.2.1
- **Frontend:** EJS Templates
- **Database:** MongoDB with Mongoose 9.0.2
- **Authentication:** bcrypt 6.0.0, express-session 1.18.2
- **Utilities:** dotenv, morgan, method-override

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```
MONGODB_URI=your-MongoURI-change-this
SESSION_SECRET=your-secret-key-change-this
PORT=4444
```

### 3. Start MongoDB
Make sure MongoDB is running locally or update MONGODB_URI with your MongoDB connection string.

### 4. Start the Server
```bash
npm start
```

Visit `http://localhost:4444` in your browser.
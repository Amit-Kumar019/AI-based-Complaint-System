# Smart Complaint Management System

This repository contains an AI-Based Smart Complaint Management System built with the MERN Stack and OpenRouter Gemini API.

## Features

- **Frontend (React & Vite)**:
  - Complaint Registration Form
  - Complaint List Page (Dashboard)
  - Complaint Status Update
  - AI Analysis Result Display
  - Beautiful, vibrant, glassmorphic design

- **Backend (Node.js & Express)**:
  - RESTful APIs for User Authentication (JWT + bcrypt)
  - Complaint Management APIs (CRUD, filter, search)
  - AI API Integration via OpenRouter Gemini (`/api/ai/analyze`)

- **Database (MongoDB)**:
  - Robust schemas for Users and Complaints.

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running
- OpenRouter API Key

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure the environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smart-complaint-system
   JWT_SECRET=supersecretcomplaintjwt
   OPENROUTER_API_KEY=your_api_key_here
   ```
4. Start the server: `npm start` (or `node server.js`)

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Complaints
- `POST /api/complaints` - Add a complaint
- `GET /api/complaints` - Get all complaints
- `PUT /api/complaints/:id` - Update status
- `GET /api/complaints/search?location=...` - Search by location

### AI Analysis
- `POST /api/ai/analyze` - Analyzes complaint and returns priority, department, summary, and autoResponse.

## Deployment Notes
- Prepare frontend build using `npm run build`
- Deploy backend and frontend to Render using standard configurations. 
- Ensure Environment variables are added to Render configurations.

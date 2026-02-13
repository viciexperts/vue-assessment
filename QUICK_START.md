# Quick Start Guide

This guide will help you get the assessment up and running quickly.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Start the Backend

In the `backend` directory:
```bash
npm run dev
```

You should see:
```
🚀 Campaign API server running on http://localhost:3000
```

The API is now available. You can test it by visiting:
- `http://localhost:3000/health` - Health check
- `http://localhost:3000/api/campaigns` - Get all campaigns

## Step 3: Start the Frontend

In the `frontend` directory (in a new terminal):
```bash
npm run dev
```

The app should open automatically at `http://localhost:5173`

## Step 4: Verify Setup

1. ✅ Backend is running on port 3000
2. ✅ Frontend is running on port 5173
3. ✅ You can see the Campaign Dashboard placeholder page

## Next Steps

1. Read `ASSESSMENT.md` for detailed requirements and API endpoint information
2. Start implementing the required tasks in `frontend/src/`

## Troubleshooting

### Port Already in Use
If port 3000 or 5173 is already in use:
- Backend: Change port in `backend/server.js` (line with `PORT = 3000`)
- Frontend: Change port in `frontend/vite.config.js`

### CORS Issues
The backend already has CORS enabled. If you encounter issues, check `backend/server.js`.

### Module Not Found
Make sure you've run `npm install` in both `backend` and `frontend` directories.

## API Testing

You can test the API using:
- Browser (GET requests): `http://localhost:3000/api/campaigns`
- curl: `curl http://localhost:3000/api/campaigns`
- Postman/Insomnia: See `ASSESSMENT.md` for endpoint details

# Frontend Developer Assessment Tasks

## Overview

You'll be building a **Marketing Campaign Dashboard** that allows users to view and create marketing campaigns. The backend API is already implemented and running. Your task is to build a clean, functional Vue 3 frontend.

## 🎯 Tasks

### Task 1: Campaign List View

Build a campaign list page that:
- Displays all campaigns from the API (`GET /api/campaigns`)
- Shows campaign name, status, budget, and dates
- Includes a search input to filter campaigns by name
- Shows loading and error states
- Is responsive (works on mobile and desktop)

**API Endpoint:** `GET /api/campaigns`

**Response Format:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Summer Sale 2024",
      "status": "active",
      "budget": 50000,
      "spent": 12500,
      "startDate": "2024-06-01",
      "endDate": "2024-08-31",
      "description": "Summer promotion campaign",
      "targetAudience": "18-45, US"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Task 2: Campaign Detail View

Create a campaign detail page that:
- Shows full campaign information from the API (`GET /api/campaigns/:id`)
- Displays campaign metrics (impressions, clicks, conversions, etc.)
- Includes a back button to return to the list
- Handles not-found states (when campaign doesn't exist)

**API Endpoint:** `GET /api/campaigns/:id`

**Response Format:**
```json
{
  "data": {
    "id": "1",
    "name": "Summer Sale 2024",
    "status": "active",
    "budget": 50000,
    "spent": 12500,
    "startDate": "2024-06-01",
    "endDate": "2024-08-31",
    "description": "Summer promotion campaign",
    "targetAudience": "18-45, US",
    "metrics": {
      "impressions": 125000,
      "clicks": 3500,
      "conversions": 245,
      "ctr": 2.8,
      "cpc": 3.57
    }
  }
}
```

### Task 3: Create Campaign Form

Build a form to create new campaigns that:
- Allows users to create a new campaign
- Includes fields: name, status, budget, startDate, endDate, description, targetAudience
- Has basic form validation (required fields, date validation)
- Shows validation errors
- Submits to the API (`POST /api/campaigns`)
- Redirects to the campaign list after successful creation

**API Endpoint:** `POST /api/campaigns`

**Request Body:**
```json
{
  "name": "Winter Campaign 2024",
  "status": "active",
  "budget": 75000,
  "startDate": "2024-12-01",
  "endDate": "2024-12-31",
  "description": "Holiday season promotion",
  "targetAudience": "25-55, US, Canada"
}
```

**Status Values:** `active`, `paused`, `completed`, `draft`

## 🛠️ Technical Requirements

- Use **Vue 3** with Composition API
- Use **Vue Router** for navigation (already configured)
- Use **Axios** for API calls (instance provided in `src/services/api.js`)
- Create reusable components where appropriate
- Handle loading and error states
- Make it responsive

## 📝 Notes

- Focus on clean, working code
- Use Vue 3 best practices
- The backend API is running on `http://localhost:3000`
- All API endpoints require the header: `X-User-Id: assessment-user` (already configured in `api.js`)
- Test your implementation by starting both backend and frontend servers

## ✅ What We're Looking For

- Clean, readable code
- Proper component structure
- Working functionality
- Basic error handling
- Responsive design
- Good user experience

Good luck! 🚀

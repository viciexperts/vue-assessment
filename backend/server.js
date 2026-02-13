const express = require('express');
const expressCoreValidator = require('express-core-validator');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(expressCoreValidator());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
      statusCode: err.status || 500
    }
  });
};

// Simulate delay for more realistic API behavior
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Sample campaign data
let campaigns = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    status: 'active',
    budget: 50000,
    spent: 12500,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    description: 'Summer promotion campaign targeting young adults',
    targetAudience: '18-45, US',
    createdAt: '2024-05-15T10:30:00Z',
    updatedAt: '2024-06-20T14:22:00Z',
    metrics: {
      impressions: 125000,
      clicks: 3500,
      conversions: 245,
      ctr: 2.8,
      cpc: 3.57,
      roas: 4.2
    },
    history: [
      {
        date: '2024-06-20T14:22:00Z',
        action: 'updated',
        changes: { budget: [45000, 50000] }
      },
      {
        date: '2024-06-01T09:00:00Z',
        action: 'activated',
        changes: {}
      }
    ]
  },
  {
    id: '2',
    name: 'Back to School',
    status: 'active',
    budget: 30000,
    spent: 18900,
    startDate: '2024-08-15',
    endDate: '2024-09-15',
    description: 'Back to school shopping campaign',
    targetAudience: '18-35, US, Canada',
    createdAt: '2024-07-20T11:15:00Z',
    updatedAt: '2024-08-20T16:45:00Z',
    metrics: {
      impressions: 89000,
      clicks: 2400,
      conversions: 156,
      ctr: 2.7,
      cpc: 7.88,
      roas: 3.8
    },
    history: [
      {
        date: '2024-08-20T16:45:00Z',
        action: 'updated',
        changes: { status: ['paused', 'active'] }
      }
    ]
  },
  {
    id: '3',
    name: 'Holiday Special 2023',
    status: 'completed',
    budget: 100000,
    spent: 98750,
    startDate: '2023-11-20',
    endDate: '2023-12-31',
    description: 'Holiday season campaign',
    targetAudience: '25-65, US',
    createdAt: '2023-10-15T09:00:00Z',
    updatedAt: '2023-12-31T23:59:59Z',
    metrics: {
      impressions: 450000,
      clicks: 12500,
      conversions: 890,
      ctr: 2.78,
      cpc: 7.90,
      roas: 5.1
    },
    history: [
      {
        date: '2023-12-31T23:59:59Z',
        action: 'completed',
        changes: {}
      }
    ]
  },
  {
    id: '4',
    name: 'Spring Collection',
    status: 'paused',
    budget: 40000,
    spent: 15000,
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    description: 'Spring fashion campaign',
    targetAudience: '22-40, US, EU',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-04-10T14:30:00Z',
    metrics: {
      impressions: 67000,
      clicks: 1800,
      conversions: 98,
      ctr: 2.69,
      cpc: 8.33,
      roas: 3.2
    },
    history: [
      {
        date: '2024-04-10T14:30:00Z',
        action: 'paused',
        changes: {}
      }
    ]
  },
  {
    id: '5',
    name: 'Black Friday Blitz',
    status: 'draft',
    budget: 150000,
    spent: 0,
    startDate: '2024-11-29',
    endDate: '2024-11-29',
    description: 'Black Friday one-day sale',
    targetAudience: 'All demographics, Global',
    createdAt: '2024-06-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      roas: 0
    },
    history: []
  }
];

let nextId = 6;

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateBudgetUsage = (budget, spent) => {
  if (budget === 0) return 0;
  return Math.round((spent / budget) * 100);
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to validate campaign data
function validateCampaign(data, isUpdate = false) {
  const errors = [];
  
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }
  }
  
  if (!isUpdate || data.status !== undefined) {
    const validStatuses = ['active', 'paused', 'completed', 'draft'];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }
  
  if (!isUpdate || data.budget !== undefined) {
    if (data.budget !== undefined && (typeof data.budget !== 'number' || data.budget < 0)) {
      errors.push('Budget must be a positive number');
    }
  }
  
  if (!isUpdate || data.startDate !== undefined) {
    if (data.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)) {
      errors.push('Start date must be in YYYY-MM-DD format');
    }
  }
  
  if (!isUpdate || data.endDate !== undefined) {
    if (data.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.endDate)) {
      errors.push('End date must be in YYYY-MM-DD format');
    }
  }
  
  if (data.startDate && data.endDate) {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      errors.push('Start date must be before end date');
    }
  }
  
  return errors;
}

// GET /api/stats - Get dashboard statistics
app.get('/api/stats', async (req, res) => {
  await delay();
  
  try {
    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      pausedCampaigns: campaigns.filter(c => c.status === 'paused').length,
      completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
      draftCampaigns: campaigns.filter(c => c.status === 'draft').length,
      totalBudget: campaigns.reduce((sum, c) => sum + c.budget, 0),
      totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
      totalImpressions: campaigns.reduce((sum, c) => sum + (c.metrics?.impressions || 0), 0),
      totalClicks: campaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0),
      totalConversions: campaigns.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0)
    };
    
    stats.availableBudget = stats.totalBudget - stats.totalSpent;
    stats.averageCTR = stats.totalClicks > 0 
      ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)
      : 0;
    stats.conversionRate = stats.totalClicks > 0
      ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(2)
      : 0;
    
    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});

// GET /api/campaigns - Get all campaigns with pagination and filters
app.get('/api/campaigns', async (req, res) => {
  await delay();
  
  try {
    let filteredCampaigns = [...campaigns];
    
    // Filter by status
    if (req.query.status) {
      filteredCampaigns = filteredCampaigns.filter(c => c.status === req.query.status);
    }
    
    // Search by name or description
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredCampaigns = filteredCampaigns.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        (c.description && c.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by date range
    if (req.query.startDate) {
      filteredCampaigns = filteredCampaigns.filter(c => c.startDate >= req.query.startDate);
    }
    if (req.query.endDate) {
      filteredCampaigns = filteredCampaigns.filter(c => c.endDate <= req.query.endDate);
    }
    
    // Sort campaigns
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder || 'desc';
    filteredCampaigns.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'name') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);
    const total = filteredCampaigns.length;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      data: paginatedCampaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});

// GET /api/campaigns/:id - Get campaign by ID
app.get('/api/campaigns/:id', async (req, res) => {
  await delay();
  
  try {
    const campaign = campaigns.find(c => c.id === req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        error: {
          message: 'Campaign not found',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      });
    }
    
    res.json({ data: campaign });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});

// POST /api/campaigns - Create new campaign
app.post('/api/campaigns', async (req, res) => {
  await delay(500); // Longer delay for POST
  
  try {
    const validationErrors = validateCampaign(req.body, false);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
          details: validationErrors
        }
      });
    }
    
    const now = new Date().toISOString();
    const newCampaign = {
      id: String(nextId++),
      name: req.body.name.trim(),
      status: req.body.status || 'draft',
      budget: req.body.budget || 0,
      spent: 0,
      startDate: req.body.startDate || '',
      endDate: req.body.endDate || '',
      description: req.body.description?.trim() || '',
      targetAudience: req.body.targetAudience?.trim() || '',
      createdAt: now,
      updatedAt: now,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        roas: 0
      },
      history: [
        {
          date: now,
          action: 'created',
          changes: {},
          user: req.headers['x-user-id'] || 'system'
        }
      ]
    };
    
    campaigns.push(newCampaign);
    
    res.status(201).json({ data: newCampaign });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});
// PUT /api/campaigns/:id - Update campaign
app.put('/api/campaigns/:id', async (req, res) => {
  await delay(500);
  
  try {
    const index = campaigns.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        error: {
          message: 'Campaign not found',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      });
    }
    
    const validationErrors = validateCampaign(req.body, true);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
          details: validationErrors
        }
      });
    }
    
    const oldCampaign = { ...campaigns[index] };
    const changes = {};
    
    // Update only provided fields
    const updatableFields = ['name', 'status', 'budget', 'startDate', 'endDate', 'description', 'targetAudience'];
    Object.keys(req.body).forEach(key => {
      if (updatableFields.includes(key) && req.body[key] !== undefined) {
        const newValue = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
        if (oldCampaign[key] !== newValue) {
          changes[key] = [oldCampaign[key], newValue];
          campaigns[index][key] = newValue;
        }
      }
    });
    
    campaigns[index].updatedAt = new Date().toISOString();
    
    // Add to history if changes were made
    if (Object.keys(changes).length > 0) {
      campaigns[index].history.unshift({
        date: new Date().toISOString(),
        action: 'updated',
        changes,
        user: req.headers['x-user-id'] || 'system'
      });
    }
    
    res.json({ data: campaigns[index] });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});

// DELETE /api/campaigns/:id - Delete campaign
app.delete('/api/campaigns/:id', async (req, res) => {
  await delay(400);
  
  try {
    const index = campaigns.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        error: {
          message: 'Campaign not found',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      });
    }
    
    campaigns.splice(index, 1);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});


// PATCH /api/campaigns/:id/status - Update campaign status only
app.patch('/api/campaigns/:id/status', async (req, res) => {
  await delay(300);
  
  try {
    const index = campaigns.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        error: {
          message: 'Campaign not found',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      });
    }
    
    const validStatuses = ['active', 'paused', 'completed', 'draft'];
    const newStatus = req.body.status;
    
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        error: {
          message: `Status must be one of: ${validStatuses.join(', ')}`,
          code: 'VALIDATION_ERROR',
          statusCode: 400
        }
      });
    }
    
    const oldStatus = campaigns[index].status;
    campaigns[index].status = newStatus;
    campaigns[index].updatedAt = new Date().toISOString();
    
    campaigns[index].history.unshift({
      date: new Date().toISOString(),
      action: 'status_changed',
      changes: { status: [oldStatus, newStatus] },
      user: req.headers['x-user-id'] || 'system'
    });
    
    res.json({ data: campaigns[index] });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});

// GET /api/campaigns/:id/metrics - Get campaign metrics with optional date range
app.get('/api/campaigns/:id/metrics', async (req, res) => {
  await delay(200);
  
  try {
    const campaign = campaigns.find(c => c.id === req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        error: {
          message: 'Campaign not found',
          code: 'NOT_FOUND',
          statusCode: 404
        }
      });
    }
    
    const metrics = {
      ...campaign.metrics,
      budgetUsage: calculateBudgetUsage(campaign.budget, campaign.spent),
      budgetRemaining: campaign.budget - campaign.spent,
      daysRemaining: campaign.endDate 
        ? Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
        : null
    };
    
    res.json({ data: metrics });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500
      }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
      statusCode: 404,
      path: req.path
    }
  });
});

// Use error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Campaign API server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/campaigns - List all campaigns`);
  console.log(`   GET  /api/campaigns/:id - Get campaign details`);
  console.log(`   POST /api/campaigns - Create new campaign`);
  console.log(`   PUT  /api/campaigns/:id - Update campaign`);
  console.log(`   PATCH /api/campaigns/:id/status - Update campaign status`);
  console.log(`   DELETE /api/campaigns/:id - Delete campaign`);
  console.log(`   GET  /api/stats - Get dashboard statistics`);
  console.log(`   GET  /api/campaigns/:id/metrics - Get campaign metrics`);
  console.log(`   GET  /health - Health check`);
});

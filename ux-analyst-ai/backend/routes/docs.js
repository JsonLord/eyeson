const express = require('express');
const router = express.Router();

// Define documentation of all endpoints
const apiDocs = {
  title: "UX Analyst AI API Documentation",
  version: "1.0.0",
  endpoints: [
    {
      path: "/health",
      method: "GET",
      purpose: "Get overall system health status",
      response: {
        status: "string",
        timestamp: "string"
      }
    },
    {
      path: "/api/health",
      method: "GET",
      purpose: "Detailed health status of all internal services",
      response: {
        status: "string",
        services: "object",
        statistics: "object",
        timestamp: "string"
      }
    },
    {
      path: "/api/analyze",
      method: "POST",
      purpose: "Start a new UX analysis for a given URL",
      requestBody: {
        url: "string (required)",
        options: {
          viewports: "array (optional, ['desktop', 'tablet', 'mobile'])",
          includeAccessibility: "boolean (optional)",
          analysisType: "string (optional, ['quick', 'comprehensive'])"
        }
      },
      response: {
        id: "string",
        status: "string",
        url: "string"
      }
    },
    {
      path: "/api/analyze/:id",
      method: "GET",
      purpose: "Get the status and results of a specific analysis",
      response: {
        id: "string",
        status: "string",
        progress: "number",
        stage: "string",
        results: "object",
        screenshots: "object"
      }
    },
    {
      path: "/api/analyze/:id/report",
      method: "GET",
      purpose: "Get a formatted HTML report of the analysis"
    },
    {
      path: "/api/analyze/:id/code",
      method: "GET",
      purpose: "Get the generated implementation code"
    },
    {
      path: "/api-docs",
      method: "GET",
      purpose: "This documentation"
    }
  ]
};

router.get('/', (req, res) => {
  res.json(apiDocs);
});

module.exports = router;

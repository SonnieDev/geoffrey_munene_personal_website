# Himalayas MCP Setup Guide

This guide explains how to set up the Himalayas MCP (Model Context Protocol) server for use with Cursor AI assistant.

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. The Himalayas MCP server provides access to remote job listings and company information.

## Prerequisites

- Node.js installed on your system
- Verify installation: `node --version`

## Setup for Cursor

### Option 1: Automatic Installation (Recommended)

1. Visit: https://cursor.com/install-mcp?name=himalayas&config=eyJjb21tYW5kIjoibnB4IG1jcC1yZW1vdGUgaHR0cHM6Ly9tY3AuaGltYWxheWFzLmFwcC9zc2UifQ%3D%3D
2. Click the install button to automatically configure Cursor

### Option 2: Manual Setup

1. Open Cursor Settings
2. Navigate to MCP (Model Context Protocol) settings
3. Click "Add Server" or "New Server"
4. Choose Type: **"Command"**
5. Enter the command:
   ```
   npx mcp-remote https://mcp.himalayas.app/sse
   ```
6. Save the configuration
7. Restart Cursor completely

## Available MCP Tools

Once configured, the following tools will be available in Cursor:

### 1. search_jobs
Search and filter remote job listings with parameters:
- `keyword` (optional): Search term for skills, roles, or technologies
- `page` (optional, default: 1): Page number for pagination
- `country` (optional): Filter by country (e.g., 'Canada', 'United States', 'UK')
- `worldwide` (optional): Show only 100% remote jobs worldwide

### 2. search_companies
Search and filter companies offering remote positions with similar parameters

## Usage

After setup, you can ask Cursor AI to:
- "Search for remote developer jobs"
- "Find remote jobs in Canada"
- "Get remote jobs for React developers"

The AI will use the MCP tools to fetch real-time data from Himalayas.

## Website Integration

Note: For direct website integration (not AI assistant), we use the Himalayas JSON API instead of MCP. See the backend implementation in `server/controllers/jobsController.js` for the API integration.

## Resources

- Himalayas MCP Documentation: https://himalayas.app/mcp
- Himalayas JSON API: https://himalayas.app/api
- Himalayas Website: https://himalayas.app


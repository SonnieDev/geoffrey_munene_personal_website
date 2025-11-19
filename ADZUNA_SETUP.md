# Adzuna API Setup Guide

## Getting Your Free Adzuna API Key

Adzuna offers a free API tier with 1,000 requests per month - perfect for your remote jobs page!

### Steps to Get Your API Key:

1. **Visit Adzuna Developer Portal**
   - Go to: https://developer.adzuna.com/
   - Click "Sign Up" or "Get Started"

2. **Create a Free Account**
   - Sign up with your email
   - Verify your email address

3. **Create a New Application**
   - Once logged in, go to "My Applications"
   - Click "Create New Application"
   - Fill in the application details:
     - Name: "Geoffrey Munene Portfolio"
     - Description: "Remote job listings for portfolio website"
     - Website: Your website URL

4. **Get Your API Credentials**
   - After creating the application, you'll receive:
     - **Application ID** (APP_ID)
     - **API Key** (API_KEY)

5. **Add to Your .env File**
   - Open `server/.env`
   - Add these lines:
     ```
     ADZUNA_APP_ID=your_app_id_here
     ADZUNA_API_KEY=your_api_key_here
     ```

6. **Restart Your Server**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again

### API Limits (Free Tier)
- **1,000 requests per month**
- Perfect for a personal portfolio site
- Resets monthly

### What You Get
- Real-time remote job listings
- Searchable and filterable jobs
- Job details including salary, location, company
- Multiple categories
- Pagination support

### Alternative: Using Sample Jobs
If you don't want to set up the API right now, the page will automatically use sample jobs so you can see how it works!

## Testing

Once you've added your API keys, visit:
- http://localhost:5173/remote-jobs
- Try searching for jobs
- Filter by category
- Browse through pages

The jobs will be real listings from Adzuna's database!


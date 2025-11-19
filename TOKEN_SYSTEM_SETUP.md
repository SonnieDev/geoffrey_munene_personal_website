# Token System Setup Guide

This document explains how to set up and use the token-based payment system for AI tools.

## Overview

The token system allows users to:
- Get free trial tokens (10 tokens by default)
- Purchase additional tokens via Paystack
- Use tokens to access AI-powered tools
- Track their token balance and transaction history

## Environment Variables

Add these to your `.env` file:

```env
# Token System
TRIAL_TOKENS=10  # Number of free tokens given to new users

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_...  # Your Paystack secret key
```

## Paystack Setup

1. **Create a Paystack Account**
   - Sign up at https://paystack.com
   - Get your API keys from Settings > API Keys & Webhooks

2. **Set up Webhook**
   - Go to Settings > API Keys & Webhooks > Webhooks
   - Add endpoint: `https://yourdomain.com/api/tokens/webhook`
   - Select events: `charge.success` or `charge.successful`
   - Paystack will automatically sign webhook requests

3. **Test Mode**
   - Use test keys (starts with `sk_test_` and `pk_test_`) for development
   - Use test card: `4084 0840 8408 4081` with any future expiry date and any CVV
   - Test email: Use any email address

## Token Costs

Default token costs per tool:
- Resume Builder: 5 tokens
- Cover Letter: 4 tokens
- Email Template: 2 tokens
- Interview Prep: 6 tokens
- Skills Assessment: 5 tokens
- Salary Negotiation: 5 tokens

You can adjust these in `server/middleware/tokenMiddleware.js`:

```javascript
const TOKEN_COSTS = {
  resume: 5,
  'cover-letter': 4,
  // ... etc
}
```

## Token Packages

Default packages in KES (can be modified in `server/controllers/tokenController.js`):
- Small: 50 tokens for KES 500
- Medium: 150 tokens for KES 1,300 (Most Popular)
- Large: 500 tokens for KES 4,000

## How It Works

### User Flow

1. **First Visit**
   - User gets a session ID stored in localStorage
   - Server creates a User record with trial tokens
   - Trial tokens are automatically added

2. **Using Tools**
   - User selects a tool and fills the form
   - System checks if user has enough tokens
   - If yes: tokens are deducted after successful generation
   - If no: user is prompted to purchase tokens

3. **Purchasing Tokens**
   - User clicks "Buy More" button
   - Selects a token package
   - Redirected to Stripe Checkout
   - After payment: webhook adds tokens to account
   - User is redirected back with success message

### Technical Flow

1. **Token Check Middleware** (`checkTokens`)
   - Runs before each tool request
   - Validates session ID
   - Checks token balance
   - Attaches user and cost to request

2. **Token Deduction** (`deductTokens`)
   - Called after successful AI generation
   - Deducts tokens from user balance
   - Records transaction in database

3. **Payment Processing**
   - Paystack payment initialized
   - User redirected to Paystack payment page
   - User completes payment
   - User redirected back with reference code
   - Payment verified and tokens added
   - Webhook also receives confirmation (backup)

## Database Models

### User Model
- `sessionId`: Unique identifier (stored in localStorage)
- `tokens`: Current token balance
- `trialTokensGiven`: Whether user received trial tokens
- `totalTokensPurchased`: Lifetime purchased tokens
- `totalTokensUsed`: Lifetime used tokens

### TokenTransaction Model
- Tracks all token movements (purchases, usage, trials)
- Links to Stripe payment intents
- Records tool usage for analytics

## API Endpoints

### Public Endpoints

- `GET /api/tokens/balance` - Get current token balance
- `GET /api/tokens/transactions` - Get transaction history
- `POST /api/tokens/initialize-payment` - Initialize Paystack payment
- `POST /api/tokens/verify-payment` - Verify payment (after redirect)
- `POST /api/tokens/webhook` - Paystack webhook handler

### Tool Endpoints (Protected by Token Middleware)

- `POST /api/tools/resume` - Requires 5 tokens
- `POST /api/tools/cover-letter` - Requires 4 tokens
- `POST /api/tools/email` - Requires 2 tokens
- `POST /api/tools/interview-prep` - Requires 6 tokens
- `POST /api/tools/skills-assessment` - Requires 5 tokens
- `POST /api/tools/salary-negotiation` - Requires 5 tokens

## Frontend Components

### TokenContext
- Manages token state globally
- Provides `tokens`, `sessionId`, `refreshBalance()`
- Automatically fetches balance on mount

### TokenBalance
- Displays current token count
- "Buy More" button to open purchase modal

### TokenPurchaseModal
- Shows token packages
- Handles Stripe checkout redirect
- Verifies payment on return

## Testing

1. **Test Token System**
   ```bash
   # Start server
   npm run dev
   
   # Visit /tools page
   # Check that you have 10 trial tokens
   # Use a tool and verify tokens are deducted
   ```

2. **Test Payment Flow**
   - Use Paystack test mode
   - Test card: 4084 0840 8408 4081
   - Enter any email address
   - Complete purchase
   - Verify tokens are added after redirect

3. **Test Webhook**
   - Use Paystack Dashboard to send test webhook events
   - Or use Paystack's webhook testing tool
   - Check database for token additions

## Troubleshooting

### Tokens not being deducted
- Check that `checkTokens` middleware is applied to routes
- Verify session ID is being sent in headers
- Check server logs for errors

### Payment not adding tokens
- Verify webhook is configured correctly in Paystack dashboard
- Check that webhook endpoint is accessible (public URL)
- Verify payment reference is being passed correctly
- Check server logs for webhook errors
- Use `verify-payment` endpoint as fallback (called automatically on redirect)

### Session ID issues
- Clear localStorage and refresh
- Check that session ID is being generated
- Verify session ID is sent in API requests

## Security Considerations

1. **Rate Limiting**: Already applied to `/api/tools` routes
2. **Token Validation**: Server-side validation prevents token manipulation
3. **Webhook Security**: Paystack HMAC signature verification ensures authenticity
4. **Session Management**: Session IDs are stored client-side only
5. **Payment Verification**: Both webhook and redirect verification for reliability

## Future Enhancements

- User accounts for persistent tokens across devices
- Token referral system
- Admin interface to grant tokens
- Token expiration policies
- Usage analytics dashboard


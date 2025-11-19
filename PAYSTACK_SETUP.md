# Paystack Integration Setup

This guide will help you set up Paystack for token purchases in your application.

## Quick Start

1. **Add to `.env` file:**
```env
PAYSTACK_SECRET_KEY=sk_test_b57d1e13cafbdab18e18c036c6f7ef8c0609f303
```

2. **Test the integration:**
   - Visit `/tools` page
   - Click "Buy More" tokens
   - Use test card: `4084 0840 8408 4081`
   - Any future expiry date and any CVV
   - Any email address

## Production Setup

1. **Get Live Keys:**
   - Go to https://paystack.com
   - Complete business verification
   - Get live keys from Settings > API Keys & Webhooks
   - Update `.env` with live secret key

2. **Set up Webhook:**
   - Go to Settings > API Keys & Webhooks > Webhooks
   - Add webhook URL: `https://your-backend-domain.com/api/tokens/webhook`
     - **Important**: This must be your BACKEND server URL, not your frontend URL
     - Example: `https://your-app.up.railway.app/api/tokens/webhook` (if using Railway)
   - Select events: `charge.success` or `charge.successful`
   - Save webhook

3. **Callback URL (Optional):**
   - The callback URL is set dynamically in code
   - If you want to set a default in Paystack dashboard:
     - Test Callback URL: `https://geoffreymunene.netlify.app/tools`
     - This is where users are redirected after payment
   - **Note**: Our code already sets this automatically, so this is optional

## Token Packages (KES)

- **Small**: 50 tokens for KES 500
- **Medium**: 150 tokens for KES 1,300 (Most Popular)
- **Large**: 500 tokens for KES 4,000

You can adjust these prices in `server/controllers/tokenController.js`.

## How It Works

1. User clicks "Buy More" and selects a package
2. User enters email address
3. User is redirected to Paystack payment page
4. User completes payment
5. User is redirected back with payment reference
6. System verifies payment and adds tokens
7. Webhook also confirms payment (backup)

## Testing

### Test Cards (Paystack Test Mode)

- **Success**: `4084 0840 8408 4081`
- **Insufficient Funds**: `5060 6666 6666 6666 6666`
- **Declined**: `5060 6666 6666 6666 6667`

Use any future expiry date and any CVV.

### Test Email
Use any email address for testing.

## Troubleshooting

### Payment not working
- Check that `PAYSTACK_SECRET_KEY` is set in `.env`
- Verify you're using test keys for test mode
- Check server logs for errors

### Tokens not added after payment
- Check webhook is configured correctly
- Verify webhook endpoint is publicly accessible
- Check server logs for webhook errors
- Payment verification happens automatically on redirect

### Webhook not receiving events
- Ensure webhook URL is publicly accessible
- Check Paystack dashboard for webhook delivery status
- Verify webhook signature verification is working

## Support

For Paystack support, visit: https://paystack.com/help


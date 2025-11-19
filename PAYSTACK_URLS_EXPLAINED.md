# Paystack URLs Explained

## Difference Between Callback URL and Webhook URL

### 🔄 **Callback URL** (User Redirect)
- **Purpose**: Where Paystack redirects the **user's browser** after payment
- **Type**: Frontend URL (your website)
- **When**: Immediately after payment completion
- **Who**: The user's browser is redirected here
- **Example**: `https://geoffreymunene.netlify.app/tools`

**How it works:**
1. User completes payment on Paystack
2. Paystack redirects user's browser to this URL
3. Your frontend receives the payment reference
4. Frontend calls your API to verify payment
5. Tokens are added

**In your code:**
- Set dynamically in `server/controllers/tokenController.js`:
  ```javascript
  callback_url: `${req.headers.origin || process.env.FRONTEND_URL}/tools?payment=success&reference=${reference}`
  ```

### 🔔 **Webhook URL** (Server Notification)
- **Purpose**: Where Paystack sends **server-to-server** notifications
- **Type**: Backend API endpoint (your server)
- **When**: After payment is confirmed (can be delayed)
- **Who**: Paystack's servers call this directly
- **Example**: `https://your-backend.up.railway.app/api/tokens/webhook`

**How it works:**
1. Payment is confirmed on Paystack
2. Paystack's servers send HTTP POST to your webhook URL
3. Your backend receives the notification
4. Backend verifies the webhook signature
5. Tokens are added automatically

**In your code:**
- Handled by `server/controllers/tokenController.js` → `handleWebhook` function
- Route: `POST /api/tokens/webhook`

## Configuration Guide

### For Development (Local Testing)

**Callback URL:**
- Not needed in Paystack dashboard (set dynamically in code)
- Or set to: `http://localhost:5173/tools`

**Webhook URL:**
- For local testing, use a tunneling service like:
  - ngrok: `ngrok http 5000` → Use the ngrok URL
  - Example: `https://abc123.ngrok.io/api/tokens/webhook`
- Or test without webhook (payment verification on redirect will work)

### For Production

**Callback URL (Optional):**
- Set in Paystack dashboard: `https://geoffreymunene.netlify.app/tools`
- Or leave empty (code sets it automatically)

**Webhook URL (Required):**
- Set in Paystack dashboard: `https://your-backend-domain.com/api/tokens/webhook`
- **Must be publicly accessible** (not localhost)
- Examples:
  - Railway: `https://your-app.up.railway.app/api/tokens/webhook`
  - Heroku: `https://your-app.herokuapp.com/api/tokens/webhook`
  - Custom domain: `https://api.yourdomain.com/api/tokens/webhook`

## Why Both?

- **Callback URL**: Immediate user experience - user sees confirmation right away
- **Webhook URL**: Reliable backup - ensures tokens are added even if user closes browser

Both work together to ensure tokens are always added:
1. User completes payment → Redirected to callback URL → Tokens added
2. Paystack also sends webhook → Tokens added again (idempotent, won't duplicate)

## Testing

### Test Callback URL
1. Make a test payment
2. After payment, you should be redirected to: `/tools?payment=success&reference=...`
3. Check browser URL bar

### Test Webhook URL
1. Make a test payment
2. Check Paystack dashboard → Webhooks → Delivery status
3. Check your server logs for webhook receipt
4. Verify tokens were added

## Troubleshooting

### Callback URL not working
- Check that `FRONTEND_URL` is set in your `.env`
- Verify the URL in Paystack dashboard matches your frontend
- Check browser console for errors

### Webhook not receiving events
- Ensure webhook URL is publicly accessible (not localhost)
- Check Paystack dashboard for delivery status
- Verify webhook signature verification is working
- Check server logs for errors
- Make sure webhook URL is correct in Paystack dashboard

## Summary

| Feature | Callback URL | Webhook URL |
|---------|-------------|-------------|
| **Type** | Frontend (user sees) | Backend (server-to-server) |
| **When** | Immediately after payment | After payment confirmation |
| **Who** | User's browser | Paystack's servers |
| **Required** | Optional (set in code) | Recommended (backup) |
| **Example** | `https://yoursite.com/tools` | `https://api.yoursite.com/webhook` |


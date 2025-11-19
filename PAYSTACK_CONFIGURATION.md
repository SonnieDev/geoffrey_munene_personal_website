# Paystack Configuration Summary

## ✅ Your URLs

### Frontend (Callback URL)
- **URL**: `https://geoffreymunene.netlify.app/tools`
- **Purpose**: Where users are redirected after payment
- **Status**: ✅ Already configured in code (optional in Paystack dashboard)

### Backend (Webhook URL)
- **URL**: `https://geoffrey-munene-v1-production.up.railway.app/api/tokens/webhook`
- **Purpose**: Where Paystack sends payment notifications
- **Status**: ⚠️ **Must be configured in Paystack dashboard**

## 📋 Paystack Dashboard Configuration

### Step 1: Set Test Webhook URL

1. Go to Paystack Dashboard → Settings → API Keys & Webhooks
2. Scroll to **"Test Webhook URL"** section
3. Enter: `https://geoffrey-munene-v1-production.up.railway.app/api/tokens/webhook`
4. Click **"Save changes"**

### Step 2: Set Test Callback URL (Optional)

1. In the same section, find **"Test Callback URL"**
2. Enter: `https://geoffreymunene.netlify.app/tools`
3. Click **"Save changes"**
4. **Note**: This is optional since your code sets it dynamically

### Step 3: Select Webhook Events

Make sure these events are selected:
- ✅ `charge.success`
- ✅ `charge.successful`

## 🔧 Environment Variables

### Local Development (`server/.env`)
```env
PAYSTACK_SECRET_KEY=sk_test_b57d1e13cafbdab18e18c036c6f7ef8c0609f303
TRIAL_TOKENS=10
FRONTEND_URL=http://localhost:5173
```

### Production (Railway)
Make sure these are set in Railway Variables:
```env
PAYSTACK_SECRET_KEY=sk_test_b57d1e13cafbdab18e18c036c6f7ef8c0609f303
TRIAL_TOKENS=10
FRONTEND_URL=https://geoffreymunene.netlify.app
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 🧪 Testing

### 1. Test Webhook Endpoint
Visit in browser or use curl:
```bash
curl https://geoffrey-munene-v1-production.up.railway.app/api/tokens/webhook
```

Should return an error (expected - webhooks need POST requests), but confirms the endpoint is accessible.

### 2. Test Payment Flow
1. Visit: https://geoffreymunene.netlify.app/tools
2. Click "Buy More" tokens
3. Select a package and enter email
4. Use test card: `4084 0840 8408 4081`
5. Complete payment
6. Should redirect back to `/tools?payment=success&reference=...`
7. Tokens should be added automatically

### 3. Verify Webhook
1. After test payment, check Paystack Dashboard
2. Go to Settings → API Keys & Webhooks → Webhooks
3. Check "Delivery Status" - should show successful delivery
4. Check Railway logs for webhook receipt

## 🔍 Verification Checklist

- [ ] Webhook URL set in Paystack: `https://geoffrey-munene-v1-production.up.railway.app/api/tokens/webhook`
- [ ] Callback URL set in Paystack (optional): `https://geoffreymunene.netlify.app/tools`
- [ ] Webhook events selected: `charge.success` or `charge.successful`
- [ ] `PAYSTACK_SECRET_KEY` set in Railway environment variables
- [ ] `FRONTEND_URL` set in Railway: `https://geoffreymunene.netlify.app`
- [ ] Webhook endpoint is publicly accessible (test with curl)
- [ ] Test payment completes successfully
- [ ] Tokens are added after payment

## 🐛 Troubleshooting

### Webhook not receiving events
1. Verify webhook URL is correct in Paystack dashboard
2. Check Railway logs for incoming requests
3. Ensure webhook URL is publicly accessible (not localhost)
4. Verify `PAYSTACK_SECRET_KEY` matches in both places

### Payment redirects but tokens not added
1. Check browser console for errors
2. Check Railway logs for payment verification errors
3. Verify `FRONTEND_URL` is set correctly in Railway
4. Check that webhook is also configured (backup)

### CORS errors
1. Verify `FRONTEND_URL` is set in Railway
2. Check that `https://geoffreymunene.netlify.app` is in allowed origins
3. Restart Railway service after changing environment variables

## 📝 Quick Reference

| Setting | Value |
|---------|-------|
| **Frontend URL** | `https://geoffreymunene.netlify.app` |
| **Backend URL** | `https://geoffrey-munene-v1-production.up.railway.app` |
| **Webhook URL** | `https://geoffrey-munene-v1-production.up.railway.app/api/tokens/webhook` |
| **Callback URL** | `https://geoffreymunene.netlify.app/tools` |
| **Test Card** | `4084 0840 8408 4081` |

## 🚀 Next Steps

1. ✅ Configure webhook URL in Paystack dashboard
2. ✅ Test a payment to verify everything works
3. ✅ Check Railway logs to confirm webhook is receiving events
4. ✅ When ready for production, switch to live Paystack keys


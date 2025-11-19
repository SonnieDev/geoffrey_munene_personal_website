# Paystack Integration - Quick Test Guide

## ✅ Setup Verification

Make sure you have these in your `server/.env` file:

```env
PAYSTACK_SECRET_KEY=sk_test_b57d1e13cafbdab18e18c036c6f7ef8c0609f303
TRIAL_TOKENS=10
```

## 🧪 Quick Test Steps

### 1. Start Your Server
```bash
cd server
npm run dev
```

### 2. Test Token Balance Endpoint
Visit or use curl:
```bash
curl http://localhost:5000/api/tokens/balance?sessionId=test123
```

Should return:
```json
{
  "success": true,
  "data": {
    "tokens": 10,
    "trialTokensGiven": true,
    ...
  }
}
```

### 3. Test Payment Initialization
```bash
curl -X POST http://localhost:5000/api/tokens/initialize-payment \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test123",
    "tokenPackage": "small",
    "email": "test@example.com"
  }'
```

Should return:
```json
{
  "success": true,
  "data": {
    "authorizationUrl": "https://checkout.paystack.com/...",
    "reference": "TOKENS_...",
    ...
  }
}
```

### 4. Test in Browser

1. **Start your frontend:**
   ```bash
   cd client
   npm run dev
   ```

2. **Visit:** http://localhost:5173/tools

3. **Check token balance** - Should show 10 tokens

4. **Click "Buy More"** button

5. **Select a package** and enter email

6. **Click Purchase** - Should redirect to Paystack

7. **Use test card:**
   - Card: `4084 0840 8408 4081`
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)
   - Email: Any email

8. **Complete payment** - Should redirect back and add tokens

## 🐛 Troubleshooting

### "Payment processing is not available"
- Check `PAYSTACK_SECRET_KEY` is in `.env`
- Restart server after adding env variable
- Check server logs for errors

### "Failed to initialize payment"
- Verify Paystack secret key is correct
- Check network connection
- Check server logs for Paystack API errors

### Tokens not added after payment
- Check webhook is configured (for production)
- Payment verification happens on redirect (should work)
- Check server logs for verification errors

## 📝 Next Steps

1. **For Production:**
   - Get live Paystack keys
   - Set up webhook: `https://yourdomain.com/api/tokens/webhook`
   - Update `PAYSTACK_SECRET_KEY` with live key

2. **Adjust Prices:**
   - Edit `server/controllers/tokenController.js`
   - Update package prices in KES

3. **Customize:**
   - Change trial tokens: `TRIAL_TOKENS=20` in `.env`
   - Adjust token costs per tool in `server/middleware/tokenMiddleware.js`


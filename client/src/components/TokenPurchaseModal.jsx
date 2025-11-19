import { useState, useEffect } from 'react'
import { useTokens } from '../contexts/TokenContext'
import { useUser } from '../contexts/UserContext'
import { tokensAPI } from '../services/api'
import { HiXMark } from 'react-icons/hi2'
import toast from 'react-hot-toast'

// Token packages in KES (Kenyan Shillings)
const TOKEN_PACKAGES = {
  small: { tokens: 50, price: 500, popular: false },
  medium: { tokens: 150, price: 1300, popular: true },
  large: { tokens: 500, price: 4000, popular: false },
}

function TokenPurchaseModal({ onClose }) {
  const { user } = useUser()
  const { refreshBalance } = useTokens()
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('medium')

  const handlePaymentSuccess = async (reference) => {
    try {
      setLoading(true)
      const response = await tokensAPI.verifyPayment(reference)
      if (response.success) {
        toast.success(`Successfully purchased tokens!`)
        await refreshBalance()
        onClose()
      } else {
        toast.error('Payment verification failed. Please contact support if tokens were not added.')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support if tokens were not added.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check for payment success in URL (Paystack redirects back with reference)
    const params = new URLSearchParams(window.location.search)
    const paymentStatus = params.get('payment')
    const reference = params.get('reference')

    if (paymentStatus === 'success' && reference) {
      handlePaymentSuccess(reference)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled')
      window.history.replaceState({}, '', window.location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePurchase = async (packageKey) => {
    if (!user || !user.email) {
      toast.error('Please login to purchase tokens')
      return
    }

    try {
      setLoading(true)
      const response = await tokensAPI.initializePayment(packageKey)
      
      if (response.success && response.data.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorizationUrl
      } else {
        toast.error('Failed to initialize payment')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error initializing payment:', error)
      toast.error(error.response?.data?.message || 'Failed to start payment process')
      setLoading(false)
    }
  }

  return (
    <div className="token-purchase-modal-overlay" onClick={onClose}>
      <div className="token-purchase-modal" onClick={(e) => e.stopPropagation()}>
        <button className="token-purchase-modal-close" onClick={onClose}>
          <HiXMark />
        </button>
        
        <h2 className="token-purchase-modal-title">Purchase Tokens</h2>
        <p className="token-purchase-modal-description">
          Choose a token package to continue using our AI-powered tools
        </p>

        <div className="token-packages">
          {Object.entries(TOKEN_PACKAGES).map(([key, pkg]) => (
            <div
              key={key}
              className={`token-package ${selectedPackage === key ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
              onClick={() => setSelectedPackage(key)}
            >
              {pkg.popular && <div className="token-package-badge">Most Popular</div>}
              <div className="token-package-tokens">{pkg.tokens} Tokens</div>
              <div className="token-package-price">KES {pkg.price.toLocaleString()}</div>
              <div className="token-package-per-token">
                KES {(pkg.price / pkg.tokens).toFixed(0)} per token
              </div>
            </div>
          ))}
        </div>

        {user && user.email && (
          <div className="token-purchase-email-field">
            <label className="token-purchase-email-label">
              Payment Email
            </label>
            <div className="token-purchase-email-display">
              {user.email}
            </div>
          </div>
        )}

        <button
          className="token-purchase-button"
          onClick={() => handlePurchase(selectedPackage)}
          disabled={loading || !user}
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              <span className="hidden sm:inline">
                Purchase {TOKEN_PACKAGES[selectedPackage].tokens} Tokens - KES {TOKEN_PACKAGES[selectedPackage].price.toLocaleString()}
              </span>
              <span className="sm:hidden">
                Buy {TOKEN_PACKAGES[selectedPackage].tokens} Tokens
              </span>
            </>
          )}
        </button>

        <p className="token-purchase-note">
          Secure payment powered by Paystack. Tokens are added instantly after payment.
        </p>
      </div>
    </div>
  )
}

export default TokenPurchaseModal


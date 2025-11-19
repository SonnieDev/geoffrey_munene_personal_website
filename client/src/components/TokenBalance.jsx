import { useTokens } from '../contexts/TokenContext'
import { HiCurrencyDollar } from 'react-icons/hi2'
import { useState } from 'react'
import TokenPurchaseModal from './TokenPurchaseModal'

function TokenBalance() {
  const { tokens, loading } = useTokens()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  if (loading) {
    return (
      <div className="token-balance">
        <div className="token-balance-loading">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="token-balance">
        <div className="token-balance-content">
          <HiCurrencyDollar className="token-icon" />
          <div className="token-info">
            <span className="token-label">Tokens</span>
            <span className="token-count">{tokens}</span>
          </div>
          <button 
            onClick={() => setShowPurchaseModal(true)}
            className="token-purchase-btn"
          >
            Buy More
          </button>
        </div>
      </div>
      {showPurchaseModal && (
        <TokenPurchaseModal onClose={() => setShowPurchaseModal(false)} />
      )}
    </>
  )
}

export default TokenBalance


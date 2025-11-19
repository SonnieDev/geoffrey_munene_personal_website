import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useTokens } from '../../contexts/TokenContext'
import { tokensAPI } from '../../services/api'
import UserProtectedRoute from '../../components/UserProtectedRoute'
import TokenPurchaseModal from '../../components/TokenPurchaseModal'
import SEO from '../../components/SEO'
import toast from 'react-hot-toast'
import {
  HiCreditCard,
  HiSparkles,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiPlus,
  HiArrowRight,
} from 'react-icons/hi2'
import '../../styles/pages/user-billing.css'

function Billing() {
  const { user } = useUser()
  const { tokens, refreshBalance } = useTokens()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'transactions', 'subscription'

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await tokensAPI.getTransactions(100)
      if (response.success) {
        // Ensure we always set an array
        const transactionsData = response.data
        setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
      } else {
        setTransactions([])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transaction history')
      setTransactions([]) // Ensure it's always an array even on error
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <HiCreditCard className="transaction-icon purchase" />
      case 'trial':
        return <HiSparkles className="transaction-icon trial" />
      case 'usage':
        return <HiClock className="transaction-icon usage" />
      default:
        return <HiClock className="transaction-icon" />
    }
  }

  const getTransactionStatus = (transaction) => {
    if (transaction.status === 'completed' || transaction.status === 'success') {
      return <HiCheckCircle className="status-icon success" />
    }
    if (transaction.status === 'failed' || transaction.status === 'error') {
      return <HiXCircle className="status-icon failed" />
    }
    return <HiClock className="status-icon pending" />
  }

  return (
    <UserProtectedRoute>
      <SEO
        title="Billing & Tokens"
        description="Manage your token balance, purchase history, and subscription"
        url="/user/billing"
      />
      <div className="user-billing-page">
        <div className="billing-container">
          {/* Header */}
          <div className="billing-header">
            <div>
              <h1>Billing & Tokens</h1>
              <p>Manage your token balance, purchases, and subscriptions</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowPurchaseModal(true)}
            >
              <HiPlus /> Buy Tokens
            </button>
          </div>

          {/* Tabs */}
          <div className="billing-tabs">
            <button
              className={`billing-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`billing-tab ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transaction History
            </button>
            <button
              className={`billing-tab ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscription')}
            >
              Subscription
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="billing-content">
              {/* Token Balance Card */}
              <div className="billing-card tokens-card">
                <div className="card-header">
                  <h2>Token Balance</h2>
                  <HiSparkles className="card-icon" />
                </div>
                <div className="tokens-display">
                  <div className="tokens-amount-large">{tokens}</div>
                  <div className="tokens-label">Available Tokens</div>
                </div>
                <div className="tokens-stats-grid">
                  <div className="token-stat">
                    <div className="token-stat-label">Total Purchased</div>
                    <div className="token-stat-value">{user?.totalTokensPurchased || 0}</div>
                  </div>
                  <div className="token-stat">
                    <div className="token-stat-label">Total Used</div>
                    <div className="token-stat-value">{user?.totalTokensUsed || 0}</div>
                  </div>
                  <div className="token-stat">
                    <div className="token-stat-label">Remaining</div>
                    <div className="token-stat-value highlight">{tokens}</div>
                  </div>
                </div>
                <button
                  className="btn-primary full-width"
                  onClick={() => setShowPurchaseModal(true)}
                >
                  <HiPlus /> Purchase More Tokens
                </button>
              </div>

              {/* Quick Stats */}
              <div className="billing-stats-grid">
                <div className="billing-stat-card">
                  <div className="stat-icon">
                    <HiCreditCard />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {transactions.filter((t) => t.type === 'purchase').length}
                    </div>
                    <div className="stat-label">Total Purchases</div>
                  </div>
                </div>
                <div className="billing-stat-card">
                  <div className="stat-icon">
                    <HiClock />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {transactions.filter((t) => t.type === 'usage').length}
                    </div>
                    <div className="stat-label">Transactions</div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions Preview */}
              <div className="billing-card">
                <div className="card-header">
                  <h2>Recent Transactions</h2>
                  <button
                    className="link-button"
                    onClick={() => setActiveTab('transactions')}
                  >
                    View All <HiArrowRight />
                  </button>
                </div>
                {loading ? (
                  <div className="loading-state">Loading...</div>
                ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                  <div className="empty-state">
                    <p>No transactions yet</p>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowPurchaseModal(true)}
                    >
                      Make Your First Purchase
                    </button>
                  </div>
                ) : (
                  <div className="transactions-preview">
                    {(Array.isArray(transactions) ? transactions : []).slice(0, 5).map((transaction) => (
                      <div key={transaction._id} className="transaction-preview-item">
                        <div className="transaction-preview-icon">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="transaction-preview-info">
                          <div className="transaction-preview-type">
                            {transaction.type === 'purchase'
                              ? 'Token Purchase'
                              : transaction.type === 'trial'
                              ? 'Trial Tokens'
                              : transaction.description || 'Token Usage'}
                          </div>
                          <div className="transaction-preview-date">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                        <div
                          className={`transaction-preview-amount ${
                            transaction.amount >= 0 ? 'positive' : 'negative'
                          }`}
                        >
                          {transaction.amount >= 0 ? '+' : ''}
                          {transaction.amount} tokens
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="billing-content">
              <div className="billing-card">
                <div className="card-header">
                  <h2>Transaction History</h2>
                </div>
                {loading ? (
                  <div className="loading-state">Loading transactions...</div>
                ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                  <div className="empty-state">
                    <p>No transactions found</p>
                    <button
                      className="btn-secondary"
                      onClick={() => setShowPurchaseModal(true)}
                    >
                      Make Your First Purchase
                    </button>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {(Array.isArray(transactions) ? transactions : []).map((transaction) => (
                      <div key={transaction._id} className="transaction-item">
                        <div className="transaction-icon-wrapper">
                          {getTransactionIcon(transaction.type)}
                          {getTransactionStatus(transaction)}
                        </div>
                        <div className="transaction-details">
                          <div className="transaction-type">
                            {transaction.type === 'purchase'
                              ? 'Token Purchase'
                              : transaction.type === 'trial'
                              ? 'Trial Tokens'
                              : transaction.description || 'Token Usage'}
                          </div>
                          <div className="transaction-description">
                            {transaction.description || 'No description'}
                          </div>
                          <div className="transaction-date">
                            {formatDate(transaction.createdAt)}
                          </div>
                          {transaction.toolUsed && (
                            <div className="transaction-tool">
                              Tool: {transaction.toolUsed}
                            </div>
                          )}
                        </div>
                        <div className="transaction-amounts">
                          <div
                            className={`transaction-amount ${
                              transaction.amount >= 0 ? 'positive' : 'negative'
                            }`}
                          >
                            {transaction.amount >= 0 ? '+' : ''}
                            {transaction.amount} tokens
                          </div>
                          {transaction.balanceAfter !== undefined && (
                            <div className="transaction-balance">
                              Balance: {transaction.balanceAfter} tokens
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="billing-content">
              <div className="billing-card">
                <div className="card-header">
                  <h2>Subscription & Plans</h2>
                </div>
                <div className="subscription-content">
                  {user?.subscriptions?.subscriptionTier ? (
                    <div className="subscription-active">
                      <div className="subscription-info">
                        <h3>Current Plan</h3>
                        <div className="subscription-tier">
                          {user.subscriptions.subscriptionTier.toUpperCase()}
                        </div>
                        <div className="subscription-status">
                          Status:{' '}
                          <span
                            className={`status-badge ${
                              user.subscriptions.subscriptionStatus === 'active'
                                ? 'active'
                                : 'inactive'
                            }`}
                          >
                            {user.subscriptions.subscriptionStatus || 'Inactive'}
                          </span>
                        </div>
                        {user.subscriptions.subscriptionExpiresAt && (
                          <div className="subscription-expiry">
                            Expires:{' '}
                            {new Date(
                              user.subscriptions.subscriptionExpiresAt
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                      <button className="btn-secondary">Manage Subscription</button>
                    </div>
                  ) : (
                    <div className="subscription-empty">
                      <h3>No Active Subscription</h3>
                      <p>You're currently on the free plan. Upgrade to unlock premium features!</p>
                      <div className="subscription-plans">
                        <div className="plan-card">
                          <h4>Basic Plan</h4>
                          <div className="plan-price">$9.99/month</div>
                          <ul className="plan-features">
                            <li>100 tokens/month</li>
                            <li>Access to all tools</li>
                            <li>Email support</li>
                          </ul>
                          <button className="btn-secondary">Coming Soon</button>
                        </div>
                        <div className="plan-card featured">
                          <h4>Premium Plan</h4>
                          <div className="plan-price">$19.99/month</div>
                          <ul className="plan-features">
                            <li>500 tokens/month</li>
                            <li>Access to all tools</li>
                            <li>Priority support</li>
                            <li>Advanced features</li>
                          </ul>
                          <button className="btn-primary">Coming Soon</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Token Purchase Modal */}
        {showPurchaseModal && (
          <TokenPurchaseModal
            onClose={() => {
              setShowPurchaseModal(false)
              refreshBalance()
              fetchTransactions()
            }}
          />
        )}
      </div>
    </UserProtectedRoute>
  )
}

export default Billing


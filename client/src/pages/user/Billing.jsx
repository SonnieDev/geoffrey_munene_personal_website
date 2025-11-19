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

function Billing() {
  const { user } = useUser()
  const { tokens, refreshBalance } = useTokens()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await tokensAPI.getTransactions(100)
      if (response.success) {
        const transactionsData = response.data
        setTransactions(Array.isArray(transactionsData) ? transactionsData : [])
      } else {
        setTransactions([])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transaction history')
      setTransactions([])
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

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <HiCreditCard className="w-6 h-6 text-neon-blue" />
      case 'trial':
        return <HiSparkles className="w-6 h-6 text-neon-purple" />
      case 'usage':
        return <HiClock className="w-6 h-6 text-neon-pink" />
      default:
        return <HiClock className="w-6 h-6 text-gray-400" />
    }
  }

  const getTransactionStatus = (transaction) => {
    if (transaction.status === 'completed' || transaction.status === 'success') {
      return <HiCheckCircle className="w-5 h-5 text-green-500" />
    }
    if (transaction.status === 'failed' || transaction.status === 'error') {
      return <HiXCircle className="w-5 h-5 text-red-500" />
    }
    return <HiClock className="w-5 h-5 text-yellow-500" />
  }

  return (
    <UserProtectedRoute>
      <SEO
        title="Billing & Tokens"
        description="Manage your token balance, purchase history, and subscription"
        url="/user/billing"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-space-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in">
            <div>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">Billing & Tokens</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your token balance, purchases, and subscriptions</p>
            </div>
            <button
              onClick={() => setShowPurchaseModal(true)}
              className="bg-gray-900 dark:bg-white text-white dark:text-space-900 font-bold py-3 px-6 rounded-xl hover:bg-neon-blue dark:hover:bg-neon-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-neon-blue/20 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <HiPlus className="w-5 h-5" /> Buy Tokens
            </button>
          </div>

          {/* Tabs */}
          <div className="glass-panel p-2 rounded-xl mb-8 overflow-x-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex space-x-2 min-w-max">
              {['overview', 'transactions', 'subscription'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${activeTab === tab
                      ? 'bg-white dark:bg-white/10 shadow-sm text-neon-blue dark:text-white ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Token Balance Card */}
              <div className="glass-panel p-8 rounded-2xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Token Balance</h2>
                  <HiSparkles className="w-8 h-8 text-neon-blue" />
                </div>
                <div className="text-center mb-6">
                  <div className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-2">{tokens}</div>
                  <div className="text-gray-600 dark:text-gray-400">Available Tokens</div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Purchased', value: user?.totalTokensPurchased || 0 },
                    { label: 'Total Used', value: user?.totalTokensUsed || 0 },
                    { label: 'Remaining', value: tokens, highlight: true },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-lg bg-white/50 dark:bg-white/5">
                      <div className={`text-2xl font-bold ${stat.highlight ? 'text-neon-blue' : 'text-gray-900 dark:text-white'}`}>{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <HiPlus className="w-5 h-5" /> Purchase More Tokens
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: HiCreditCard, value: transactions.filter((t) => t.type === 'purchase').length, label: 'Total Purchases', color: 'blue' },
                  { icon: HiClock, value: transactions.filter((t) => t.type === 'usage').length, label: 'Transactions', color: 'purple' },
                ].map((stat) => (
                  <div key={stat.label} className="glass-panel p-6 rounded-xl flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                      <stat.icon className={`w-6 h-6 text-neon-${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Transactions Preview */}
              <div className="glass-panel p-8 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                  <button onClick={() => setActiveTab('transactions')} className="text-neon-blue hover:text-neon-blue/80 flex items-center gap-1 text-sm font-medium">
                    View All <HiArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
                ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions yet</p>
                    <button onClick={() => setShowPurchaseModal(true)} className="glass-button px-6 py-3 rounded-xl">
                      Make Your First Purchase
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction._id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div>{getTransactionIcon(transaction.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {transaction.type === 'purchase' ? 'Token Purchase' : transaction.type === 'trial' ? 'Trial Tokens' : transaction.description || 'Token Usage'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(transaction.createdAt)}</div>
                        </div>
                        <div className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount} tokens
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
            <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transaction History</h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading transactions...</div>
              ) : !Array.isArray(transactions) || transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions found</p>
                  <button onClick={() => setShowPurchaseModal(true)} className="glass-button px-6 py-3 rounded-xl">
                    Make Your First Purchase
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        {getTransactionStatus(transaction)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {transaction.type === 'purchase' ? 'Token Purchase' : transaction.type === 'trial' ? 'Trial Tokens' : transaction.description || 'Token Usage'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{transaction.description || 'No description'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(transaction.createdAt)}</div>
                        {transaction.toolUsed && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tool: {transaction.toolUsed}</div>}
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount} tokens
                        </div>
                        {transaction.balanceAfter !== undefined && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">Balance: {transaction.balanceAfter} tokens</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="glass-panel p-8 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Subscription & Plans</h2>
              {user?.subscriptions?.subscriptionTier ? (
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800/30">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Current Plan</h3>
                  <div className="text-3xl font-display font-bold text-neon-green mb-2">{user.subscriptions.subscriptionTier.toUpperCase()}</div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-700 dark:text-gray-300">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.subscriptions.subscriptionStatus === 'active'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                      {user.subscriptions.subscriptionStatus || 'Inactive'}
                    </span>
                  </div>
                  {user.subscriptions.subscriptionExpiresAt && (
                    <div className="text-gray-700 dark:text-gray-300 mb-4">
                      Expires: {new Date(user.subscriptions.subscriptionExpiresAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  )}
                  <button className="glass-button px-6 py-3 rounded-xl">Manage Subscription</button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">You're currently on the free plan. Upgrade to unlock premium features!</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: 'Basic Plan', price: '$9.99/month', features: ['100 tokens/month', 'Access to all tools', 'Email support'] },
                      { name: 'Premium Plan', price: '$19.99/month', features: ['500 tokens/month', 'Access to all tools', 'Priority support', 'Advanced features'], featured: true },
                    ].map((plan) => (
                      <div key={plan.name} className={`glass-panel p-6 rounded-xl ${plan.featured ? 'ring-2 ring-neon-purple' : ''}`}>
                        {plan.featured && <div className="text-neon-purple text-sm font-bold mb-2">POPULAR</div>}
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h4>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{plan.price}</div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <HiCheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button className={plan.featured ? 'bg-neon-purple text-white font-bold py-3 px-6 rounded-xl w-full hover:bg-neon-purple/80 transition-colors' : 'glass-button px-6 py-3 rounded-xl w-full'}>
                          Coming Soon
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

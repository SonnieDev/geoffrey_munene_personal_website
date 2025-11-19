import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { tokensAPI } from '../services/api'
import { useUser } from './UserContext'

const TokenContext = createContext()

export const TokenProvider = ({ children }) => {
  const { isAuthenticated } = useUser()
  const [tokens, setTokens] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBalance = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) {
      setTokens(0)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await tokensAPI.getBalance()
      if (response.success) {
        setTokens(response.data.tokens)
      }
    } catch (err) {
      console.error('Error fetching token balance:', err)
      setError(err.response?.data?.message || 'Failed to fetch token balance')
      // If unauthorized, tokens are 0
      if (err.response?.status === 401) {
        setTokens(0)
      }
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const refreshBalance = useCallback(() => {
    return fetchBalance()
  }, [fetchBalance])

  const value = {
    tokens,
    loading,
    error,
    refreshBalance,
  }

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}

export const useTokens = () => {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider')
  }
  return context
}


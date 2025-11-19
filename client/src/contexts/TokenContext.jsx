import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { tokensAPI } from '../services/api'

const TokenContext = createContext()

// Generate or retrieve session ID from localStorage
const getSessionId = () => {
  let sessionId = localStorage.getItem('userSessionId')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userSessionId', sessionId)
  }
  return sessionId
}

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sessionId = getSessionId()

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await tokensAPI.getBalance(sessionId)
      if (response.success) {
        setTokens(response.data.tokens)
      }
    } catch (err) {
      console.error('Error fetching token balance:', err)
      setError(err.response?.data?.message || 'Failed to fetch token balance')
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const refreshBalance = useCallback(() => {
    return fetchBalance()
  }, [fetchBalance])

  const value = {
    tokens,
    sessionId,
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


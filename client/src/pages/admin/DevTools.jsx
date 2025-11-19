import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { adminAPI } from '../../services/api'
import { logError } from '../../utils/errorTracking'
import AdminHeader from '../../components/AdminHeader'
import { HiServer, HiCircleStack, HiExclamationTriangle, HiDocumentText, HiArrowPath, HiTrash } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import '../../styles/pages/dev-tools.css'

function DevTools() {
  const { isAuthenticated, admin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('health')
  const [loading, setLoading] = useState(false)
  
  // Health data
  const [health, setHealth] = useState(null)
  const [stats, setStats] = useState(null)
  const [errorLogs, setErrorLogs] = useState([])
  const [requestLogs, setRequestLogs] = useState([])
  
  // Filters
  const [logLimit, setLogLimit] = useState(50)
  const [requestLimit, setRequestLimit] = useState(100)
  const [requestMethod, setRequestMethod] = useState('')
  const [requestStatus, setRequestStatus] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    
    // Only dev admins can access dev tools
    if (admin?.role !== 'dev') {
      toast.error('Access denied. Dev tools are only available to dev admins.')
      navigate('/admin/dashboard')
      return
    }
    
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, admin, activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'health') {
        const healthRes = await adminAPI.getSystemHealth()
        if (healthRes.success) setHealth(healthRes.data)
      } else if (activeTab === 'stats') {
        const statsRes = await adminAPI.getDatabaseStats()
        if (statsRes.success) setStats(statsRes.data)
      } else if (activeTab === 'errors') {
        const errorsRes = await adminAPI.getErrorLogs(logLimit)
        if (errorsRes.success) setErrorLogs(errorsRes.data.logs || [])
      } else if (activeTab === 'requests') {
        const requestsRes = await adminAPI.getApiRequestLogs(requestLimit, {
          method: requestMethod || undefined,
          statusCode: requestStatus || undefined,
        })
        if (requestsRes.success) setRequestLogs(requestsRes.data.logs || [])
      }
    } catch (error) {
      toast.error('Failed to load data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearLogs = async (type) => {
    if (!window.confirm(`Are you sure you want to clear ${type} logs?`)) return
    
    try {
      await adminAPI.clearLogs(type)
      toast.success(`Cleared ${type} logs`)
      loadData()
    } catch (error) {
      toast.error('Failed to clear logs')
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  const getStatusColor = (status) => {
    if (status >= 500) return '#ef4444'
    if (status >= 400) return '#f59e0b'
    if (status >= 300) return '#3b82f6'
    return '#10b981'
  }

  return (
    <div className="dev-tools">
      <AdminHeader
        title="Developer Tools"
        showBackButton={true}
      />

      <div className="dev-tools-tabs">
        <button
          className={activeTab === 'health' ? 'active' : ''}
          onClick={() => setActiveTab('health')}
        >
          <HiServer /> System Health
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          <HiCircleStack /> Database Stats
        </button>
        <button
          className={activeTab === 'errors' ? 'active' : ''}
          onClick={() => setActiveTab('errors')}
        >
          <HiExclamationTriangle /> Error Logs
        </button>
        <button
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          <HiDocumentText /> API Requests
        </button>
      </div>

      <div className="dev-tools-content">
        {loading ? (
          <div className="dev-tools-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'health' && health && (
              <div className="dev-tools-section">
                <div className="dev-tools-header">
                  <h2>System Health</h2>
                  <button onClick={loadData} className="dev-tools-refresh">
                    <HiArrowPath /> Refresh
                  </button>
                </div>
                <div className="health-grid">
                  <div className="health-card">
                    <h3>Server</h3>
                    <div className="health-item">
                      <span>Status:</span>
                      <span className="status-badge success">{health.server.status}</span>
                    </div>
                    <div className="health-item">
                      <span>Uptime:</span>
                      <span>{health.server.uptime}</span>
                    </div>
                    <div className="health-item">
                      <span>Node Version:</span>
                      <span>{health.server.nodeVersion}</span>
                    </div>
                    <div className="health-item">
                      <span>Platform:</span>
                      <span>{health.server.platform}</span>
                    </div>
                  </div>

                  <div className="health-card">
                    <h3>Database</h3>
                    <div className="health-item">
                      <span>Status:</span>
                      <span className={`status-badge ${health.database.connected ? 'success' : 'error'}`}>
                        {health.database.status}
                      </span>
                    </div>
                    <div className="health-item">
                      <span>Database:</span>
                      <span>{health.database.name || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="health-card">
                    <h3>Memory</h3>
                    <div className="health-item">
                      <span>RSS:</span>
                      <span>{health.memory.rss}</span>
                    </div>
                    <div className="health-item">
                      <span>Heap Total:</span>
                      <span>{health.memory.heapTotal}</span>
                    </div>
                    <div className="health-item">
                      <span>Heap Used:</span>
                      <span>{health.memory.heapUsed}</span>
                    </div>
                    <div className="health-item">
                      <span>External:</span>
                      <span>{health.memory.external}</span>
                    </div>
                  </div>

                  <div className="health-card">
                    <h3>Environment</h3>
                    <div className="health-item">
                      <span>Node Env:</span>
                      <span>{health.environment.nodeEnv}</span>
                    </div>
                    <div className="health-item">
                      <span>Port:</span>
                      <span>{health.environment.port}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && stats && (
              <div className="dev-tools-section">
                <div className="dev-tools-header">
                  <h2>Database Statistics</h2>
                  <button onClick={loadData} className="dev-tools-refresh">
                    <HiArrowPath /> Refresh
                  </button>
                </div>
                <div className="stats-grid">
                  {Object.entries(stats.collections).map(([key, value]) => (
                    <div key={key} className="stat-card">
                      <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                      <div className="stat-value">{value.total}</div>
                      <div className="stat-label">Total Records</div>
                      {value.recent > 0 && (
                        <div className="stat-recent">+{value.recent} in last 24h</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="database-info">
                  <p><strong>Database:</strong> {stats.database.name}</p>
                  <p><strong>Collections:</strong> {stats.database.collections}</p>
                </div>
              </div>
            )}

            {activeTab === 'errors' && (
              <div className="dev-tools-section">
                <div className="dev-tools-header">
                  <h2>Error Logs</h2>
                  <div className="dev-tools-actions">
                    <input
                      type="number"
                      value={logLimit}
                      onChange={(e) => setLogLimit(parseInt(e.target.value) || 50)}
                      min="10"
                      max="500"
                      className="log-limit-input"
                    />
                    <button 
                      onClick={() => {
                        // Test error logging
                        const testError = new Error('Test error from dev tools')
                        testError.stack = 'Test stack trace\n  at DevTools.testError (DevTools.jsx:1:1)'
                        logError(testError, { type: 'test', source: 'dev_tools' })
                        toast.success('Test error logged! Refresh to see it.')
                        setTimeout(() => loadData(), 500)
                      }} 
                      className="dev-tools-test"
                      style={{ backgroundColor: '#6366f1', marginRight: '8px' }}
                    >
                      Test Error
                    </button>
                    <button onClick={loadData} className="dev-tools-refresh">
                      <HiArrowPath /> Refresh
                    </button>
                    <button
                      onClick={() => handleClearLogs('errors')}
                      className="dev-tools-clear"
                    >
                      <HiTrash /> Clear
                    </button>
                  </div>
                </div>
                {errorLogs.length === 0 ? (
                  <div className="dev-tools-empty">No errors logged</div>
                ) : (
                  <div className="logs-container">
                    {errorLogs.map((log) => (
                      <div key={log.id} className="log-entry error-log">
                        <div className="log-header">
                          <span className="log-time">{formatDate(log.timestamp)}</span>
                          <span className="log-type">{log.type}</span>
                        </div>
                        <div className="log-message">{log.message}</div>
                        {log.context && Object.keys(log.context).length > 0 && (
                          <details className="log-context">
                            <summary>Context</summary>
                            <pre>{JSON.stringify(log.context, null, 2)}</pre>
                          </details>
                        )}
                        {log.stack && (
                          <details className="log-stack">
                            <summary>Stack Trace</summary>
                            <pre>{log.stack}</pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="dev-tools-section">
                <div className="dev-tools-header">
                  <h2>API Request Logs</h2>
                  <div className="dev-tools-actions">
                    <select
                      value={requestMethod}
                      onChange={(e) => setRequestMethod(e.target.value)}
                      className="log-filter"
                    >
                      <option value="">All Methods</option>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    <select
                      value={requestStatus}
                      onChange={(e) => setRequestStatus(e.target.value)}
                      className="log-filter"
                    >
                      <option value="">All Status</option>
                      <option value="200">200 OK</option>
                      <option value="400">400 Bad Request</option>
                      <option value="401">401 Unauthorized</option>
                      <option value="403">403 Forbidden</option>
                      <option value="404">404 Not Found</option>
                      <option value="500">500 Server Error</option>
                    </select>
                    <input
                      type="number"
                      value={requestLimit}
                      onChange={(e) => setRequestLimit(parseInt(e.target.value) || 100)}
                      min="10"
                      max="500"
                      className="log-limit-input"
                    />
                    <button 
                      onClick={async () => {
                        // Trigger some API requests to generate logs
                        try {
                          await Promise.all([
                            adminAPI.getSystemHealth(),
                            adminAPI.getDatabaseStats(),
                            adminAPI.getErrorLogs(10),
                          ])
                          toast.success('Generated test API requests! Refresh to see them.')
                          setTimeout(() => loadData(), 500)
                        } catch (error) {
                          toast.error('Failed to generate test requests')
                        }
                      }} 
                      className="dev-tools-test"
                      style={{ backgroundColor: '#6366f1', marginRight: '8px' }}
                    >
                      Test Requests
                    </button>
                    <button onClick={loadData} className="dev-tools-refresh">
                      <HiArrowPath /> Refresh
                    </button>
                    <button
                      onClick={() => handleClearLogs('requests')}
                      className="dev-tools-clear"
                    >
                      <HiTrash /> Clear
                    </button>
                  </div>
                </div>
                {requestLogs.length === 0 ? (
                  <div className="dev-tools-empty">No requests logged</div>
                ) : (
                  <div className="logs-container">
                    <table className="request-logs-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Method</th>
                          <th>Path</th>
                          <th>Status</th>
                          <th>Response Time</th>
                          <th>IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestLogs.map((log) => (
                          <tr key={log.id}>
                            <td>{formatDate(log.timestamp)}</td>
                            <td><span className="method-badge">{log.method}</span></td>
                            <td className="path-cell">{log.path}</td>
                            <td>
                              <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(log.statusCode) }}
                              >
                                {log.statusCode}
                              </span>
                            </td>
                            <td>{log.responseTime}</td>
                            <td>{log.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default DevTools


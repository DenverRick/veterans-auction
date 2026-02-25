import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import { getAuctionSettings } from '../lib/db'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const settings = await getAuctionSettings()
      if (!settings?.adminPasswordHash) {
        // First-time setup: no password set yet. Hash and store this one.
        const hash = await sha256(password)
        const { saveAuctionSettings } = await import('../lib/db')
        await saveAuctionSettings({
          adminPasswordHash: hash,
          title: 'Hilltop Veterans Club Silent Auction',
          date: '2026-03-29',
          status: settings?.status || 'preview',
        })
        sessionStorage.setItem('auction_admin_auth', 'true')
        navigate('/admin')
        return
      }
      const success = await login(password, settings.adminPasswordHash)
      if (success) {
        navigate('/admin')
      } else {
        setError('Incorrect password')
      }
    } catch (err) {
      setError('Connection error. Check your Firebase config.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-navy mb-1 text-center">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Enter the volunteer password</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none mb-4"
          autoFocus
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-navy text-gold font-bold py-3 rounded-lg hover:bg-navy-light disabled:opacity-50 transition-colors"
        >
          {loading ? 'Checking...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

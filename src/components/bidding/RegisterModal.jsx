import { useState } from 'react'
import { useBidder } from '../../context/BidderContext'

export default function RegisterModal({ onClose, onRegistered }) {
  const { register } = useBidder()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.email.trim()) {
      setError('All fields are required')
      return
    }
    setSaving(true)
    try {
      const bidder = await register(form)
      setResult(bidder)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {result ? (
          <div className="text-center py-4">
            <div className="bg-green-100 text-green-800 rounded-xl p-6 mb-4">
              <p className="text-sm mb-1">Your Bidder Number</p>
              <p className="text-5xl font-bold">#{result.bidderNumber}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Welcome, {result.firstName}! You can now place bids on any item.
            </p>
            <button
              onClick={() => { onRegistered?.(); onClose() }}
              className="bg-navy text-gold font-bold py-3 px-8 rounded-lg hover:bg-navy-light transition-colors"
            >
              Start Bidding
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">Register to Bid</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Enter your info to get a bidder number. You only need to do this once.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
                    autoFocus
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
                  placeholder="555-123-4567"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-navy text-gold font-bold py-3 rounded-lg hover:bg-navy-light disabled:opacity-50 transition-colors"
              >
                {saving ? 'Registering...' : 'Get My Bidder Number'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBidder } from '../../context/BidderContext'
import { useAuction } from '../../context/AuctionContext'
import { useKiosk } from '../../context/KioskContext'
import { submitBid } from '../../lib/db'
import { AUCTION_STATUS } from '../../lib/constants'
import RegisterModal from './RegisterModal'

export default function BidForm({ item }) {
  const { bidder, clearRegistration } = useBidder()
  const { auction } = useAuction()
  const { isKiosk, resetSession } = useKiosk()
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false)
  const [amount, setAmount] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const minNextBid = (item.currentBid || item.minimumBid || 0) + (item.bidIncrement || 5)

  async function handleBid() {
    const numAmount = parseFloat(amount || minNextBid)
    if (isNaN(numAmount) || numAmount < minNextBid) {
      setErrorMsg(`Minimum bid is $${minNextBid}`)
      return
    }
    if (!amount) setAmount(String(minNextBid))
    setConfirming(true)
  }

  async function confirmBid() {
    const numAmount = parseFloat(amount)
    // Re-check against live data in case someone outbid during confirmation
    const currentMin = (item.currentBid || item.minimumBid || 0) + (item.bidIncrement || 5)
    if (numAmount < currentMin) {
      setConfirming(false)
      setErrorMsg(`Someone outbid you! New minimum is $${currentMin}`)
      setAmount(String(currentMin))
      return
    }

    setStatus('submitting')
    setErrorMsg('')
    try {
      const displayName = `${bidder.firstName} ${bidder.lastInitial}.`
      await submitBid(item.id, numAmount, item.title, item.itemNumber, {
        bidderNumber: bidder.bidderNumber,
        displayName,
        source: isKiosk ? 'kiosk' : 'online',
      })
      setStatus('success')
      setConfirming(false)
      setAmount('')

      if (isKiosk) {
        // In kiosk mode: show success briefly then reset
        setTimeout(() => {
          resetSession()
          navigate('/kiosk')
        }, 3000)
      } else {
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (err) {
      console.error('Bid submission error:', err)
      setStatus('error')
      setErrorMsg('Failed to place bid. Please try again.')
      setConfirming(false)
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  function setQuickBid(value) {
    setAmount(String(value))
    setErrorMsg('')
  }

  // Not open — show status message
  if (auction.status === AUCTION_STATUS.PREVIEW) {
    return (
      <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-600 font-medium">Bidding opens soon</p>
      </div>
    )
  }

  if (auction.status === AUCTION_STATUS.CLOSED) {
    return (
      <div className="mt-6 bg-red-50 rounded-lg p-4 text-center">
        <p className="text-red-700 font-medium">Bidding is closed</p>
      </div>
    )
  }

  // Not registered — show register prompt
  if (!bidder) {
    return (
      <>
        <div className="mt-6">
          <button
            onClick={() => setShowRegister(true)}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors text-lg"
          >
            Place a Bid
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            You'll need to register first (takes 30 seconds)
          </p>
        </div>
        {showRegister && (
          <RegisterModal
            onClose={() => setShowRegister(false)}
            onRegistered={() => setShowRegister(false)}
          />
        )}
      </>
    )
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="mt-6 bg-green-100 rounded-lg p-4 text-center">
        <p className="text-green-800 font-bold text-lg">You are the high bidder!</p>
        <p className="text-green-700 text-sm mt-1">Bidder #{bidder.bidderNumber}</p>
        {isKiosk && (
          <p className="text-green-600 text-xs mt-2">Returning to home screen...</p>
        )}
      </div>
    )
  }

  // Confirmation step
  if (confirming) {
    return (
      <div className="mt-6 bg-gold/10 border-2 border-gold rounded-lg p-4 text-center">
        <p className="text-navy font-bold text-lg mb-3">
          Bid ${parseFloat(amount).toLocaleString()} on this item?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={confirmBid}
            disabled={status === 'submitting'}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {status === 'submitting' ? 'Placing...' : 'Confirm Bid'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={status === 'submitting'}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Main bid form
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">
          Minimum next bid: <span className="font-bold text-navy">${minNextBid}</span>
        </p>
        <p className="text-xs text-gray-400">
          Bidder #{bidder.bidderNumber}
          {!isKiosk && (
            <button onClick={clearRegistration} className="ml-2 text-gray-400 hover:text-red-500 underline">
              Not you?
            </button>
          )}
        </p>
      </div>

      {/* Quick increment buttons */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setQuickBid(minNextBid)}
          className="flex-1 bg-gray-100 text-navy font-medium py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
        >
          Min ${minNextBid}
        </button>
        <button
          onClick={() => setQuickBid(minNextBid + 5)}
          className="flex-1 bg-gray-100 text-navy font-medium py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
        >
          +$5
        </button>
        <button
          onClick={() => setQuickBid(minNextBid + 10)}
          className="flex-1 bg-gray-100 text-navy font-medium py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
        >
          +$10
        </button>
        <button
          onClick={() => setQuickBid(minNextBid + 25)}
          className="flex-1 bg-gray-100 text-navy font-medium py-2 rounded-lg hover:bg-gray-200 text-sm transition-colors"
        >
          +$25
        </button>
      </div>

      {/* Bid input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrorMsg('') }}
            placeholder={String(minNextBid)}
            min={minNextBid}
            step="1"
            className="w-full pl-8 pr-3 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-lg font-bold"
          />
        </div>
        <button
          onClick={handleBid}
          className="bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
        >
          Bid
        </button>
      </div>

      {errorMsg && <p className="text-red-600 text-xs mt-2">{errorMsg}</p>}
    </div>
  )
}

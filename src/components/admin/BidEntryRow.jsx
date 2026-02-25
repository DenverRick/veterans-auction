import { useState, useRef } from 'react'
import { submitBid } from '../../lib/db'

export default function BidEntryRow({ item, bidderLookup }) {
  const [amount, setAmount] = useState('')
  const [bidderNum, setBidderNum] = useState('')
  const [status, setStatus] = useState('idle')
  const inputRef = useRef(null)

  const minNextBid = (item.currentBid || item.minimumBid || 0) + (item.bidIncrement || 5)

  async function handleSubmit(e) {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount < minNextBid) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 1500)
      return
    }

    const parsedBidder = bidderNum ? parseInt(bidderNum, 10) : null
    const displayName = parsedBidder && bidderLookup ? bidderLookup[parsedBidder] || null : null

    try {
      await submitBid(item.id, numAmount, item.title, item.itemNumber, {
        bidderNumber: parsedBidder,
        displayName,
        source: 'admin',
      })
      setStatus('success')
      setAmount('')
      setBidderNum('')
      setTimeout(() => setStatus('idle'), 1000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
        status === 'success'
          ? 'bg-green-100'
          : status === 'error'
          ? 'bg-red-100'
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <span className="w-12 font-mono font-bold text-navy text-sm">
        #{item.itemNumber}
      </span>
      <span className="flex-1 text-sm truncate">{item.title}</span>
      <span className="w-16 text-right font-bold text-sm">
        {item.currentBid ? `$${item.currentBid}` : `$${item.minimumBid}`}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={bidderNum}
        onChange={(e) => setBidderNum(e.target.value)}
        placeholder="B#"
        className="w-14 border rounded-lg px-1 py-2 text-center text-xs focus:border-gold focus:ring-1 focus:ring-gold outline-none"
      />
      <input
        ref={inputRef}
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`$${minNextBid}`}
        min={minNextBid}
        step="1"
        className="w-24 border rounded-lg px-2 py-2 text-right text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors"
      >
        GO
      </button>
    </form>
  )
}

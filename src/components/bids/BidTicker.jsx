import { useEffect, useState } from 'react'
import { subscribeToRecentBids } from '../../lib/db'

export default function BidTicker() {
  const [bids, setBids] = useState([])

  useEffect(() => {
    const unsub = subscribeToRecentBids(setBids, 10)
    return unsub
  }, [])

  if (bids.length === 0) return null

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 overflow-hidden">
      <div className="flex gap-8 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
        {bids.map((bid) => (
          <span key={bid.id} className="text-sm">
            <span className="text-gold font-bold">#{bid.itemNumber}</span>{' '}
            <span className="text-gray-300">{bid.itemTitle}</span>{' '}
            <span className="text-green-400 font-bold">${bid.amount}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

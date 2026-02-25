import { useState } from 'react'
import { useAuction } from '../../context/AuctionContext'
import { setAuctionStatus } from '../../lib/db'
import { AUCTION_STATUS } from '../../lib/constants'

const statusButtons = [
  { status: AUCTION_STATUS.PREVIEW, label: 'Preview', color: 'bg-gray-500' },
  { status: AUCTION_STATUS.OPEN, label: 'Open Bidding', color: 'bg-green-600' },
  { status: AUCTION_STATUS.CLOSED, label: 'Close Bidding', color: 'bg-red-600' },
]

export default function AuctionControls() {
  const { auction } = useAuction()
  const [updating, setUpdating] = useState(false)

  async function handleChange(newStatus) {
    if (newStatus === auction.status) return
    setUpdating(true)
    try {
      await setAuctionStatus(newStatus)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-bold text-navy mb-3">Auction Status</h3>
      <div className="flex flex-wrap gap-2">
        {statusButtons.map((btn) => (
          <button
            key={btn.status}
            onClick={() => handleChange(btn.status)}
            disabled={updating}
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-opacity ${btn.color} ${
              auction.status === btn.status
                ? 'ring-2 ring-offset-2 ring-gold'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

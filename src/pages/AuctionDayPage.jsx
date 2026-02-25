import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuction } from '../context/AuctionContext'
import { subscribeToBidders, setAuctionStatus } from '../lib/db'
import { AUCTION_STATUS } from '../lib/constants'
import Clock from '../components/shared/Clock'
import WinnersTable from '../components/admin/WinnersTable'

const statusDisplay = {
  [AUCTION_STATUS.PREVIEW]: {
    label: 'Auction in Preview',
    bg: 'bg-gray-500',
    text: 'Items are visible but bidding is not yet open.',
  },
  [AUCTION_STATUS.OPEN]: {
    label: 'Bidding is OPEN',
    bg: 'bg-green-600',
    text: 'Bidders can place bids on all items.',
    animate: true,
  },
  [AUCTION_STATUS.CLOSED]: {
    label: 'Bidding is CLOSED',
    bg: 'bg-red-600',
    text: 'No more bids accepted. See winners below.',
  },
}

export default function AuctionDayPage() {
  const { items, auction } = useAuction()
  const [bidderCount, setBidderCount] = useState(0)
  const [confirmAction, setConfirmAction] = useState(null) // null | 'open' | 'close' | 'preview'
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const unsub = subscribeToBidders((bidders) => setBidderCount(bidders.length))
    return unsub
  }, [])

  const activeItems = items.filter((i) => i.active !== false)
  const itemsWithBids = activeItems.filter((i) => i.currentBid)
  const totalBidValue = itemsWithBids.reduce((sum, i) => sum + (i.currentBid || 0), 0)

  const current = statusDisplay[auction.status] || statusDisplay.preview

  async function executeStatusChange(newStatus) {
    setUpdating(true)
    try {
      await setAuctionStatus(newStatus)
    } finally {
      setUpdating(false)
      setConfirmAction(null)
    }
  }

  const confirmMessages = {
    open: {
      title: 'Start Bidding?',
      body: 'Bidders will be able to place bids on all items.',
      status: AUCTION_STATUS.OPEN,
      btnClass: 'bg-green-600 hover:bg-green-700',
    },
    close: {
      title: 'Close Bidding?',
      body: 'No more bids will be accepted. Winners will be determined.',
      status: AUCTION_STATUS.CLOSED,
      btnClass: 'bg-red-600 hover:bg-red-700',
    },
    preview: {
      title: 'Reset to Preview?',
      body: 'The auction will return to preview mode. Existing bids are preserved.',
      status: AUCTION_STATUS.PREVIEW,
      btnClass: 'bg-gray-500 hover:bg-gray-600',
    },
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin" className="text-gold hover:text-gold-light text-sm no-underline">
          &larr; Back to Items
        </Link>
        <h2 className="text-2xl font-bold text-navy">Auction Day</h2>
        <Clock showSeconds className="text-2xl text-navy" />
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl p-6 text-white text-center mb-6 ${current.bg} ${current.animate ? 'pulse-gold' : ''}`}>
        <h3 className="text-3xl font-bold mb-1">{current.label}</h3>
        <p className="text-sm opacity-80">{current.text}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        {auction.status === AUCTION_STATUS.PREVIEW && (
          <button
            onClick={() => setConfirmAction('open')}
            className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            Start Bidding
          </button>
        )}
        {auction.status === AUCTION_STATUS.OPEN && (
          <button
            onClick={() => setConfirmAction('close')}
            className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            Close Bidding
          </button>
        )}
        {auction.status === AUCTION_STATUS.CLOSED && (
          <button
            onClick={() => setConfirmAction('preview')}
            className="flex-1 bg-gray-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-600 transition-colors shadow-lg"
          >
            Reset to Preview
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{itemsWithBids.length}</div>
          <div className="text-xs text-gray-500">Items with Bids</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-gold">${totalBidValue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total Bid Value</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-navy">{bidderCount}</div>
          <div className="text-xs text-gray-500">Registered Bidders</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-navy">{activeItems.length}</div>
          <div className="text-xs text-gray-500">Total Items</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3 mb-6">
        <a
          href="/tv"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-800 text-white font-medium py-3 rounded-lg text-center text-sm hover:bg-gray-700 transition-colors no-underline"
        >
          Open TV Display
        </a>
        <a
          href="/kiosk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white font-medium py-3 rounded-lg text-center text-sm hover:bg-green-700 transition-colors no-underline"
        >
          Open Kiosk
        </a>
      </div>

      {/* Winners Table (shown when closed) */}
      {auction.status === AUCTION_STATUS.CLOSED && (
        <WinnersTable items={items} />
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <p className="text-xl font-bold text-navy mb-2">
              {confirmMessages[confirmAction].title}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {confirmMessages[confirmAction].body}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => executeStatusChange(confirmMessages[confirmAction].status)}
                disabled={updating}
                className={`text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 transition-colors ${confirmMessages[confirmAction].btnClass}`}
              >
                {updating ? 'Updating...' : 'Confirm'}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                disabled={updating}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

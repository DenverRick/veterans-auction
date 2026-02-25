import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuction } from '../context/AuctionContext'
import { subscribeToBidders } from '../lib/db'
import AuctionControls from '../components/admin/AuctionControls'

export default function AdminDashboard() {
  const { items } = useAuction()
  const [bidderCount, setBidderCount] = useState(0)

  useEffect(() => {
    const unsub = subscribeToBidders((bidders) => setBidderCount(bidders.length))
    return unsub
  }, [])

  const activeItems = items.filter((i) => i.active !== false)
  const itemsWithBids = activeItems.filter((i) => i.currentBid)
  const totalBidValue = itemsWithBids.reduce((sum, i) => sum + (i.currentBid || 0), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-navy mb-6">Admin Dashboard</h2>

      <AuctionControls />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-navy">{activeItems.length}</div>
          <div className="text-sm text-gray-500">Total Items</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{itemsWithBids.length}</div>
          <div className="text-sm text-gray-500">Items with Bids</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-gold">${totalBidValue.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Total Bid Value</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-navy">{bidderCount}</div>
          <div className="text-sm text-gray-500">Registered Bidders</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link
          to="/admin/items/new"
          className="bg-navy text-gold rounded-xl p-6 text-center font-bold text-lg hover:bg-navy-light transition-colors no-underline shadow"
        >
          Add Item
        </Link>
        <Link
          to="/admin/import"
          className="bg-white text-navy rounded-xl p-6 text-center font-bold text-lg hover:bg-gray-50 transition-colors no-underline shadow border"
        >
          Import CSV
        </Link>
        <Link
          to="/admin/qr"
          className="bg-gold text-navy rounded-xl p-6 text-center font-bold text-lg hover:bg-gold-light transition-colors no-underline shadow"
        >
          QR Code Flyer
        </Link>
        <Link
          to="/tv"
          className="bg-gray-800 text-white rounded-xl p-6 text-center font-bold text-lg hover:bg-gray-700 transition-colors no-underline shadow"
        >
          TV Display
        </Link>
        <a
          href="/kiosk"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white rounded-xl p-6 text-center font-bold text-lg hover:bg-green-700 transition-colors no-underline shadow"
        >
          Kiosk Mode
        </a>
      </div>

      {/* Item List */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-navy mb-3">Items ({activeItems.length})</h3>
        <div className="bg-white rounded-xl shadow divide-y">
          {activeItems
            .sort((a, b) => (a.itemNumber || 0) - (b.itemNumber || 0))
            .map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-navy mr-2">#{item.itemNumber}</span>
                  <span className="text-sm text-gray-800 truncate">{item.title}</span>
                  {item.currentBid && (
                    <span className="ml-2 text-xs text-green-600 font-medium">
                      ${item.currentBid}
                    </span>
                  )}
                </div>
                <Link
                  to={`/admin/items/${item.id}`}
                  className="text-sm text-gold font-medium hover:text-gold/80 no-underline ml-3"
                >
                  Edit
                </Link>
              </div>
            ))}
          {activeItems.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-400">
              No items yet. Click "Add Item" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

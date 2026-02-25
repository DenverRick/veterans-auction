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
          to="/admin/bids"
          className="bg-green-600 text-white rounded-xl p-6 text-center font-bold text-lg hover:bg-green-700 transition-colors no-underline shadow"
        >
          Enter Bids
        </Link>
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
          to="/tv"
          className="bg-gray-800 text-white rounded-xl p-6 text-center font-bold text-lg hover:bg-gray-700 transition-colors no-underline shadow"
        >
          TV Display
        </Link>
      </div>
    </div>
  )
}

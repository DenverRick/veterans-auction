import { useState, useMemo, useEffect } from 'react'
import { useAuction } from '../context/AuctionContext'
import { subscribeToBidders } from '../lib/db'
import BidEntryRow from '../components/admin/BidEntryRow'
import { Link } from 'react-router-dom'

export default function AdminBidEntry() {
  const { items } = useAuction()
  const [search, setSearch] = useState('')
  const [bidders, setBidders] = useState([])

  useEffect(() => {
    const unsub = subscribeToBidders(setBidders)
    return unsub
  }, [])

  // Build lookup: bidderNumber -> "FirstName L."
  const bidderLookup = useMemo(() => {
    const map = {}
    bidders.forEach((b) => {
      map[b.bidderNumber] = `${b.firstName} ${b.lastInitial}.`
    })
    return map
  }, [bidders])

  const sortedItems = useMemo(() => {
    let result = items.filter((i) => i.active !== false)
    result.sort((a, b) => (a.itemNumber || 0) - (b.itemNumber || 0))

    if (search) {
      const q = search.toLowerCase()
      const num = parseInt(q, 10)
      if (!isNaN(num)) {
        result = result.filter((i) => i.itemNumber === num)
      } else {
        result = result.filter((i) => i.title?.toLowerCase().includes(q))
      }
    }

    return result
  }, [items, search])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-navy">Enter Bids</h2>
        <Link to="/admin" className="text-gold hover:text-gold-light text-sm no-underline">
          &larr; Dashboard
        </Link>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        B# = bidder number (optional). {bidders.length} registered bidder{bidders.length !== 1 ? 's' : ''}.
      </p>

      <input
        type="text"
        inputMode="numeric"
        placeholder="Jump to item # or search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none mb-4 text-sm"
        autoFocus
      />

      <div className="space-y-1">
        {sortedItems.map((item) => (
          <BidEntryRow key={item.id} item={item} bidderLookup={bidderLookup} />
        ))}
      </div>

      {sortedItems.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          {search ? 'No matching items' : 'No items yet. Import items first.'}
        </p>
      )}
    </div>
  )
}

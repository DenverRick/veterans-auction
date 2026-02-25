import { Link } from 'react-router-dom'
import { useAuction } from '../context/AuctionContext'

export default function AdminDashboard() {
  const { items } = useAuction()
  const activeItems = items.filter((i) => i.active !== false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy">Item Management</h2>
        <Link
          to="/admin/auction-day"
          className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors no-underline text-sm"
        >
          Auction Day &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
          Bulk Import
        </Link>
        <Link
          to="/admin/qr"
          className="bg-gold text-navy rounded-xl p-6 text-center font-bold text-lg hover:bg-gold-light transition-colors no-underline shadow"
        >
          QR Code Flyer
        </Link>
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

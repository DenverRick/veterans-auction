import { useParams, Link } from 'react-router-dom'
import { useAuction } from '../context/AuctionContext'
import BidBadge from '../components/bids/BidBadge'
import BidForm from '../components/bidding/BidForm'
import { CATEGORIES } from '../lib/constants'

export default function ItemDetailPage() {
  const { id } = useParams()
  const { items, loading } = useAuction()
  const item = items.find((i) => i.id === id)

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">Item not found</p>
        <Link to="/" className="text-gold hover:text-gold-light underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  const categoryName = CATEGORIES[item.category]?.name || item.category

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="text-gold hover:text-gold-light text-sm mb-4 inline-block no-underline">
        &larr; Back to catalog
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {item.photoURL && (
          <div className="aspect-[16/9] bg-gray-100">
            <img
              src={item.photoURL}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold text-gold bg-navy px-2 py-1 rounded mb-2 inline-block">
                #{item.itemNumber}
              </span>
              <h2 className="text-2xl font-bold text-navy mt-1">{item.title}</h2>
            </div>
            <BidBadge currentBid={item.currentBid} minimumBid={item.minimumBid} />
          </div>

          {item.description && (
            <p className="text-gray-700 mb-4 whitespace-pre-line">{item.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t pt-4">
            <div>
              <span className="text-gray-500 block">Value</span>
              <span className="font-bold text-navy">${item.estimatedValue}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Minimum Bid</span>
              <span className="font-bold">${item.minimumBid}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Bid Increment</span>
              <span className="font-bold">${item.bidIncrement}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Category</span>
              <span className="font-bold">{categoryName}</span>
            </div>
          </div>

          {item.donor && (
            <p className="text-sm text-gray-500 mt-4">
              Donated by <span className="font-medium text-gray-700">{item.donor}</span>
            </p>
          )}

          {item.bidCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {item.bidCount} bid{item.bidCount !== 1 ? 's' : ''} placed
              {item.currentBidderName && (
                <span> &mdash; High bidder: <span className="font-medium text-navy">{item.currentBidderName}</span></span>
              )}
            </p>
          )}

          <BidForm item={item} />
        </div>
      </div>
    </div>
  )
}

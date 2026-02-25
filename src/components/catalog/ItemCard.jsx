import { Link } from 'react-router-dom'
import BidBadge from '../bids/BidBadge'
import { useKiosk } from '../../context/KioskContext'
import { useBidder } from '../../context/BidderContext'

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%231a2744"><rect width="400" height="300"/><text x="200" y="160" text-anchor="middle" fill="%23c5a44e" font-size="48" font-family="serif">?</text></svg>'
)

export default function ItemCard({ item }) {
  const { isKiosk } = useKiosk()
  const { bidder } = useBidder()
  const linkPrefix = isKiosk ? '/kiosk' : ''
  const isRecent = item.lastBidTime && (Date.now() - item.lastBidTime) < 60000
  const isMyBid = bidder?.bidderNumber && item.currentBidderNumber === bidder.bidderNumber

  return (
    <Link
      to={`${linkPrefix}/item/${item.id}`}
      className={`block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow no-underline ${isRecent ? 'bid-flash' : ''}`}
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={item.photoURL || PLACEHOLDER}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-navy text-gold text-xs font-bold px-2 py-1 rounded">
          #{item.itemNumber}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-navy text-sm mb-1 line-clamp-2">{item.title}</h3>
        {item.donor && (
          <p className="text-xs text-gray-500 mb-2">Donated by {item.donor}</p>
        )}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-xs text-gray-500">
              Value: <span className="font-semibold text-gray-700">${item.estimatedValue}</span>
            </div>
            {isMyBid && (
              <div className="text-xs font-semibold text-green-600 mt-1">
                My Bid: ${item.currentBid}
              </div>
            )}
          </div>
          <BidBadge
            currentBid={item.currentBid}
            minimumBid={item.minimumBid}
          />
        </div>
      </div>
    </Link>
  )
}

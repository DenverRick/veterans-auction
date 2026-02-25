import { Link, useLocation } from 'react-router-dom'
import { useAuction } from '../../context/AuctionContext'
import { useBidder } from '../../context/BidderContext'
import { AUCTION_STATUS } from '../../lib/constants'

const bidderStatusConfig = {
  [AUCTION_STATUS.PREVIEW]: { label: 'Coming Soon', className: 'bg-gray-500' },
  [AUCTION_STATUS.OPEN]: { label: 'Bidding Open', className: 'bg-green-600 pulse-gold' },
  [AUCTION_STATUS.CLOSED]: { label: 'Bidding Closed', className: 'bg-red-600' },
}

const adminStatusConfig = {
  [AUCTION_STATUS.PREVIEW]: { label: 'Preview', className: 'bg-gray-500' },
  [AUCTION_STATUS.OPEN]: { label: 'Bidding Open', className: 'bg-green-600 pulse-gold' },
  [AUCTION_STATUS.CLOSED]: { label: 'Bidding Closed', className: 'bg-red-600' },
}

export default function Header() {
  const { auction } = useAuction()
  const { bidder } = useBidder()
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const statusMap = isAdminPage ? adminStatusConfig : bidderStatusConfig
  const status = statusMap[auction.status] || bidderStatusConfig.preview

  return (
    <header className="bg-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <h1 className="text-lg font-bold text-gold tracking-wide">
            Hilltop Veterans Club
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {bidder && !isAdminPage && (
            <span className="text-xs font-bold text-gold bg-gold/20 px-2 py-1 rounded">
              Bidder #{bidder.bidderNumber}
            </span>
          )}
          <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${status.className}`}>
            {status.label}
          </span>
          {isAdminPage && (
            <nav className="hidden sm:flex gap-4 text-sm">
              <Link to="/" className="text-gray-300 hover:text-white no-underline">
                Catalog
              </Link>
              <Link to="/tv" className="text-gray-300 hover:text-white no-underline">
                TV
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

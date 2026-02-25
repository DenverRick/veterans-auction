import { useLocation } from 'react-router-dom'
import { useAuction } from '../../context/AuctionContext'
import { AUCTION_STATUS } from '../../lib/constants'

const bannerConfig = {
  [AUCTION_STATUS.PREVIEW]: {
    text: 'Bidding has not started',
    className: 'bg-gray-500 text-white',
  },
  [AUCTION_STATUS.OPEN]: {
    text: 'Bidding is open!',
    className: 'bg-green-600 text-white pulse-gold',
  },
  [AUCTION_STATUS.CLOSED]: {
    text: 'Bidding has ended',
    className: 'bg-red-600 text-white',
  },
}

export default function StatusBanner() {
  const { auction } = useAuction()
  const location = useLocation()

  // Hide on admin pages (admin has its own status display)
  if (location.pathname.startsWith('/admin')) return null

  const config = bannerConfig[auction.status] || bannerConfig.preview

  return (
    <div className={`text-center py-2 text-sm font-bold tracking-wide ${config.className}`}>
      {config.text}
    </div>
  )
}

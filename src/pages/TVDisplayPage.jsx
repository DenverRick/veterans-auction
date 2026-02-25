import { useEffect, useState, useRef } from 'react'
import { useAuction } from '../context/AuctionContext'
import BidTicker from '../components/bids/BidTicker'
import { AUCTION_STATUS } from '../lib/constants'

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <span className="font-mono">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

export default function TVDisplayPage() {
  const { items, auction } = useAuction()
  const scrollRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const sortedItems = [...items]
    .filter((i) => i.active !== false)
    .sort((a, b) => (a.itemNumber || 0) - (b.itemNumber || 0))

  // Auto-scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const rowHeight = 64
    const scrollInterval = 3500

    const timer = setInterval(() => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        setTimeout(() => {
          container.scrollTo({ top: 0, behavior: 'smooth' })
        }, 4000)
      } else {
        container.scrollBy({ top: rowHeight, behavior: 'smooth' })
      }
    }, scrollInterval)

    return () => clearInterval(timer)
  }, [])

  function goFullscreen() {
    document.documentElement.requestFullscreen?.()
    setIsFullscreen(true)
  }

  const isClosed = auction.status === AUCTION_STATUS.CLOSED

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gold tracking-wide">
          Hilltop Veterans Club Silent Auction
        </h1>
        <div className="flex items-center gap-6">
          {auction.status === AUCTION_STATUS.OPEN && (
            <span className="bg-green-600 text-white text-sm font-bold px-4 py-1 rounded-full pulse-gold">
              BIDDING OPEN
            </span>
          )}
          {isClosed && (
            <span className="bg-red-600 text-white text-sm font-bold px-4 py-1 rounded-full">
              BIDDING CLOSED
            </span>
          )}
          <Clock />
          {!isFullscreen && (
            <button
              onClick={goFullscreen}
              className="text-xs text-gray-400 hover:text-white border border-gray-600 px-3 py-1 rounded"
            >
              Fullscreen
            </button>
          )}
        </div>
      </div>

      {/* Ticker */}
      <BidTicker />

      {/* Closed overlay */}
      {isClosed && (
        <div className="bg-red-900/90 text-center py-4 shrink-0">
          <p className="text-2xl font-bold text-white">
            Bidding is closed — Winners being determined
          </p>
        </div>
      )}

      {/* Items table */}
      <div ref={scrollRef} className="flex-1 overflow-hidden px-6 py-2">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-700">
              <th className="py-2 text-left w-16">#</th>
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-right w-32">Value</th>
              <th className="py-2 text-right w-32">Min Bid</th>
              <th className="py-2 text-right w-40">Current Bid</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const isRecent = item.lastBidTime && (Date.now() - item.lastBidTime) < 60000
              return (
                <tr
                  key={item.id}
                  className={`border-b border-gray-800 h-16 ${
                    isRecent ? 'bg-gold/20' : ''
                  }`}
                >
                  <td className="text-gold font-bold text-xl">{item.itemNumber}</td>
                  <td className="text-lg">{item.title}</td>
                  <td className="text-right text-gray-400">${item.estimatedValue}</td>
                  <td className="text-right text-gray-400">${item.minimumBid}</td>
                  <td className="text-right">
                    {item.currentBid ? (
                      <div>
                        <span className={`text-2xl font-bold ${isRecent ? 'text-gold' : 'text-green-400'}`}>
                          ${item.currentBid}
                          {isRecent && <span className="text-xs ml-2 text-gold">NEW</span>}
                        </span>
                        {item.currentBidderName && (
                          <div className="text-xs text-gray-500">{item.currentBidderName}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-navy/50 text-center py-3 shrink-0 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          Treasure Chest donations support World Central Kitchen
        </p>
      </div>
    </div>
  )
}

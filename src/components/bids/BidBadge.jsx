export default function BidBadge({ currentBid, minimumBid }) {
  if (currentBid) {
    return (
      <span className="bg-gold text-white text-sm font-bold px-3 py-1 rounded-lg">
        ${currentBid}
      </span>
    )
  }

  return (
    <span className="bg-gray-300 text-gray-700 text-sm font-medium px-3 py-1 rounded-lg">
      Start: ${minimumBid}
    </span>
  )
}

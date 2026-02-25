export default function WinnersTable({ items }) {
  const winners = items
    .filter((i) => i.active !== false && i.currentBid)
    .sort((a, b) => (a.itemNumber || 0) - (b.itemNumber || 0))

  const noBids = items
    .filter((i) => i.active !== false && !i.currentBid)
    .sort((a, b) => (a.itemNumber || 0) - (b.itemNumber || 0))

  const totalValue = winners.reduce((sum, i) => sum + (i.currentBid || 0), 0)

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-navy">Winners</h3>
        <span className="text-sm text-gray-500">
          {winners.length} item{winners.length !== 1 ? 's' : ''} &bull; ${totalValue.toLocaleString()} total
        </span>
      </div>

      {winners.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white text-left">
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3 text-right">Winning Bid</th>
                <th className="px-4 py-3">Winner</th>
                <th className="px-4 py-3 w-24">Bidder #</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {winners.map((item) => (
                <tr key={item.id} className="hover:bg-cream">
                  <td className="px-4 py-3 font-bold text-gold">{item.itemNumber}</td>
                  <td className="px-4 py-3 font-medium text-navy">{item.title}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">
                    ${item.currentBid.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">{item.currentBidderName || '\u2014'}</td>
                  <td className="px-4 py-3 font-mono">
                    {item.currentBidderNumber ? `#${item.currentBidderNumber}` : '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-400">
          No items received bids.
        </div>
      )}

      {noBids.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-bold text-gray-500 mb-2">
            No Bids ({noBids.length} item{noBids.length !== 1 ? 's' : ''})
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
            {noBids.map((i) => `#${i.itemNumber} ${i.title}`).join(' \u2022 ')}
          </div>
        </div>
      )}
    </div>
  )
}

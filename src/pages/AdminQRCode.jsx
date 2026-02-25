import { QRCodeSVG } from 'qrcode.react'
import { Link } from 'react-router-dom'

const AUCTION_URL = 'https://hilltop-veterans-auction.web.app'

export default function AdminQRCode() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <h2 className="text-xl font-bold text-navy">QR Code Flyer</h2>
        <Link to="/admin" className="text-gold hover:text-gold-light text-sm no-underline">
          &larr; Dashboard
        </Link>
      </div>

      <button
        onClick={() => window.print()}
        className="mb-6 bg-navy text-gold font-bold py-2 px-6 rounded-lg hover:bg-navy-light transition-colors print:hidden"
      >
        Print Flyer
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8 text-center print:shadow-none print:rounded-none">
        <h1 className="text-3xl font-bold text-navy mb-2">
          Hilltop Veterans Club
        </h1>
        <h2 className="text-xl text-gold font-semibold mb-1">
          Silent Auction 2026
        </h2>
        <p className="text-gray-500 text-sm mb-1">March 29, 2026 &bull; 1:00 PM &ndash; 3:00 PM</p>
        <p className="text-gray-600 mb-6">
          Scan to browse items and place your bids!
        </p>

        <div className="flex justify-center mb-6">
          <QRCodeSVG
            value={AUCTION_URL}
            size={256}
            level="H"
            fgColor="#1a2744"
            includeMargin={true}
          />
        </div>

        <p className="text-sm text-gray-500 font-mono">{AUCTION_URL}</p>
      </div>
    </div>
  )
}

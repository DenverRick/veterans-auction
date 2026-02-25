import { useKiosk } from '../context/KioskContext'

export default function KioskLanding() {
  const { startSession } = useKiosk()

  return (
    <div
      onClick={startSession}
      className="min-h-screen bg-navy flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none"
    >
      <h1 className="text-4xl font-bold text-gold mb-4">
        Hilltop Veterans Club
      </h1>
      <h2 className="text-2xl text-white mb-8">
        Silent Auction
      </h2>
      <div className="bg-gold/20 border-2 border-gold rounded-2xl px-12 py-8 mb-8">
        <p className="text-3xl font-bold text-gold pulse-gold">
          Tap to Start
        </p>
      </div>
      <p className="text-gray-400 text-sm">
        Browse items and place your bids
      </p>
    </div>
  )
}

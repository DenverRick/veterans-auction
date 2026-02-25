import { Outlet } from 'react-router-dom'
import { KioskProvider, useKiosk } from '../context/KioskContext'
import { BidderProvider } from '../context/BidderContext'
import KioskLanding from './KioskLanding'

function KioskShell() {
  const { isActive } = useKiosk()

  if (!isActive) {
    return <KioskLanding />
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gold tracking-wide">
            Hilltop Veterans Club Auction
          </h1>
          <span className="text-xs text-gray-400">Kiosk</span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default function KioskLayout() {
  return (
    <KioskProvider>
      <BidderProvider persist={false}>
        <KioskShell />
      </BidderProvider>
    </KioskProvider>
  )
}

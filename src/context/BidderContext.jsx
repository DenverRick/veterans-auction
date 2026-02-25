import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { registerBidder, subscribeToBidders } from '../lib/db'
import { useKiosk } from './KioskContext'

const STORAGE_KEY = 'auction_bidder'
const BidderContext = createContext(null)

export function BidderProvider({ children, persist = true }) {
  const { isKiosk, registerResetCallback } = useKiosk()
  const shouldPersist = persist && !isKiosk

  const [bidder, setBidder] = useState(() => {
    if (!shouldPersist) return null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const register = useCallback(async ({ firstName, lastName, phone, email }) => {
    const lastInitial = lastName.trim().charAt(0).toUpperCase()
    const result = await registerBidder({
      firstName: firstName.trim(),
      lastInitial,
      phone: phone.trim(),
      email: email.trim(),
    })
    const bidderData = { ...result, phone: phone.trim(), email: email.trim() }
    if (shouldPersist) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bidderData))
    }
    setBidder(bidderData)
    return bidderData
  }, [shouldPersist])

  const clearRegistration = useCallback(() => {
    if (shouldPersist) {
      localStorage.removeItem(STORAGE_KEY)
    }
    setBidder(null)
  }, [shouldPersist])

  // Verify stored bidder still exists in database (handles auction reset)
  useEffect(() => {
    if (!bidder || !shouldPersist) return
    const unsub = subscribeToBidders((bidders) => {
      const stillExists = bidders.some((b) => b.bidderNumber === bidder.bidderNumber)
      if (!stillExists) {
        clearRegistration()
      }
    })
    return unsub
  }, [bidder, shouldPersist, clearRegistration])

  // Register with kiosk so it can clear bidder on session reset
  useEffect(() => {
    if (isKiosk) {
      registerResetCallback(clearRegistration)
    }
  }, [isKiosk, registerResetCallback, clearRegistration])

  return (
    <BidderContext.Provider value={{ bidder, register, clearRegistration }}>
      {children}
    </BidderContext.Provider>
  )
}

export function useBidder() {
  const ctx = useContext(BidderContext)
  if (!ctx) throw new Error('useBidder must be used within BidderProvider')
  return ctx
}

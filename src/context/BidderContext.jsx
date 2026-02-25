import { createContext, useContext, useState, useCallback } from 'react'
import { registerBidder } from '../lib/db'

const STORAGE_KEY = 'auction_bidder'
const BidderContext = createContext(null)

export function BidderProvider({ children }) {
  const [bidder, setBidder] = useState(() => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bidderData))
    setBidder(bidderData)
    return bidderData
  }, [])

  const clearRegistration = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setBidder(null)
  }, [])

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

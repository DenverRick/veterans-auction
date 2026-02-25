import { createContext, useContext, useEffect, useState } from 'react'
import { subscribeToItems, subscribeToAuctionStatus } from '../lib/db'

const AuctionContext = createContext(null)

export function AuctionProvider({ children }) {
  const [items, setItems] = useState([])
  const [auction, setAuction] = useState({ status: 'preview', title: 'Silent Auction' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let itemsLoaded = false
    let auctionLoaded = false

    const checkLoaded = () => {
      if (itemsLoaded && auctionLoaded) setLoading(false)
    }

    const handleError = () => setLoading(false)

    const unsubItems = subscribeToItems((data) => {
      setItems(data)
      itemsLoaded = true
      checkLoaded()
    }, handleError)

    const unsubAuction = subscribeToAuctionStatus((data) => {
      setAuction(data)
      auctionLoaded = true
      checkLoaded()
    }, handleError)

    return () => {
      unsubItems()
      unsubAuction()
    }
  }, [])

  return (
    <AuctionContext.Provider value={{ items, auction, loading }}>
      {children}
    </AuctionContext.Provider>
  )
}

export function useAuction() {
  const ctx = useContext(AuctionContext)
  if (!ctx) throw new Error('useAuction must be used within AuctionProvider')
  return ctx
}

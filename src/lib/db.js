import { ref, get, set, update, push, remove, onValue, query, limitToLast, increment, runTransaction } from 'firebase/database'
import { db } from '../firebase'

// --- Read helpers ---

export function subscribeToItems(callback, onError) {
  const itemsRef = ref(db, 'items')
  return onValue(itemsRef, (snapshot) => {
    const data = snapshot.val()
    const items = data
      ? Object.entries(data).map(([id, item]) => ({ id, ...item }))
      : []
    callback(items)
  }, (err) => {
    console.error('Firebase items read error:', err)
    if (onError) onError(err)
    else callback([])
  })
}

export function subscribeToAuctionStatus(callback, onError) {
  const statusRef = ref(db, 'auction')
  return onValue(statusRef, (snapshot) => {
    callback(snapshot.val() || { status: 'preview', title: 'Silent Auction' })
  }, (err) => {
    console.error('Firebase auction read error:', err)
    if (onError) onError(err)
    else callback({ status: 'preview', title: 'Silent Auction' })
  })
}

export function subscribeToRecentBids(callback, count = 20) {
  const recentRef = query(ref(db, 'recentBids'), limitToLast(count))
  return onValue(recentRef, (snapshot) => {
    const data = snapshot.val()
    const bids = data
      ? Object.entries(data).map(([id, bid]) => ({ id, ...bid })).reverse()
      : []
    callback(bids)
  })
}

// --- Write helpers ---

export async function submitBid(itemId, amount, itemTitle, itemNumber, bidderInfo = null) {
  const bidderNumber = bidderInfo?.bidderNumber || null
  const bidderDisplayName = bidderInfo?.displayName || null
  const source = bidderInfo?.source || 'admin'
  const now = Date.now()
  const updates = {}

  updates[`items/${itemId}/currentBid`] = amount
  updates[`items/${itemId}/bidCount`] = increment(1)
  updates[`items/${itemId}/lastBidTime`] = now
  updates[`items/${itemId}/currentBidderNumber`] = bidderNumber
  updates[`items/${itemId}/currentBidderName`] = bidderDisplayName

  const historyKey = push(ref(db, `bidHistory/${itemId}`)).key
  updates[`bidHistory/${itemId}/${historyKey}`] = {
    amount,
    timestamp: now,
    bidderNumber,
    bidderDisplayName,
    source,
  }

  const recentKey = push(ref(db, 'recentBids')).key
  updates[`recentBids/${recentKey}`] = {
    itemId,
    itemTitle,
    itemNumber,
    amount,
    timestamp: now,
    bidderNumber,
    bidderDisplayName,
    source,
  }

  await update(ref(db), updates)
}

export async function saveItem(itemId, itemData) {
  const itemRef = ref(db, `items/${itemId}`)
  await set(itemRef, itemData)
}

export async function updateItem(itemId, updates) {
  const itemRef = ref(db, `items/${itemId}`)
  await update(itemRef, updates)
}

export async function deleteItem(itemId) {
  await set(ref(db, `items/${itemId}`), null)
}

export async function setAuctionStatus(status) {
  await update(ref(db, 'auction'), { status })
}

export async function getAuctionSettings() {
  const snapshot = await get(ref(db, 'auction'))
  return snapshot.val()
}

export async function saveAuctionSettings(settings) {
  await update(ref(db, 'auction'), settings)
}

export async function importItems(items) {
  const updates = {}
  items.forEach((item) => {
    const id = `item_${String(item.itemNumber).padStart(3, '0')}`
    updates[`items/${id}`] = {
      ...item,
      currentBid: null,
      bidCount: 0,
      lastBidTime: null,
      active: true,
    }
  })
  await update(ref(db), updates)
}

// --- Bidder helpers ---

export async function registerBidder({ firstName, lastInitial, phone, email }) {
  const numberRef = ref(db, 'auction/nextBidderNumber')
  const result = await runTransaction(numberRef, (current) => (current || 100) + 1)
  const bidderNumber = result.snapshot.val()

  const bidderId = push(ref(db, 'bidders')).key
  await set(ref(db, `bidders/${bidderId}`), {
    bidderNumber,
    firstName,
    lastInitial,
    phone,
    email,
    registeredAt: Date.now(),
  })

  return { bidderId, bidderNumber, firstName, lastInitial }
}

export async function resetAuction() {
  // Get all items to clear their bid data
  const itemsSnap = await get(ref(db, 'items'))
  const items = itemsSnap.val()
  const updates = {}

  if (items) {
    Object.keys(items).forEach((id) => {
      updates[`items/${id}/currentBid`] = null
      updates[`items/${id}/currentBidderNumber`] = null
      updates[`items/${id}/currentBidderName`] = null
      updates[`items/${id}/bidCount`] = 0
      updates[`items/${id}/lastBidTime`] = null
    })
  }

  // Reset auction status and bidder counter
  updates['auction/status'] = 'preview'
  updates['auction/nextBidderNumber'] = 101

  // Apply all item + auction updates in one write
  await update(ref(db), updates)

  // Delete bidders, bid history, and recent bids
  await Promise.all([
    remove(ref(db, 'bidders')),
    remove(ref(db, 'bidHistory')),
    remove(ref(db, 'recentBids')),
  ])
}

export function subscribeToBidders(callback, onError) {
  const biddersRef = ref(db, 'bidders')
  return onValue(biddersRef, (snapshot) => {
    const data = snapshot.val()
    const bidders = data
      ? Object.entries(data).map(([id, b]) => ({ id, ...b }))
      : []
    callback(bidders)
  }, (err) => {
    console.error('Firebase bidders read error:', err)
    if (onError) onError(err)
    else callback([])
  })
}

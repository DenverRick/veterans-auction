export const AUCTION_STATUS = {
  PREVIEW: 'preview',
  OPEN: 'open',
  CLOSED: 'closed',
}

export const CATEGORIES = {
  food: { name: 'Food & Dining', order: 1 },
  home: { name: 'Home & Garden', order: 2 },
  sports: { name: 'Sports & Outdoors', order: 3 },
  art: { name: 'Art & Prints', order: 4 },
  experiences: { name: 'Experiences', order: 5 },
  gift_cards: { name: 'Gift Cards', order: 6 },
  wine: { name: 'Wine & Spirits', order: 7 },
  other: { name: 'Other', order: 8 },
}

export const SORT_OPTIONS = {
  NUMBER_ASC: { label: 'Item # (low to high)', field: 'itemNumber', dir: 'asc' },
  NUMBER_DESC: { label: 'Item # (high to low)', field: 'itemNumber', dir: 'desc' },
  TITLE_ASC: { label: 'Name (A-Z)', field: 'title', dir: 'asc' },
  BID_DESC: { label: 'Current Bid (high to low)', field: 'currentBid', dir: 'desc' },
  BID_ASC: { label: 'Current Bid (low to high)', field: 'currentBid', dir: 'asc' },
  VALUE_DESC: { label: 'Value (high to low)', field: 'estimatedValue', dir: 'desc' },
}

export const DEFAULT_BID_INCREMENT = 5

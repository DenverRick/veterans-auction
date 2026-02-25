# Hilltop Veterans Club — Silent Auction

A real-time silent auction web app for the **Hilltop Veterans Club** event on **March 29, 2026**. Bidders browse items and place bids from their phones, while admins manage items and control the auction flow from a dedicated dashboard.

**Live:** https://hilltop-veterans-auction.web.app

## Features

### For Bidders
- **Browse catalog** of auction items with photos, descriptions, and current bids
- **Search, filter, and sort** items by name, category, bid amount, or item number
- **Self-service registration** — tap "Place Bid" to sign up with name, phone, and email
- **Real-time updates** — see bids change instantly across all connected devices
- **"My Bid" indicator** — green checkmark on catalog cards when you're the high bidder
- **Status banner** — clear messaging: "Bidding has not started" / "Bidding is open!" / "Bidding has ended"

### For Admins
- **Item Management** (`/admin`) — add, edit, delete items with photo upload and CSV bulk import
- **Auction Day Command Center** (`/admin/auction-day`) — live clock, start/close bidding, real-time stats, winners table
- **QR Code Flyer** (`/admin/qr`) — printable flyer with QR code linking to the auction site
- **Reset Auction** — wipe all bids, bidders, and history for fresh testing (requires typing RESET to confirm)

### Display Modes
- **TV Display** (`/tv`) — full-screen dark theme for projector/TV with auto-scrolling items and live bid ticker
- **Kiosk Mode** (`/kiosk`) — tablet-friendly interface for on-site guests; auto-resets after 30 seconds of inactivity

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7 |
| Styling | Tailwind CSS 4 |
| Build | Vite 7 |
| Database | Firebase Realtime Database |
| Storage | Firebase Storage (item photos) |
| Hosting | Firebase Hosting |
| QR Codes | qrcode.react |
| CSV Import | PapaParse |

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project ([create one here](https://console.firebase.google.com))

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/DenverRick/veterans-auction.git
   cd veterans-auction
   npm install
   ```

2. **Configure Firebase**

   Create a `.env.local` file in the project root:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

   In the Firebase console, enable:
   - **Realtime Database** (start in test mode)
   - **Storage** (start in test mode)
   - **Hosting**

3. **Run locally**
   ```bash
   npm run dev
   ```

### Deploy

```bash
npm run build
npx firebase-tools deploy --only hosting
```

## Project Structure

```
src/
├── main.jsx                          # Router setup (11 routes)
├── App.jsx                           # Layout shell (Header, StatusBanner, Outlet, Footer)
├── firebase.js                       # Firebase initialization
├── index.css                         # Tailwind imports + custom animations
│
├── context/
│   ├── AuctionContext.jsx             # Real-time items + auction status
│   ├── BidderContext.jsx              # Bidder registration + localStorage
│   └── KioskContext.jsx               # Kiosk mode (idle timeout, session reset)
│
├── lib/
│   ├── db.js                          # Firebase read/write helpers
│   ├── storage.js                     # Photo upload with client-side resize
│   ├── csv.js                         # CSV parsing + validation
│   └── constants.js                   # Categories, statuses, sort options
│
├── pages/
│   ├── CatalogPage.jsx                # Public item grid with search/filter/sort
│   ├── ItemDetailPage.jsx             # Item detail + bid form
│   ├── TVDisplayPage.jsx              # Projector/TV display mode
│   ├── KioskLanding.jsx               # "Tap to Start" kiosk screen
│   ├── KioskLayout.jsx                # Kiosk wrapper with session management
│   ├── AdminLoginPage.jsx             # Password-protected admin gate
│   ├── AdminDashboard.jsx             # Item management hub
│   ├── AdminItemForm.jsx              # Add/edit/delete items
│   ├── AdminBulkImport.jsx            # CSV bulk import
│   ├── AdminQRCode.jsx                # Printable QR code flyer
│   └── AuctionDayPage.jsx             # Auction day command center
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx                 # App header with status badge
│   │   ├── Footer.jsx                 # Footer with charity link
│   │   └── StatusBanner.jsx           # Bidder-facing auction status bar
│   ├── catalog/
│   │   ├── ItemCard.jsx               # Catalog card (Value, My Bid, Current Bid)
│   │   ├── ItemGrid.jsx               # Responsive grid container
│   │   ├── SearchBar.jsx
│   │   ├── CategoryFilter.jsx
│   │   └── SortSelect.jsx
│   ├── bidding/
│   │   ├── BidForm.jsx                # Bid placement with quick-increment buttons
│   │   └── RegisterModal.jsx          # Bidder registration popup
│   ├── bids/
│   │   ├── BidBadge.jsx               # Current bid display badge
│   │   └── BidTicker.jsx              # Scrolling recent bids (TV mode)
│   ├── admin/
│   │   ├── ProtectedRoute.jsx         # Admin password gate
│   │   ├── PhotoUpload.jsx            # Image upload + preview
│   │   ├── CSVUploader.jsx            # Drag-and-drop CSV handler
│   │   └── WinnersTable.jsx           # Winning bids display
│   └── shared/
│       └── Clock.jsx                  # Live clock (reused across pages)
│
└── hooks/
    └── useAdmin.js                    # Admin authentication state
```

## Database Schema

```
items/{item_id}/
  itemNumber, title, description, category, photoURL,
  estimatedValue, minimumBid, bidIncrement,
  currentBid, currentBidderNumber, currentBidderName,
  bidCount, lastBidTime, donor, active

auction/
  status: "preview" | "open" | "closed"
  title, date, nextBidderNumber

bidders/{bidder_id}/
  bidderNumber, firstName, lastInitial, phone, email, registeredAt

bidHistory/{item_id}/{bid_id}/
  amount, timestamp, bidderNumber, bidderDisplayName, source

recentBids/{bid_id}/
  itemId, itemTitle, itemNumber, amount, timestamp,
  bidderNumber, bidderDisplayName, source
```

## Admin Access

Navigate to `/admin` and enter the volunteer password: `HilltopVets2026`

## Auction Day Workflow

1. **Before the event** — Add items via admin dashboard (single or CSV bulk import), upload photos
2. **Event setup** — Print QR code flyers, set up TV display (`/tv`), optionally set up a kiosk tablet (`/kiosk`)
3. **Start bidding** — Admin goes to Auction Day page and clicks "Start Bidding"
4. **During auction** — Monitor live stats, bidder count, and total bid value
5. **Close bidding** — Click "Close Bidding" — winners table appears automatically
6. **After event** — Use "Reset Entire Auction" to clear all data for next time

## Color Theme

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#1a2744` | Headers, text, badges |
| Gold | `#c5a44e` | Accents, buttons, bid amounts |
| Cream | `#faf8f0` | Page backgrounds |

## License

Private project for the Hilltop Veterans Club.

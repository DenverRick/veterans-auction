import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuctionProvider } from './context/AuctionContext'
import { BidderProvider } from './context/BidderContext'
import CatalogPage from './pages/CatalogPage'
import ItemDetailPage from './pages/ItemDetailPage'
import TVDisplayPage from './pages/TVDisplayPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminItemForm from './pages/AdminItemForm'
import AdminBulkImport from './pages/AdminBulkImport'
import AdminQRCode from './pages/AdminQRCode'
import ProtectedRoute from './components/admin/ProtectedRoute'
import KioskLayout from './pages/KioskLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'item/:id', element: <ItemDetailPage /> },
      { path: 'admin/login', element: <AdminLoginPage /> },
      {
        path: 'admin',
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
      },
      {
        path: 'admin/items/new',
        element: <ProtectedRoute><AdminItemForm /></ProtectedRoute>,
      },
      {
        path: 'admin/items/:id',
        element: <ProtectedRoute><AdminItemForm /></ProtectedRoute>,
      },
      {
        path: 'admin/import',
        element: <ProtectedRoute><AdminBulkImport /></ProtectedRoute>,
      },
      {
        path: 'admin/qr',
        element: <ProtectedRoute><AdminQRCode /></ProtectedRoute>,
      },
    ],
  },
  {
    path: '/tv',
    element: <TVDisplayPage />,
  },
  {
    path: '/kiosk',
    element: <KioskLayout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'item/:id', element: <ItemDetailPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuctionProvider>
      <BidderProvider>
        <RouterProvider router={router} />
      </BidderProvider>
    </AuctionProvider>
  </StrictMode>,
)

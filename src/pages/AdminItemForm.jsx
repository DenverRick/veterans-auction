import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuction } from '../context/AuctionContext'
import { saveItem, updateItem, deleteItem } from '../lib/db'
import { uploadItemPhoto } from '../lib/storage'
import { CATEGORIES, DEFAULT_BID_INCREMENT } from '../lib/constants'
import PhotoUpload from '../components/admin/PhotoUpload'

const emptyItem = {
  itemNumber: '',
  title: '',
  description: '',
  category: 'other',
  estimatedValue: '',
  minimumBid: '',
  bidIncrement: DEFAULT_BID_INCREMENT,
  donor: '',
  photoURL: '',
  photoPath: '',
}

export default function AdminItemForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { items } = useAuction()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyItem)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      const existing = items.find((i) => i.id === id)
      if (existing) {
        setForm({
          itemNumber: existing.itemNumber || '',
          title: existing.title || '',
          description: existing.description || '',
          category: existing.category || 'other',
          estimatedValue: existing.estimatedValue || '',
          minimumBid: existing.minimumBid || '',
          bidIncrement: existing.bidIncrement || DEFAULT_BID_INCREMENT,
          donor: existing.donor || '',
          photoURL: existing.photoURL || '',
          photoPath: existing.photoPath || '',
        })
      }
    }
  }, [id, isEdit, items])

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handlePhotoUpload(file) {
    const itemId = id || `item_${String(form.itemNumber).padStart(3, '0')}`
    const { url, path } = await uploadItemPhoto(itemId, file)
    setForm((prev) => ({ ...prev, photoURL: url, photoPath: path }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.itemNumber || !form.title) {
      setError('Item number and title are required')
      return
    }

    setSaving(true)
    try {
      const itemId = id || `item_${String(form.itemNumber).padStart(3, '0')}`
      const data = {
        ...form,
        itemNumber: parseInt(form.itemNumber, 10),
        estimatedValue: parseFloat(form.estimatedValue) || 0,
        minimumBid: parseFloat(form.minimumBid) || 0,
        bidIncrement: parseFloat(form.bidIncrement) || DEFAULT_BID_INCREMENT,
        active: true,
      }

      if (isEdit) {
        await updateItem(itemId, data)
      } else {
        data.currentBid = null
        data.bidCount = 0
        data.lastBidTime = null
        await saveItem(itemId, data)
      }

      navigate('/admin')
    } catch (err) {
      setError('Failed to save item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/admin" className="text-gold hover:text-gold-light text-sm mb-4 inline-block no-underline">
        &larr; Dashboard
      </Link>
      <h2 className="text-xl font-bold text-navy mb-6">
        {isEdit ? 'Edit Item' : 'Add New Item'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <PhotoUpload currentUrl={form.photoURL} onUpload={handlePhotoUpload} onUploadingChange={setUploading} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item #</label>
            <input
              type="number"
              value={form.itemNumber}
              onChange={(e) => handleChange('itemNumber', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm bg-white"
            >
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Donor</label>
          <input
            type="text"
            value={form.donor}
            onChange={(e) => handleChange('donor', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
            <input
              type="number"
              value={form.estimatedValue}
              onChange={(e) => handleChange('estimatedValue', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Bid ($)</label>
            <input
              type="number"
              value={form.minimumBid}
              onChange={(e) => handleChange('minimumBid', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Increment ($)</label>
            <input
              type="number"
              value={form.bidIncrement}
              onChange={(e) => handleChange('bidIncrement', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-gold outline-none text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving || uploading || deleting}
          className="w-full bg-navy text-gold font-bold py-3 rounded-lg hover:bg-navy-light disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : uploading ? 'Uploading photo...' : isEdit ? 'Update Item' : 'Add Item'}
        </button>

        {isEdit && (
          <button
            type="button"
            disabled={saving || deleting}
            onClick={async () => {
              if (!window.confirm(`Delete "${form.title}"? This cannot be undone.`)) return
              setDeleting(true)
              try {
                await deleteItem(id)
                navigate('/admin')
              } catch (err) {
                setError('Failed to delete item')
                setDeleting(false)
              }
            }}
            className="w-full mt-2 bg-white text-red-600 font-bold py-3 rounded-lg border border-red-300 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete Item'}
          </button>
        )}
      </form>
    </div>
  )
}

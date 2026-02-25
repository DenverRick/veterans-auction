import { useState } from 'react'
import { Link } from 'react-router-dom'
import { parseItemsCSV, validateItems } from '../lib/csv'
import { importItems } from '../lib/db'
import { CATEGORIES } from '../lib/constants'

export default function AdminBulkImport() {
  const [parsed, setParsed] = useState(null)
  const [errors, setErrors] = useState([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setErrors([])
    setDone(false)
    try {
      const data = await parseItemsCSV(file)
      const validationErrors = validateItems(data)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
      }
      setParsed(data)
    } catch (err) {
      setErrors(Array.isArray(err) ? err.map((e) => e.message) : [String(err)])
    }
  }

  async function handleImport() {
    if (!parsed) return
    setImporting(true)
    try {
      const items = parsed.map((row) => ({
        itemNumber: parseInt(row.itemNumber, 10),
        title: row.title || '',
        description: row.description || '',
        category: row.category && CATEGORIES[row.category] ? row.category : 'other',
        estimatedValue: parseFloat(row.estimatedValue) || 0,
        minimumBid: parseFloat(row.minimumBid) || 0,
        bidIncrement: parseFloat(row.bidIncrement) || 5,
        donor: row.donor || '',
        photoURL: row.photoURL || '',
        photoPath: '',
      }))
      await importItems(items)
      setDone(true)
    } catch (err) {
      setErrors(['Import failed: ' + String(err)])
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/admin" className="text-gold hover:text-gold-light text-sm mb-4 inline-block no-underline">
        &larr; Dashboard
      </Link>
      <h2 className="text-xl font-bold text-navy mb-4">Import Items from CSV</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV file with columns:{' '}
          <code className="text-xs bg-gray-100 px-1 rounded">
            itemNumber, title, description, category, minimumBid, bidIncrement, estimatedValue, donor
          </code>
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Valid categories: {Object.keys(CATEGORIES).join(', ')}
        </p>
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-navy file:text-gold file:font-medium hover:file:bg-navy-light file:cursor-pointer"
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-red-700 text-sm mb-2">Validation Errors</h3>
          <ul className="text-sm text-red-600 list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{typeof err === 'string' ? err : err.message}</li>
            ))}
          </ul>
        </div>
      )}

      {parsed && (
        <>
          <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-navy text-gold">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-right">Value</th>
                    <th className="px-3 py-2 text-right">Min Bid</th>
                    <th className="px-3 py-2 text-left">Donor</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono">{row.itemNumber}</td>
                      <td className="px-3 py-2">{row.title}</td>
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2 text-right">${row.estimatedValue}</td>
                      <td className="px-3 py-2 text-right">${row.minimumBid}</td>
                      <td className="px-3 py-2">{row.donor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {done ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-bold">
                Successfully imported {parsed.length} items!
              </p>
              <Link to="/admin" className="text-gold hover:text-gold-light text-sm mt-2 inline-block">
                Back to Dashboard
              </Link>
            </div>
          ) : (
            <button
              onClick={handleImport}
              disabled={importing || errors.length > 0}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {importing ? 'Importing...' : `Import ${parsed.length} Items`}
            </button>
          )}
        </>
      )}
    </div>
  )
}

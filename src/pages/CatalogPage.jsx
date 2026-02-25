import { useState, useMemo } from 'react'
import { useAuction } from '../context/AuctionContext'
import ItemGrid from '../components/catalog/ItemGrid'
import SearchBar from '../components/catalog/SearchBar'
import CategoryFilter from '../components/catalog/CategoryFilter'
import SortSelect from '../components/catalog/SortSelect'
import { SORT_OPTIONS } from '../lib/constants'

export default function CatalogPage() {
  const { items, loading } = useAuction()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)
  const [sortKey, setSortKey] = useState('NUMBER_ASC')

  const filtered = useMemo(() => {
    let result = items.filter((item) => item.active !== false)

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.donor?.toLowerCase().includes(q) ||
          String(item.itemNumber) === q
      )
    }

    if (category) {
      result = result.filter((item) => item.category === category)
    }

    const sort = SORT_OPTIONS[sortKey]
    result.sort((a, b) => {
      const aVal = a[sort.field] ?? 0
      const bVal = b[sort.field] ?? 0
      if (typeof aVal === 'string') {
        return sort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sort.dir === 'asc' ? aVal - bVal : bVal - aVal
    })

    return result
  }, [items, search, category, sortKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500 text-lg">Loading auction items...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy mb-4">Auction Items</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} />
          <SortSelect value={sortKey} onChange={setSortKey} />
        </div>
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length} items</p>
      <ItemGrid items={filtered} />
    </div>
  )
}

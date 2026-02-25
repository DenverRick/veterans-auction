import { CATEGORIES } from '../../lib/constants'

export default function CategoryFilter({ selected, onChange }) {
  const categories = Object.entries(CATEGORIES).sort((a, b) => a[1].order - b[1].order)

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          !selected
            ? 'bg-navy text-gold'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      {categories.map(([key, cat]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selected === key
              ? 'bg-navy text-gold'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

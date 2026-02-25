export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search items..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm"
    />
  )
}

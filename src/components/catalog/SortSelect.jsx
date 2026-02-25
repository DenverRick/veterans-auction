import { SORT_OPTIONS } from '../../lib/constants'

export default function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:border-gold outline-none"
    >
      {Object.entries(SORT_OPTIONS).map(([key, opt]) => (
        <option key={key} value={key}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

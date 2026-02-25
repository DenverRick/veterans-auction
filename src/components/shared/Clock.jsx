import { useEffect, useState } from 'react'

export default function Clock({ showSeconds = false, className = '' }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const format = showSeconds
    ? { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    : { hour: '2-digit', minute: '2-digit' }

  return (
    <span className={`font-mono ${className}`}>
      {time.toLocaleTimeString([], format)}
    </span>
  )
}

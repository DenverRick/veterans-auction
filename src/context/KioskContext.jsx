import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const KioskContext = createContext(null)
const IDLE_TIMEOUT = 30000 // 30 seconds

export function KioskProvider({ children }) {
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef(null)
  const onResetRef = useRef(null)

  const registerResetCallback = useCallback((fn) => {
    onResetRef.current = fn
  }, [])

  const resetSession = useCallback(() => {
    clearTimeout(timerRef.current)
    onResetRef.current?.()
    setIsActive(false)
  }, [])

  function resetIdleTimer() {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      resetSession()
    }, IDLE_TIMEOUT)
  }

  const startSession = useCallback(() => {
    setIsActive(true)
  }, [])

  // Start idle timer when session becomes active
  useEffect(() => {
    if (!isActive) return

    resetIdleTimer()

    const events = ['touchstart', 'mousedown', 'scroll', 'keydown']
    const handler = () => resetIdleTimer()
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }))

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler))
      clearTimeout(timerRef.current)
    }
  }, [isActive])

  return (
    <KioskContext.Provider value={{ isKiosk: true, isActive, startSession, resetSession, registerResetCallback }}>
      {children}
    </KioskContext.Provider>
  )
}

export function useKiosk() {
  const ctx = useContext(KioskContext)
  return ctx || { isKiosk: false, isActive: true, startSession: () => {}, resetSession: () => {}, registerResetCallback: () => {} }
}

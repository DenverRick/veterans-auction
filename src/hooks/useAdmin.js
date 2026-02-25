import { useState, useCallback } from 'react'

const ADMIN_KEY = 'auction_admin_auth'

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(ADMIN_KEY) === 'true'
  })

  const login = useCallback(async (password, storedHash) => {
    const hash = await sha256(password)
    if (hash === storedHash) {
      sessionStorage.setItem(ADMIN_KEY, 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }, [])

  return { isAdmin, login, logout }
}

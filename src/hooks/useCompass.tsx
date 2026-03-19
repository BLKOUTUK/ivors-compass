import { createContext, useContext, useState, type ReactNode } from 'react'

interface CompassState {
  isUnlocked: boolean
  accessCode: string | null
  unlock: (code: string) => void
  lock: () => void
}

const CompassContext = createContext<CompassState | null>(null)

const STORAGE_KEY = 'ivors-compass-code'

export function CompassProvider({ children }: { children: ReactNode }) {
  const [accessCode, setAccessCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })

  const isUnlocked = !!accessCode

  const unlock = (code: string) => {
    setAccessCode(code)
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      // Private browsing — still works in memory
    }
  }

  const lock = () => {
    setAccessCode(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  return (
    <CompassContext.Provider value={{ isUnlocked, accessCode, unlock, lock }}>
      {children}
    </CompassContext.Provider>
  )
}

export function useCompass() {
  const ctx = useContext(CompassContext)
  if (!ctx) throw new Error('useCompass must be used within CompassProvider')
  return ctx
}

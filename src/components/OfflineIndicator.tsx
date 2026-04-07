import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOffline = () => setOffline(true)
    const handleOnline = () => setOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      className="bg-compass-dark border border-gold/20 text-gold/70 text-xs text-center py-2 px-4"
      role="status"
      aria-live="polite"
    >
      You're offline — journal and mood entries are saved on this device
    </div>
  )
}

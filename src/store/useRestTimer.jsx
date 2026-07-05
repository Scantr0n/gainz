/* eslint-disable react-refresh/only-export-components -- store file intentionally exports hook + provider together */
import { useState, useCallback, createContext, useContext } from 'react'

const RestTimerContext = createContext(null)

export function RestTimerProvider({ children }) {
  const [restEndAt, setRestEndAt] = useState(null)
  const [restSeconds, setRestSeconds] = useState(90)

  const startRest = useCallback((seconds = 90) => {
    setRestSeconds(seconds)
    setRestEndAt(Date.now() + seconds * 1000)
  }, [])

  const adjustRest = useCallback((deltaSeconds) => {
    setRestEndAt(prev => (prev ? Math.max(Date.now(), prev + deltaSeconds * 1000) : prev))
  }, [])

  const skipRest = useCallback(() => setRestEndAt(null), [])

  return (
    <RestTimerContext.Provider value={{ restEndAt, restSeconds, startRest, adjustRest, skipRest }}>
      {children}
    </RestTimerContext.Provider>
  )
}

export function useRestTimer() {
  return useContext(RestTimerContext)
}

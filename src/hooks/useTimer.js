import { useEffect } from 'react'
import useGameState from './useGameState'

// Custom hook to manage the game timer
export const useTimer = () => {
  const updateTimer = useGameState(state => state.updateTimer)
  const timerActive = useGameState(state => state.timerActive)

  useEffect(() => {
    if (!timerActive) return

    const interval = setInterval(() => {
      updateTimer()
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, updateTimer])
}

export default useTimer

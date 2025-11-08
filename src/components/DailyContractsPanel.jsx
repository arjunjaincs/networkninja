import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Trophy, Clock, CheckCircle, X, Star, Coins } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { DAILY_CONTRACTS, checkDailyContract, getDailyContracts } from '../data/metaProgression'

export default function DailyContractsPanel({ onClose }) {
  const [contracts, setContracts] = useState([])
  const [completedContracts, setCompletedContracts] = useState([])
  const gameState = useGameState()
  const addCredits = useGameState(state => state.addCredits)
  const addReputation = useGameState(state => state.addReputation)

  // Load daily contracts on mount
  useEffect(() => {
    const dailyContracts = getDailyContracts()
    setContracts(dailyContracts)
    
    // Load completed contracts from localStorage
    const today = new Date().toDateString()
    const saved = localStorage.getItem(`dailyContracts_${today}`)
    if (saved) {
      setCompletedContracts(JSON.parse(saved))
    }
  }, [])

  // Check contract completion
  useEffect(() => {
    if (gameState.gameState === 'complete' || gameState.gameState === 'gameover') {
      contracts.forEach(contract => {
        if (!completedContracts.includes(contract.id)) {
          const isComplete = checkDailyContract(contract, gameState)
          if (isComplete) {
            completeContract(contract)
          }
        }
      })
    }
  }, [gameState.gameState, contracts, completedContracts])

  const completeContract = (contract) => {
    const newCompleted = [...completedContracts, contract.id]
    setCompletedContracts(newCompleted)
    
    // Save to localStorage
    const today = new Date().toDateString()
    localStorage.setItem(`dailyContracts_${today}`, JSON.stringify(newCompleted))
    
    // Award rewards
    addCredits(contract.reward.credits)
    addReputation(contract.reward.reputation)
    
    // Show completion notification
    // This could trigger a toast notification system
  }

  const getTimeUntilReset = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const diff = tomorrow - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}h ${minutes}m`
  }

  const getContractProgress = (contract) => {
    if (completedContracts.includes(contract.id)) {
      return { completed: true, progress: 100 }
    }

    // Calculate progress based on current game state
    switch (contract.id) {
      case 'speed_run':
        if (gameState.timeRemaining && gameState.levelData) {
          const timeUsed = gameState.levelData.timeLimit - gameState.timeRemaining
          const targetTime = 600 // 10 minutes
          const progress = Math.min(100, (targetTime - timeUsed) / targetTime * 100)
          return { completed: false, progress: Math.max(0, progress) }
        }
        break
      case 'ghost':
        const visibilityProgress = Math.max(0, (30 - gameState.visibility) / 30 * 100)
        return { completed: false, progress: visibilityProgress }
      case 'perfect_run':
        let objectivesComplete = 0
        if (gameState.objectives.primary) objectivesComplete++
        if (gameState.objectives.secondary) objectivesComplete++
        if (gameState.objectives.tertiary) objectivesComplete++
        return { completed: false, progress: (objectivesComplete / 3) * 100 }
      case 'explorer':
        if (gameState.network && gameState.discoveredNodes) {
          const progress = (gameState.discoveredNodes.length / gameState.network.nodes.length) * 100
          return { completed: false, progress }
        }
        break
      case 'survivor':
        const waveProgress = Math.min(100, (gameState.endlessWave / 5) * 100)
        return { completed: false, progress: waveProgress }
    }
    
    return { completed: false, progress: 0 }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-300">Daily Contracts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Reset Timer */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">Resets in:</span>
            </div>
            <span className="text-yellow-300 font-mono text-lg">
              {getTimeUntilReset()}
            </span>
          </div>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.map((contract, index) => {
            const progress = getContractProgress(contract)
            const isCompleted = progress.completed

            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isCompleted 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-gray-600 bg-gray-800/50 hover:border-cyan-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Contract Icon */}
                  <div className={`text-3xl p-2 rounded-lg ${
                    isCompleted ? 'bg-green-500/20' : 'bg-gray-700/50'
                  }`}>
                    {isCompleted ? '✅' : contract.icon}
                  </div>

                  {/* Contract Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-bold ${
                        isCompleted ? 'text-green-300' : 'text-cyan-300'
                      }`}>
                        {contract.name}
                      </h3>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-3">
                      {contract.description}
                    </p>

                    {/* Progress Bar */}
                    {!isCompleted && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-cyan-400">{Math.round(progress.progress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-300 font-bold">
                          {contract.reward.credits}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 font-bold">
                          {contract.reward.reputation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">
                Completed: {completedContracts.length}/{contracts.length}
              </span>
            </div>
            {completedContracts.length === contracts.length && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400 font-bold"
              >
                🎉 All Complete!
              </motion.div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 text-sm text-gray-400">
          💡 <strong>Tip:</strong> Contracts are checked when you complete or fail a mission. 
          Progress is tracked across all game modes!
        </div>
      </motion.div>
    </motion.div>
  )
}
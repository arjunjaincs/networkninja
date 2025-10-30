import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function GameOverScreen({ onRetry, onMainMenu }) {
  const levelData = useGameState(state => state.levelData)
  const visibility = useGameState(state => state.visibility)
  const actionLog = useGameState(state => state.actionLog)

  const lastAction = actionLog[0]

  return (
    <div className="min-h-screen bg-cyber-dark scan-lines flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Alert Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="inline-block mb-6"
        >
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(255, 0, 85, 0.5)',
                '0 0 40px rgba(255, 0, 85, 0.8)',
                '0 0 20px rgba(255, 0, 85, 0.5)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-full"
          >
            <AlertTriangle className="w-32 h-32 text-cyber-red" />
          </motion.div>
        </motion.div>

        {/* Game Over Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-heading font-bold text-cyber-red mb-4"
        >
          DETECTED
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-gray-400 mb-8"
        >
          Security systems have locked you out
        </motion.p>

        {/* Failure Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 border-2 border-red-500/50 rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-heading font-bold text-red-400 mb-4">Mission Failed</h2>
          
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Level</span>
              <span className="text-gray-200">{levelData?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Final Visibility</span>
              <span className="text-red-400 font-bold">{visibility}%</span>
            </div>
            {lastAction && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Last Action</span>
                <span className="text-gray-200">{lastAction.action}</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-sm text-red-300">
              💡 <strong>Tip:</strong> Use stealth actions like "Clear Logs" and "Cover Tracks" 
              to reduce visibility. Avoid loud actions like "Brute Force" unless necessary.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="px-8 py-4 bg-cyber-cyan text-cyber-dark font-heading font-bold text-lg rounded-lg glow-cyan hover:bg-cyan-400 transition-colors inline-flex items-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Mission
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMainMenu}
            className="px-8 py-4 bg-gray-800 text-gray-200 font-heading font-bold text-lg rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors inline-flex items-center gap-3"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

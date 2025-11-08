import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Eye } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function AIThreatMeter() {
  const aiDefender = useGameState(state => state.aiDefender)
  const visibility = useGameState(state => state.visibility)

  const getThreatLevel = () => {
    if (aiDefender.adaptationLevel < 30) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500' }
    if (aiDefender.adaptationLevel < 60) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500' }
    if (aiDefender.adaptationLevel < 90) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500' }
    return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500' }
  }

  const threat = getThreatLevel()
  const recentCountermeasures = aiDefender.getRecentCountermeasures()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/95 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-5 h-5 text-red-400" />
        <span className="text-sm font-bold text-red-400">AI THREAT LEVEL</span>
        {visibility >= 80 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </motion.div>
        )}
      </div>

      {/* Threat Level Bar */}
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-2 border border-gray-700">
        <motion.div
          className={`h-full ${threat.bg} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${aiDefender.adaptationLevel}%` }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated pulse effect for high threat */}
          {aiDefender.adaptationLevel >= 60 && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      </div>

      {/* Threat Info */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-gray-400">{aiDefender.adaptationLevel}% Adapted</span>
        <span className={`font-bold ${threat.color}`}>{threat.level}</span>
      </div>

      {/* AI Status Indicators */}
      <div className="space-y-1 text-xs">
        {/* Learning Rate */}
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Learning Rate:</span>
          <span className="text-cyan-400">
            {aiDefender.playerPatterns.actionHistory.length}/20
          </span>
        </div>

        {/* Honeypots */}
        {aiDefender.honeypots.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Traps:</span>
            <span className="text-yellow-400">🍯 {aiDefender.honeypots.length}</span>
          </div>
        )}

        {/* Recent Countermeasures */}
        {recentCountermeasures.length > 0 && (
          <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded">
            <div className="flex items-center gap-1 mb-1">
              <Eye className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-xs">ACTIVE COUNTERMEASURES</span>
            </div>
            {recentCountermeasures.slice(0, 2).map((countermeasure, index) => (
              <div key={index} className="text-xs text-yellow-300">
                • {countermeasure.effect}
              </div>
            ))}
            {recentCountermeasures.length > 2 && (
              <div className="text-xs text-yellow-400">
                +{recentCountermeasures.length - 2} more...
              </div>
            )}
          </div>
        )}

        {/* Adaptation Warnings */}
        {aiDefender.adaptationLevel >= 70 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded"
          >
            <div className="text-red-400 font-bold text-xs mb-1">⚠️ HIGH ADAPTATION</div>
            <div className="text-red-300 text-xs">
              AI is learning your patterns. Vary your tactics!
            </div>
          </motion.div>
        )}
      </div>

      {/* Most Used Action Warning */}
      {aiDefender.playerPatterns.actionHistory.length >= 5 && (
        <div className="mt-2 text-xs">
          <div className="text-gray-400">Most Used:</div>
          <div className="text-orange-400 font-mono">
            {aiDefender.getMostUsedAction() || 'None'}
          </div>
        </div>
      )}
    </motion.div>
  )
}

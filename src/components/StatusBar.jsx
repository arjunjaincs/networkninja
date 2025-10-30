import { motion } from 'framer-motion'
import { Clock, Eye, Volume2, AlertCircle } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { formatTime } from '../data/levels'
import { getAlertStatusColor, getAlertStatusText } from '../utils/detection'

export default function StatusBar() {
  const visibility = useGameState(state => state.visibility)
  const alertStatus = useGameState(state => state.alertStatus)
  const timeRemaining = useGameState(state => state.timeRemaining)
  const levelData = useGameState(state => state.levelData)

  if (!levelData) return null

  const timeWarning = timeRemaining <= 300 // 5 minutes
  const timeCritical = timeRemaining <= 60 // 1 minute

  const getVisibilityColor = () => {
    if (visibility < 30) return 'bg-cyber-green'
    if (visibility < 60) return 'bg-cyber-yellow'
    if (visibility < 90) return 'bg-orange-500'
    return 'bg-cyber-red'
  }

  return (
    <div className="bg-gray-900/80 border-b border-cyan-500/30 p-4">
      <div className="flex items-center justify-between gap-6">
        {/* Timer */}
        <div className="flex items-center gap-3">
          <Clock className={`w-5 h-5 ${timeCritical ? 'text-cyber-red' : timeWarning ? 'text-cyber-yellow' : 'text-cyan-400'}`} />
          <div>
            <div className="text-xs text-gray-400">Time Remaining</div>
            <motion.div 
              className={`text-xl font-mono font-bold ${
                timeCritical ? 'text-cyber-red' : timeWarning ? 'text-cyber-yellow' : 'text-cyan-300'
              }`}
              animate={timeCritical ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {formatTime(timeRemaining)}
            </motion.div>
          </div>
        </div>

        {/* Visibility Meter */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Visibility</span>
            <span className="text-xs font-bold text-cyan-300 ml-auto">{visibility}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <motion.div
              className={`h-full ${getVisibilityColor()} transition-colors duration-300`}
              initial={{ width: 0 }}
              animate={{ width: `${visibility}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Noise Level */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-xs text-gray-400">Noise Level</div>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-6 rounded-sm ${
                    i < Math.floor(visibility / 20) ? getVisibilityColor() : 'bg-gray-700'
                  }`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: i < Math.floor(visibility / 20) ? 1 : 0.3 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Alert Status */}
        <div className="flex items-center gap-3">
          <AlertCircle className={`w-5 h-5 ${
            alertStatus === 'critical' ? 'text-cyber-red' : 
            alertStatus === 'high' ? 'text-orange-500' :
            alertStatus === 'suspicious' ? 'text-cyber-yellow' : 
            'text-cyber-green'
          }`} />
          <div>
            <div className="text-xs text-gray-400">Alert Status</div>
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-bold ${getAlertStatusColor(alertStatus)} text-gray-900 mt-1`}
              animate={alertStatus === 'critical' ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {getAlertStatusText(alertStatus)}
            </motion.div>
          </div>
        </div>

        {/* Level Info */}
        <div className="text-right">
          <div className="text-xs text-gray-400">Level {levelData.id}</div>
          <div className="text-sm font-bold text-cyan-300">{levelData.name}</div>
        </div>
      </div>
    </div>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, Target, Unplug, Clock } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function CounterHackPanel() {
  const counterHack = useGameState(state => state.counterHack)
  const deployCountermeasures = useGameState(state => state.deployCountermeasures)
  const disconnectFromTrace = useGameState(state => state.disconnectFromTrace)
  const attemptCounterTrace = useGameState(state => state.attemptCounterTrace)

  const status = counterHack.getStatus()

  if (!status.active) return null

  const getProgressColor = () => {
    if (status.progress < 30) return 'from-yellow-500 via-orange-500 to-red-500'
    if (status.progress < 60) return 'from-orange-500 via-red-500 to-red-600'
    return 'from-red-500 via-red-600 to-red-700'
  }

  const getUrgencyLevel = () => {
    if (status.progress < 30) return 'warning'
    if (status.progress < 70) return 'danger'
    return 'critical'
  }

  const urgency = getUrgencyLevel()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        className="fixed top-32 right-4 z-50 bg-red-900/95 border-2 border-red-500 rounded-lg p-4 backdrop-blur-sm max-w-sm shadow-2xl shadow-red-500/50"
      >
        {/* Header with pulsing alert */}
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            animate={{ 
              scale: urgency === 'critical' ? [1, 1.3, 1] : [1, 1.1, 1],
              rotate: urgency === 'critical' ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: urgency === 'critical' ? 0.5 : 1, 
              repeat: Infinity 
            }}
          >
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-300 mb-1">
              ⚠️ INCOMING TRACE!
            </h3>
            <p className="text-sm text-red-200">
              Sysadmin is tracing your connection!
            </p>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-3">
          <motion.div
            animate={{ 
              scale: status.timeRemaining <= 10 ? [1, 1.2, 1] : 1,
              color: status.timeRemaining <= 10 ? ['#ef4444', '#dc2626', '#ef4444'] : '#ef4444'
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-3xl font-bold text-red-400 font-mono"
          >
            <Clock className="w-6 h-6 inline mr-2" />
            {status.timeRemaining}s
          </motion.div>
          <div className="text-xs text-red-300 mt-1">
            {status.progress < 50 ? 'Tracing in progress...' : 
             status.progress < 80 ? 'Trace nearly complete!' : 
             'TRACE ALMOST DONE!'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-red-950 rounded-full overflow-hidden mb-4 border border-red-700">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} relative`}
            animate={{ width: `${status.progress}%` }}
            transition={{ duration: 0.1 }}
          >
            {/* Animated danger pulse */}
            {status.progress >= 70 && (
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            )}
            
            {/* Progress indicator */}
            <motion.div
              className="absolute right-1 top-0 bottom-0 w-1 bg-white/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Progress Percentage */}
        <div className="text-center mb-4">
          <span className="text-red-300 font-bold text-lg">
            {Math.round(status.progress)}% Complete
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Countermeasures */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={deployCountermeasures}
            disabled={status.countermeasuresRemaining === 0}
            className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Deploy Countermeasures ({status.countermeasuresRemaining})
          </motion.button>

          {/* Counter-Trace */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={attemptCounterTrace}
            disabled={!status.canCounterTrace}
            className="w-full px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            Counter-Trace
            {!status.canCounterTrace && status.progress >= 50 && (
              <span className="text-xs">(Too Late!)</span>
            )}
          </motion.button>

          {/* Emergency Disconnect */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={disconnectFromTrace}
            className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Unplug className="w-4 h-4" />
            Emergency Disconnect
          </motion.button>
        </div>

        {/* Warning Messages */}
        <div className="mt-3 space-y-1 text-xs">
          {status.progress >= 80 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 bg-red-800/50 border border-red-600 rounded text-red-200"
            >
              🚨 CRITICAL: Trace almost complete!
            </motion.div>
          )}
          
          {status.countermeasuresRemaining === 0 && (
            <div className="p-2 bg-yellow-800/50 border border-yellow-600 rounded text-yellow-200">
              ⚠️ No countermeasures remaining
            </div>
          )}

          {!status.canCounterTrace && status.progress < 50 && (
            <div className="p-2 bg-blue-800/50 border border-blue-600 rounded text-blue-200">
              💡 Counter-trace available while trace &lt; 50%
            </div>
          )}
        </div>

        {/* Speed Indicator */}
        <div className="mt-2 text-xs text-red-300">
          <div className="flex justify-between">
            <span>Trace Speed:</span>
            <span className="font-mono">
              {status.speed.toFixed(1)}x
              {status.speed < 1 && <span className="text-green-400"> (Slowed)</span>}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

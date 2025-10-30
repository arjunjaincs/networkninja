import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, CheckCircle, XCircle } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function ActionLog() {
  const actionLog = useGameState(state => state.actionLog)

  return (
    <div className="bg-gray-900/80 border-t border-cyan-500/30 p-4 ml-auto max-w-4xl">
      <div className="flex items-center gap-2 mb-3">
        <Terminal className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-heading font-bold text-cyan-300">Action Log</h3>
        <span className="text-xs text-gray-500 ml-auto">Last {actionLog.length} actions</span>
      </div>

      <div className="space-y-2 max-h-32 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {actionLog.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 text-center py-4"
            >
              No actions yet. Start by selecting an action from the panel.
            </motion.div>
          ) : (
            actionLog.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-2 rounded border ${
                  log.result === 'success'
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-red-500/30 bg-red-500/5'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{log.action?.icon || log.icon || '🔧'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-200 truncate">
                        {typeof log.action === 'object' ? log.action.name : log.action}
                      </span>
                      {log.result === 'success' ? (
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                      )}
                      <span className="text-xs text-gray-500 ml-auto flex-shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{log.message || log.details}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

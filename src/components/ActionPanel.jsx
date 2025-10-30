import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock, Activity, Zap } from 'lucide-react'
import { actions, ACTION_CATEGORIES, getNoiseColor } from '../data/actions'
import useGameState from '../hooks/useGameState'

export default function ActionPanel({ onActionExecute }) {
  const [expandedCategory, setExpandedCategory] = useState(ACTION_CATEGORIES.RECONNAISSANCE)
  const currentNode = useGameState(state => state.currentNode)
  const network = useGameState(state => state.network)

  const categories = [
    { id: ACTION_CATEGORIES.RECONNAISSANCE, name: 'Reconnaissance', icon: '🔍' },
    { id: ACTION_CATEGORIES.EXPLOITATION, name: 'Exploitation', icon: '⚡' },
    { id: ACTION_CATEGORIES.MOVEMENT, name: 'Movement', icon: '➡️' },
    { id: ACTION_CATEGORIES.STEALTH, name: 'Stealth', icon: '👻' },
    { id: ACTION_CATEGORIES.EXFILTRATION, name: 'Exfiltration', icon: '📥' },
  ]

  const getActionsByCategory = (category) => {
    return Object.values(actions).filter(action => action.category === category)
  }

  const isActionAvailable = (action) => {
    if (!currentNode || !network) return false
    
    const node = network.nodes.find(n => n.id === currentNode)
    if (!node) return false

    // Special cases
    if (action.id === 'lateralMovement') {
      // Check if there are any connected nodes to move to
      return node.connections.length > 0
    }

    if (action.id === 'usbDrop') {
      // Only available on workstations
      return node.type === 'workstation'
    }

    if (action.category === ACTION_CATEGORIES.EXFILTRATION) {
      // Only available on nodes with data
      return node.hasData
    }

    if (action.category === ACTION_CATEGORIES.EXPLOITATION) {
      // Can't exploit already compromised nodes
      return !node.compromised
    }

    return true
  }

  return (
    <div className="bg-gray-900/80 border-l border-cyan-500/30 p-4 overflow-y-auto h-full">
      <h2 className="text-xl font-heading font-bold text-cyan-300 mb-4">Actions</h2>

      <div className="space-y-2">
        {categories.map((category) => {
          const categoryActions = getActionsByCategory(category.id)
          const isExpanded = expandedCategory === category.id

          return (
            <div key={category.id} className="border border-gray-700 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-bold text-sm text-gray-200">{category.name}</span>
                  <span className="text-xs text-gray-500">({categoryActions.length})</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Category Actions */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-2 space-y-2 bg-gray-900/30">
                      {categoryActions.map((action) => {
                        const available = isActionAvailable(action)

                        return (
                          <motion.button
                            key={action.id}
                            onClick={() => available && onActionExecute(action)}
                            disabled={!available}
                            className={`w-full p-3 rounded-lg border transition-all text-left ${
                              available
                                ? 'border-gray-600 bg-gray-800/50 hover:border-cyan-500 hover:bg-gray-800 cursor-pointer'
                                : 'border-gray-700 bg-gray-900/30 opacity-50 cursor-not-allowed'
                            }`}
                            whileHover={available ? { scale: 1.02 } : {}}
                            whileTap={available ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{action.icon}</span>
                                <span className="font-bold text-sm text-gray-200">{action.name}</span>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded ${getNoiseColor(action.noiseLevel)} bg-gray-900/50`}>
                                {action.noiseLevel}
                              </div>
                            </div>

                            <p className="text-xs text-gray-400 mb-2">{action.description}</p>
                            
                            {action.command && (
                              <div className="mb-2 px-2 py-1 bg-gray-800/50 border border-cyan-500/30 rounded text-xs font-mono text-cyan-400">
                                $ {action.command}
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>{action.timeCost}s</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-400">
                                <Activity className="w-3 h-3" />
                                <span>+{action.visibilityIncrease}% vis</span>
                              </div>
                              {action.successRate < 100 && (
                                <div className="flex items-center gap-1 text-gray-400">
                                  <Zap className="w-3 h-3" />
                                  <span>{action.successRate}% success</span>
                                </div>
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

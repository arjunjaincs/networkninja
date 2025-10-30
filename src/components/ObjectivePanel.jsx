import { motion } from 'framer-motion'
import { Target, CheckCircle, Circle, Info, ChevronLeft } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function ObjectivePanel({ onToggle }) {
  const levelData = useGameState(state => state.levelData)
  const objectives = useGameState(state => state.objectives)
  const currentNode = useGameState(state => state.currentNode)
  const network = useGameState(state => state.network)

  if (!levelData || !network) return null

  const currentNodeData = network.nodes.find(n => n.id === currentNode)

  // Safe access to objectives with fallbacks
  const primaryObj = levelData.objectives?.primary || { description: 'Complete the mission' }
  const secondaryObj = levelData.objectives?.secondary || { description: 'Maintain stealth' }
  const tertiaryObj = levelData.objectives?.tertiary || { description: 'Complete bonus objective' }

  return (
    <div className="bg-gray-900/80 border-r border-cyan-500/30 p-4 overflow-y-auto h-full relative">
      {/* Hide Sidebar Button - Inside sidebar at top */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800 border border-cyan-500/50 rounded-lg hover:bg-gray-700 transition-colors"
          title="Hide sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
        </button>
      )}
      
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-heading font-bold text-cyan-300">Objectives</h2>
      </div>

      {/* Primary Objective */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-yellow-400">PRIMARY</span>
        </div>
        <div className={`p-3 rounded-lg border ${
          objectives.primary ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800/50'
        }`}>
          <div className="flex items-start gap-2">
            {objectives.primary ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-200">{primaryObj.description}</p>
              {!objectives.primary && levelData.objectives.primary.targetNode && (
                <p className="text-xs text-gray-400 mt-1">
                  Target: {network?.nodes.find(n => n.id === levelData.objectives.primary.targetNode)?.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Objective */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-cyan-400">SECONDARY</span>
          <span className="text-xs text-gray-500">+500 pts</span>
        </div>
        <div className={`p-3 rounded-lg border ${
          objectives.secondary ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800/50'
        }`}>
          <div className="flex items-start gap-2">
            {objectives.secondary ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-gray-200">{secondaryObj.description}</p>
          </div>
        </div>
      </div>

      {/* Tertiary Objective */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-purple-400">TERTIARY</span>
          <span className="text-xs text-gray-500">+300 pts</span>
        </div>
        <div className={`p-3 rounded-lg border ${
          objectives.tertiary ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800/50'
        }`}>
          <div className="flex items-start gap-2">
            {objectives.tertiary ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-gray-200">{tertiaryObj.description}</p>
          </div>
        </div>
      </div>

      {/* Current Node Info */}
      <div className="border-t border-gray-700 pt-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-bold text-gray-300">Current Node</h3>
        </div>
        
        {currentNodeData ? (
          <div className="space-y-2">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{currentNodeData.icon}</span>
                <div>
                  <div className="text-sm font-bold text-cyan-300">{currentNodeData.name}</div>
                  <div className="text-xs text-gray-400">{currentNodeData.type}</div>
                </div>
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">OS:</span>
                  <span className="text-gray-200">{currentNodeData.os}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={currentNodeData.compromised ? 'text-green-400' : 'text-yellow-400'}>
                    {currentNodeData.compromised ? 'Compromised' : 'Locked'}
                  </span>
                </div>
                {currentNodeData.openPorts.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ports:</span>
                    <span className="text-gray-200">{currentNodeData.openPorts.join(', ')}</span>
                  </div>
                )}
                {currentNodeData.vulnerabilities.length > 0 && (
                  <div className="mt-2">
                    <span className="text-gray-400">Vulnerabilities:</span>
                    <div className="mt-1 space-y-1">
                      {currentNodeData.vulnerabilities.map((vuln, i) => (
                        <div key={i} className="text-yellow-400 text-xs">• {vuln}</div>
                      ))}
                    </div>
                  </div>
                )}
                {currentNodeData.hasData && (
                  <motion.div 
                    className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-yellow-400 font-bold">📦 Contains Data</div>
                    <div className="text-yellow-300 text-xs">{currentNodeData.dataType}</div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Connected Nodes */}
            {currentNodeData.connections.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 mb-2">Connected Nodes ({currentNodeData.connections.length})</div>
                <div className="space-y-1">
                  {currentNodeData.connections.map((connId) => {
                    const connNode = network?.nodes.find(n => n.id === connId)
                    if (!connNode || !connNode.discovered) return null
                    
                    return (
                      <div key={connId} className="text-xs p-2 bg-gray-800/30 rounded border border-gray-700">
                        <div className="flex items-center gap-2">
                          <span>{connNode.icon}</span>
                          <span className="text-gray-300">{connNode.name}</span>
                          {connNode.compromised && (
                            <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No node selected</p>
        )}
      </div>
    </div>
  )
}

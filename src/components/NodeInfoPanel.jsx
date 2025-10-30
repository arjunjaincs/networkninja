import { motion } from 'framer-motion'
import { Server, Shield, AlertTriangle, CheckCircle, Lock, DollarSign } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function NodeInfoPanel() {
  const network = useGameState(state => state.network)
  const currentNode = useGameState(state => state.currentNode)
  const compromisedNodes = useGameState(state => state.compromisedNodes)
  const discoveredNodes = useGameState(state => state.discoveredNodes)

  if (!network || !currentNode) return null

  const node = network.nodes.find(n => n.id === currentNode)
  if (!node) return null

  const isCompromised = compromisedNodes.includes(node.id)
  const hasHighValueTarget = node.highValueTarget

  // Get connected nodes
  const connectedNodes = network.nodes.filter(n => 
    node.connections?.includes(n.id) && discoveredNodes.includes(n.id)
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-900/95 border-2 border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{node.icon}</div>
          <div>
            <h3 className="text-xl font-heading font-bold text-cyan-300">{node.name}</h3>
            <p className="text-sm text-gray-400">{node.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isCompromised && (
            <div className="px-2 py-1 bg-green-500/20 border border-green-500/50 rounded text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Compromised
            </div>
          )}
          {!isCompromised && (
            <div className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Secured
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-4"></div>

      {/* System Info */}
      <div className="space-y-3 mb-4">
        {node.os && (
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">OS:</span>
            <span className="text-sm text-cyan-300 font-mono">{node.os}</span>
          </div>
        )}

        {node.ports && node.ports.length > 0 && (
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-cyan-400 mt-0.5" />
            <span className="text-sm text-gray-300">Ports:</span>
            <div className="flex flex-wrap gap-1">
              {node.ports.map(port => (
                <span key={port} className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300 font-mono">
                  {port}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vulnerabilities */}
      {node.vulnerabilities && node.vulnerabilities.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">Vulnerabilities ({node.vulnerabilities.length})</span>
          </div>
          <div className="space-y-1">
            {node.vulnerabilities.map((vuln, i) => (
              <div key={i} className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-300">
                {vuln}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data */}
      {node.hasData && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-lg">📦</div>
            <span className="text-sm font-bold text-green-400">Contains Data</span>
          </div>
          <p className="text-xs text-green-300">{node.dataType}</p>
        </div>
      )}

      {/* High Value Target */}
      {hasHighValueTarget && (
        <div className="mb-4 p-3 bg-yellow-500/10 border-2 border-yellow-500/50 rounded animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">HIGH VALUE TARGET</span>
          </div>
          <p className="text-sm text-yellow-300 font-bold mb-2">{hasHighValueTarget.name}</p>
          <p className="text-xs text-gray-400 mb-2">{hasHighValueTarget.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-400">+{hasHighValueTarget.scoreBonus} pts</span>
            <span className="text-red-400">+{hasHighValueTarget.visibilitySpike}% visibility</span>
          </div>
        </div>
      )}

      {/* Connected Nodes */}
      {connectedNodes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-cyan-400">Connected Nodes ({connectedNodes.length})</span>
          </div>
          <div className="space-y-1">
            {connectedNodes.map(connNode => {
              const isConnCompromised = compromisedNodes.includes(connNode.id)
              return (
                <div 
                  key={connNode.id} 
                  className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span>{connNode.icon}</span>
                    <span className="text-gray-300">{connNode.name}</span>
                  </div>
                  {isConnCompromised && (
                    <CheckCircle className="w-3 h-3 text-green-400" />
                  )}
                  {!isConnCompromised && (
                    <Lock className="w-3 h-3 text-gray-500" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

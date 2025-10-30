import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Lock, CheckCircle, AlertTriangle, Move, DollarSign } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function NetworkMap() {
  const network = useGameState(state => state.network)
  const currentNode = useGameState(state => state.currentNode)
  const compromisedNodes = useGameState(state => state.compromisedNodes)
  const discoveredNodes = useGameState(state => state.discoveredNodes)
  const moveToNode = useGameState(state => state.moveToNode)

  // Pan and zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  if (!network) return null

  const handleNodeClick = (node) => {
    if (!discoveredNodes.includes(node.id)) return
    const currentNodeData = network.nodes.find(n => n.id === currentNode)
    
    // Check if current node is compromised before allowing movement
    const isCurrentCompromised = currentNodeData?.compromised || compromisedNodes.includes(currentNode)
    
    if (!isCurrentCompromised) {
      // Show warning that node must be compromised first
      return
    }
    
    if (currentNodeData && currentNodeData.connections.includes(node.id)) {
      moveToNode(node.id)
    }
  }

  const isNodeAccessible = (node) => {
    if (!discoveredNodes.includes(node.id)) return false
    const currentNodeData = network.nodes.find(n => n.id === currentNode)
    
    // Node is only accessible if current node is compromised
    const isCurrentCompromised = currentNodeData?.compromised || compromisedNodes.includes(currentNode)
    
    return isCurrentCompromised && currentNodeData && currentNodeData.connections.includes(node.id)
  }

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e) => {
    e.preventDefault() // Prevent browser zoom
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)))
  }

  const resetView = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="relative w-full h-full bg-gray-900/50 rounded-lg border border-cyan-500/30 overflow-hidden">
      {/* Controls - Moved to bottom to not overlap pause button */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <button
          onClick={resetView}
          className="px-3 py-2 bg-gray-800/90 border border-cyan-500/50 rounded text-xs text-cyan-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
          title="Reset view"
        >
          <Move className="w-4 h-4" />
          Reset View
        </button>
        <div className="px-3 py-2 bg-gray-800/90 border border-cyan-500/50 rounded text-xs text-gray-400">
          Zoom: {Math.round(zoom * 100)}%
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full cursor-move relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Neon Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 245, 255, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 245, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          className="w-full h-full relative"
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: '2000px', minHeight: '2000px' }}>
            {network.nodes.map((node, i) => {
              if (!node.connections || !discoveredNodes.includes(node.id)) return null
              return node.connections.map((connId, j) => {
                const targetNode = network.nodes.find(n => n.id === connId)
                if (!targetNode || !discoveredNodes.includes(connId)) return null
                return (
                  <motion.line
                    key={`${node.id}-${connId}`}
                    x1={node.x * 1.5 + 40}
                    y1={node.y * 1.2 + 40}
                    x2={targetNode.x * 1.5 + 40}
                    y2={targetNode.y * 1.2 + 40}
                    stroke="rgba(0, 245, 255, 0.8)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                )
              })
            })}
          </svg>

          {network.nodes.map((node) => {
            const isDiscovered = discoveredNodes.includes(node.id)
            const isCompromised = node.compromised || compromisedNodes.includes(node.id)
            const isCurrent = node.id === currentNode
            const isAccessible = isNodeAccessible(node)
            const hasData = node.hasData
            const hasHighValueTarget = node.highValueTarget
            if (!isDiscovered) return null

            return (
              <motion.div
                key={node.id}
                className={`absolute w-20 h-20 rounded-full border-3 cursor-pointer transition-all group
                  ${isCurrent ? 'border-cyan-400 shadow-lg shadow-cyan-400/50 z-20' : 'border-gray-600 z-10'}
                  ${isCompromised ? 'bg-green-500/30 border-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-800'}
                  ${isAccessible && !isCurrent ? 'hover:border-cyan-300 hover:scale-110' : ''}
                  ${!isAccessible && !isCurrent ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                style={{ left: node.x * 1.5, top: node.y * 1.2 }}
                onClick={() => handleNodeClick(node)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, type: 'spring' }}
                whileHover={isAccessible ? { scale: 1.1 } : {}}
                whileTap={isAccessible ? { scale: 0.95 } : {}}
              >
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="text-2xl">{node.icon}</div>
                  <div className="absolute -top-1 -right-1 flex gap-1">
                    {isCompromised && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {!isCompromised && !isAccessible && <Lock className="w-4 h-4 text-gray-500" />}
                    {hasData && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                    {hasHighValueTarget && <DollarSign className="w-4 h-4 text-yellow-400 animate-pulse" />}
                  </div>
                </div>

                {/* Persistent Info Label - Always Visible */}
                <div className="absolute left-24 top-0 bg-gray-900/95 border border-cyan-500/50 rounded-lg px-3 py-2 text-xs whitespace-nowrap backdrop-blur-sm pointer-events-none z-30 min-w-[200px] shadow-xl">
                  <div className="font-bold text-cyan-300 mb-1">{node.name}</div>
                  <div className="text-gray-400 mb-1">{node.type}</div>
                  {node.os && <div className="text-gray-500 text-xs mb-1">{node.os}</div>}
                  {node.vulnerabilities && node.vulnerabilities.length > 0 && (
                    <div className="text-yellow-400 mb-1">⚠️ {node.vulnerabilities.length} Vulnerabilities</div>
                  )}
                  {hasData && <div className="text-green-400 font-bold mb-1">📦 {node.dataType}</div>}
                  {hasHighValueTarget && (
                    <div className="text-yellow-400 font-bold border-t border-yellow-500/30 pt-1 mt-1">
                      💰 {hasHighValueTarget.name}
                      <div className="text-xs text-green-400">+{hasHighValueTarget.scoreBonus} pts</div>
                    </div>
                  )}
                  {isCompromised && (
                    <div className="text-green-400 text-xs mt-1">✓ Compromised</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
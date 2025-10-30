import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Zap, Shield, Bot } from 'lucide-react'
import { PacketManager } from '../systems/NetworkPacket'
import { NetworkPhysics, BandwidthSimulator } from '../systems/NetworkPhysics'
import useGameState from '../hooks/useGameState'

export default function NetworkTrafficOverlay() {
  const canvasRef = useRef(null)
  const [packetManager] = useState(() => new PacketManager())
  const [physics] = useState(() => new NetworkPhysics(null))
  const [bandwidth] = useState(() => new BandwidthSimulator())
  const [stats, setStats] = useState({
    packets: 0,
    bandwidth: 0,
    congested: false,
    stealthBonus: 0
  })

  const network = useGameState(state => state.network)
  const gameState = useGameState(state => state.gameState)

  useEffect(() => {
    if (!canvasRef.current) return

    physics.canvas = canvasRef.current
    physics.initialize()

    const animate = () => {
      if (gameState !== 'playing') return

      const deltaTime = 1
      packetManager.update(deltaTime, network)
      physics.update(deltaTime)

      const activePackets = packetManager.getActivePackets()
      physics.render(activePackets)

      // Update stats
      const bandwidthUsage = bandwidth.calculateUsage(activePackets)
      setStats({
        packets: activePackets.length,
        bandwidth: bandwidthUsage,
        congested: bandwidth.isCongested(),
        stealthBonus: packetManager.getStealthBonus()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => physics.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      physics.stop()
    }
  }, [gameState, network, packetManager, physics, bandwidth])

  return (
    <>
      {/* Canvas for packet rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      />

      {/* Traffic Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-20 right-4 z-10 bg-gray-900/95 border-2 border-cyan-500/50 rounded-lg p-3 backdrop-blur-sm min-w-[200px]"
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400">NETWORK TRAFFIC</span>
        </div>

        {/* Packet Count */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-gray-400">Packets:</span>
          </div>
          <span className="text-sm font-bold text-white">{stats.packets}</span>
        </div>

        {/* Bandwidth Usage */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Bandwidth:</span>
            <span className="text-xs font-bold text-cyan-400">
              {stats.bandwidth.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                stats.congested
                  ? 'bg-gradient-to-r from-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, stats.bandwidth)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Congestion Warning */}
        {stats.congested && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-400 mb-2"
          >
            <Shield className="w-3 h-3" />
            <span>Network Congested!</span>
          </motion.div>
        )}

        {/* Stealth Bonus */}
        {stats.stealthBonus < 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-2 bg-green-900/30 border border-green-500/50 rounded text-xs text-green-400"
          >
            <Bot className="w-3 h-3" />
            <span>Hiding in traffic: {stats.stealthBonus}% visibility</span>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500 mb-2">Traffic Types:</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">Normal (Employees)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-gray-400">Hackers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-400">Bots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs text-gray-400">Security (IDS)</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

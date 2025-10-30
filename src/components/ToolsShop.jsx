import { motion } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { HACK_TOOLS } from '../data/hackTools'

export default function ToolsShop({ onClose }) {
  const credits = useGameState(state => state.credits)
  const toolInventory = useGameState(state => state.toolInventory)
  const craftTool = useGameState(state => state.craftTool)

  const handleCraft = (toolId, cost) => {
    if (credits >= cost) {
      craftTool(toolId, cost)
    }
  }

  const categories = {
    defensive: { name: 'Defensive', color: 'blue' },
    offensive: { name: 'Offensive', color: 'red' },
    utility: { name: 'Utility', color: 'yellow' },
    reconnaissance: { name: 'Reconnaissance', color: 'cyan' },
  }

  const toolsByCategory = Object.values(HACK_TOOLS).reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border-2 border-green-500 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-green-500 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-green-400">Hack Tools Shop</h2>
            <p className="text-gray-400 mt-1">Credits: <span className="text-green-400 font-bold">{credits}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Current Inventory */}
        {toolInventory.length > 0 && (
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-heading font-bold text-cyan-400 mb-4">Your Inventory</h3>
            <div className="grid md:grid-cols-4 gap-3">
              {toolInventory.map((tool, i) => (
                <div key={i} className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="text-sm text-cyan-400 font-bold">{tool.remainingUses}x</span>
                  </div>
                  <div className="text-sm font-bold text-cyan-300 mt-2">{tool.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shop Items */}
        <div className="p-6 space-y-8">
          {Object.entries(categories).map(([catId, cat]) => {
            const tools = toolsByCategory[catId] || []
            if (tools.length === 0) return null

            return (
              <div key={catId} className="space-y-4">
                <h3 className={`text-2xl font-heading font-bold text-${cat.color}-400`}>
                  {cat.name} Tools
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tools.map(tool => {
                    const canAfford = credits >= tool.cost

                    return (
                      <motion.div
                        key={tool.id}
                        whileHover={canAfford ? { scale: 1.05 } : {}}
                        className={`p-4 rounded-lg border-2 ${
                          canAfford
                            ? `border-${cat.color}-500 bg-${cat.color}-500/10 cursor-pointer hover:bg-${cat.color}-500/20`
                            : 'border-gray-700 bg-gray-900/50 opacity-50'
                        }`}
                        onClick={() => canAfford && handleCraft(tool.id, tool.cost)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-4xl">{tool.icon}</div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">Uses</div>
                            <div className={`text-lg font-bold text-${cat.color}-400`}>{tool.uses}x</div>
                          </div>
                        </div>
                        <h4 className={`font-bold text-${cat.color}-300 mb-2`}>
                          {tool.name}
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                            {tool.cost} Credits
                          </span>
                          {canAfford && (
                            <ShoppingCart className={`w-4 h-4 text-${cat.color}-400`} />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <p className="text-sm text-gray-400 text-center">
            💡 Tools are consumables with limited uses. Use them strategically during missions!
          </p>
        </div>
      </motion.div>
    </div>
  )
}

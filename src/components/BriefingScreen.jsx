import { motion } from 'framer-motion'
import { Target, Info, Lightbulb, Play } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { getDifficultyColor } from '../data/levels'

export default function BriefingScreen() {
  const levelData = useGameState(state => state.levelData)
  const startGame = useGameState(state => state.startGame)

  if (!levelData) return null

  return (
    <div className="min-h-screen bg-cyber-dark scan-lines flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="text-6xl">🎯</div>
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-cyber-cyan mb-2">
            {levelData.briefing.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-400">Level {levelData.id}</span>
            <span className="text-gray-600">•</span>
            <span className={getDifficultyColor(levelData.difficulty)}>
              {levelData.difficulty.toUpperCase()}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">{Math.floor(levelData.timeLimit / 60)} minutes</span>
          </div>
        </div>

        {/* Mission Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-6"
        >
          <h2 className="text-xl font-heading font-bold text-cyan-300 mb-3">Mission Brief</h2>
          <p className="text-gray-300 leading-relaxed">{levelData.briefing.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Objectives */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-heading font-bold text-yellow-400">Objectives</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-yellow-400 mb-1">PRIMARY</div>
                <p className="text-sm text-gray-300">{levelData.objectives.primary.description}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-cyan-400 mb-1">SECONDARY (+500 pts)</div>
                <p className="text-sm text-gray-300">{levelData.objectives.secondary.description}</p>
              </div>
              <div>
                <div className="text-xs font-bold text-purple-400 mb-1">TERTIARY (+300 pts)</div>
                <p className="text-sm text-gray-300">{levelData.objectives.tertiary.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Intel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-heading font-bold text-cyan-300">Intelligence</h3>
            </div>
            <div className="space-y-2">
              {levelData.briefing.intel.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 text-xs mt-1">▸</span>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-heading font-bold text-green-400">Tips</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {levelData.briefing.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-green-400 text-xs mt-1">💡</span>
                <p className="text-sm text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-12 py-4 bg-cyber-cyan text-cyber-dark font-heading font-bold text-xl rounded-lg glow-cyan hover:bg-cyan-400 transition-colors inline-flex items-center gap-3"
          >
            <Play className="w-6 h-6" />
            BEGIN MISSION
          </motion.button>
          <p className="text-sm text-gray-500 mt-4">Timer starts when you begin</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

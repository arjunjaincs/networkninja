import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { getActiveSkillEffects } from '../data/skillTree'

export default function SkillEffectsIndicator() {
  const unlockedSkills = useGameState(state => state.unlockedSkills)
  const skillEffects = getActiveSkillEffects(unlockedSkills)

  const getActiveEffectIndicators = () => {
    const indicators = []

    if (skillEffects.visibilityReduction > 0) {
      indicators.push({
        icon: '👻',
        name: 'Stealth Bonus',
        description: `-${Math.round(skillEffects.visibilityReduction * 100)}% Visibility`,
        color: 'text-green-400'
      })
    }

    if (skillEffects.timeReduction > 0) {
      indicators.push({
        icon: '⚡',
        name: 'Speed Bonus',
        description: `-${Math.round(skillEffects.timeReduction * 100)}% Time`,
        color: 'text-yellow-400'
      })
    }

    if (skillEffects.successRateBonus > 0) {
      indicators.push({
        icon: '🎯',
        name: 'Success Bonus',
        description: `+${Math.round(skillEffects.successRateBonus * 100)}% Success Rate`,
        color: 'text-blue-400'
      })
    }

    if (skillEffects.enhancedRecon) {
      indicators.push({
        icon: '🦅',
        name: 'Enhanced Recon',
        description: 'Reveals detailed node information',
        color: 'text-purple-400'
      })
    }

    if (skillEffects.autoDiscover) {
      indicators.push({
        icon: '👁️',
        name: 'Network Vision',
        description: 'Auto-discovers connected nodes',
        color: 'text-cyan-400'
      })
    }

    if (skillEffects.seeAll) {
      indicators.push({
        icon: '🔮',
        name: 'Omniscient',
        description: 'See entire network',
        color: 'text-pink-400'
      })
    }

    return indicators
  }

  const activeEffects = getActiveEffectIndicators()

  if (activeEffects.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="bg-purple-900/90 border-2 border-purple-500/50 rounded-lg p-3 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold text-purple-300">ACTIVE SKILLS</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {activeEffects.map((effect, index) => (
              <motion.div
                key={effect.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-1 px-2 py-1 bg-purple-800/50 border border-purple-600/30 rounded text-xs"
                title={effect.description}
              >
                <span className="text-lg">{effect.icon}</span>
                <span className={`font-bold ${effect.color}`}>
                  {effect.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

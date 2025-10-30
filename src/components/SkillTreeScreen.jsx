import { motion } from 'framer-motion'
import { X, Lock, CheckCircle } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { SKILLS, SKILL_CATEGORIES, getSkillsByCategory, canUnlockSkill } from '../data/skillTree'

export default function SkillTreeScreen({ onClose }) {
  const reputation = useGameState(state => state.reputation)
  const unlockedSkills = useGameState(state => state.unlockedSkills || [])
  const unlockSkill = useGameState(state => state.unlockSkill)

  const handleUnlock = (skillId) => {
    const skill = SKILLS[skillId]
    if (canUnlockSkill(skillId, unlockedSkills, reputation)) {
      unlockSkill(skillId, skill.cost)
    }
  }

  const categories = [
    { id: SKILL_CATEGORIES.STEALTH, name: 'Stealth', color: 'purple' },
    { id: SKILL_CATEGORIES.SPEED, name: 'Speed', color: 'yellow' },
    { id: SKILL_CATEGORIES.EXPLOITATION, name: 'Exploitation', color: 'red' },
    { id: SKILL_CATEGORIES.RECONNAISSANCE, name: 'Reconnaissance', color: 'cyan' },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border-2 border-cyan-500 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-cyan-500 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-heading font-bold text-cyan-400">Skill Tree</h2>
            <p className="text-gray-400 mt-1">Reputation: <span className="text-yellow-400 font-bold">{reputation}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Skill Categories */}
        <div className="p-6 space-y-8">
          {categories.map(category => {
            const skills = getSkillsByCategory(category.id)
            return (
              <div key={category.id} className="space-y-4">
                <h3 className={`text-2xl font-heading font-bold text-${category.color}-400`}>
                  {category.name}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {skills.map(skill => {
                    const isUnlocked = unlockedSkills.includes(skill.id)
                    const canUnlock = canUnlockSkill(skill.id, unlockedSkills, reputation)
                    const isLocked = !isUnlocked && !canUnlock

                    return (
                      <motion.div
                        key={skill.id}
                        whileHover={canUnlock ? { scale: 1.05 } : {}}
                        className={`p-4 rounded-lg border-2 ${
                          isUnlocked
                            ? `border-${category.color}-500 bg-${category.color}-500/20`
                            : canUnlock
                            ? `border-${category.color}-500/50 bg-gray-800 cursor-pointer hover:bg-gray-700`
                            : 'border-gray-700 bg-gray-900/50 opacity-50'
                        }`}
                        onClick={() => canUnlock && handleUnlock(skill.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-3xl">{skill.icon}</div>
                          {isUnlocked && <CheckCircle className={`w-5 h-5 text-${category.color}-400`} />}
                          {isLocked && <Lock className="w-5 h-5 text-gray-600" />}
                        </div>
                        <h4 className={`font-bold ${isUnlocked ? `text-${category.color}-300` : 'text-gray-300'}`}>
                          {skill.name}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">{skill.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-yellow-400">
                            {isUnlocked ? 'UNLOCKED' : `${skill.cost} Rep`}
                          </span>
                          <span className="text-xs text-gray-500">Tier {skill.tier}</span>
                        </div>
                        {skill.requires.length > 0 && !isUnlocked && (
                          <div className="mt-2 text-xs text-gray-500">
                            Requires: {skill.requires.map(r => SKILLS[r]?.name).join(', ')}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

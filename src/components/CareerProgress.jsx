import { motion } from 'framer-motion'
import { TrendingUp, Award, Lock } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { getCareerRank, getNextRank, getProgressToNextRank, careerLevels } from '../data/careers'

export default function CareerProgress() {
  const totalCareerScore = useGameState(state => state.totalCareerScore)
  
  const currentRank = getCareerRank(totalCareerScore)
  const nextRank = getNextRank(currentRank)
  const progress = getProgressToNextRank(totalCareerScore, currentRank)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h2 className="text-2xl font-heading font-bold text-purple-400">Career Progression</h2>
      </div>

      {/* Current Rank */}
      <div className={`p-4 rounded-lg border-2 ${currentRank.borderColor} ${currentRank.bgColor} mb-4`}>
        <div className="flex items-center gap-4">
          <div className="text-5xl">{currentRank.icon}</div>
          <div className="flex-1">
            <div className={`text-2xl font-heading font-bold ${currentRank.color}`}>
              {currentRank.name}
            </div>
            <p className="text-sm text-gray-400 mt-1">{currentRank.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentRank.skills.map((skill, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-gray-800/50 rounded border border-gray-700 text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Score</div>
            <div className={`text-3xl font-bold ${currentRank.color}`}>
              {totalCareerScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Progress to Next Rank */}
      {nextRank && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress to {nextRank.name}</span>
            <span className="text-sm font-bold text-purple-300">{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700 mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{totalCareerScore.toLocaleString()} / {nextRank.minScore.toLocaleString()} points</span>
            <span>•</span>
            <span>{(nextRank.minScore - totalCareerScore).toLocaleString()} points to go</span>
          </div>

          {/* Next Rank Preview */}
          <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="text-3xl opacity-50">{nextRank.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-300">{nextRank.name}</div>
                <p className="text-xs text-gray-500">{nextRank.description}</p>
              </div>
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      )}

      {/* Max Rank Achieved */}
      {!nextRank && (
        <div className="text-center p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50">
          <Award className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
          <p className="text-xl font-bold text-yellow-400">Maximum Rank Achieved!</p>
          <p className="text-sm text-gray-300 mt-1">You've reached the pinnacle of cyber operations</p>
        </div>
      )}

      {/* Career Path Overview */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-sm font-bold text-gray-300 mb-3">Career Path</h3>
        <div className="space-y-2">
          {careerLevels.map((rank, i) => {
            const isAchieved = totalCareerScore >= rank.minScore
            const isCurrent = rank.id === currentRank.id

            return (
              <div
                key={rank.id}
                className={`flex items-center gap-3 p-2 rounded ${
                  isCurrent ? 'bg-purple-500/20 border border-purple-500/50' : 
                  isAchieved ? 'bg-gray-800/30' : 'opacity-40'
                }`}
              >
                <div className="text-2xl">{rank.icon}</div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${isAchieved ? rank.color : 'text-gray-600'}`}>
                    {rank.name}
                  </div>
                  <div className="text-xs text-gray-500">{rank.minScore.toLocaleString()} pts</div>
                </div>
                {isAchieved ? (
                  <Award className={`w-4 h-4 ${rank.color}`} />
                ) : (
                  <Lock className="w-4 h-4 text-gray-600" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, Calendar, Trophy, Clock, Target, AlertTriangle, ArrowLeft } from 'lucide-react'
import ProceduralMissionGenerator from '../systems/ProceduralMissionGenerator'

export default function ProceduralMissionScreen({ onStartMission, onBack }) {
  const [generator] = useState(() => new ProceduralMissionGenerator())
  const [currentMission, setCurrentMission] = useState(() => generator.generateMission())
  const [dailyMission] = useState(() => generator.generateDailyChallenge())
  const [showDaily, setShowDaily] = useState(false)

  const generateNewMission = () => {
    const newMission = generator.generateMission()
    setCurrentMission(newMission)
  }

  const mission = showDaily ? dailyMission : currentMission

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 3) return 'text-green-400'
    if (difficulty <= 6) return 'text-yellow-400'
    if (difficulty <= 9) return 'text-orange-400'
    return 'text-red-400'
  }

  const getDifficultyLabel = (difficulty) => {
    if (difficulty <= 3) return 'Easy'
    if (difficulty <= 6) return 'Medium'
    if (difficulty <= 9) return 'Hard'
    return 'Extreme'
  }

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-cyan-400" />
            </button>
            <h1 className="text-4xl font-heading font-bold text-cyan-400">
              Procedural Missions
            </h1>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowDaily(false)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                !showDaily
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
            <button
              onClick={() => setShowDaily(true)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                showDaily
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Daily
            </button>
          </div>
        </div>

        {/* Mission Card */}
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border-2 border-cyan-500/50 rounded-lg p-8 mb-6"
        >
          {/* Mission Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{mission.type.icon}</span>
                <div>
                  <h2 className="text-3xl font-heading font-bold text-cyan-400">
                    {mission.type.name}
                  </h2>
                  <p className="text-gray-400">{mission.target.name}</p>
                </div>
              </div>
            </div>

            {/* Difficulty Badge */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${getDifficultyColor(mission.difficulty)}`}>
                {getDifficultyLabel(mission.difficulty)}
              </div>
              <div className="text-sm text-gray-500">
                Difficulty: {mission.difficulty}/12
              </div>
            </div>
          </div>

          {/* Mission Story */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {mission.story}
            </p>
          </div>

          {/* Mission Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Reward</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                ${mission.reward.toLocaleString()}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-gray-400">Time Limit</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">
                {Math.floor(mission.timeLimit / 60)}m
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Network Size</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {mission.target.nodes} nodes
              </div>
            </div>
          </div>

          {/* Modifiers */}
          {mission.modifiers.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-orange-400">Active Modifiers</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mission.modifiers.map((modifier) => (
                  <div
                    key={modifier.id}
                    className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{modifier.icon}</span>
                      <span className="font-bold text-orange-300">{modifier.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">{modifier.description}</p>
                    <div className="mt-2 text-xs text-orange-400">
                      +{modifier.difficulty} difficulty • {modifier.rewardMultiplier}x reward
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objectives */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">Objectives</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 bg-gray-800/50 rounded p-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <div>
                  <div className="font-bold text-white">Primary</div>
                  <div className="text-sm text-gray-400">{mission.objectives.primary.description}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded p-3">
                <span className="text-yellow-400 font-bold">2.</span>
                <div>
                  <div className="font-bold text-white">Secondary</div>
                  <div className="text-sm text-gray-400">
                    {mission.objectives.secondary.description} (below {mission.objectives.secondary.threshold}%)
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-800/50 rounded p-3">
                <span className="text-green-400 font-bold">3.</span>
                <div>
                  <div className="font-bold text-white">Tertiary</div>
                  <div className="text-sm text-gray-400">
                    {mission.objectives.tertiary.description} (under {Math.floor(mission.objectives.tertiary.timeLimit / 60)} minutes)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!showDaily && (
              <button
                onClick={generateNewMission}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                Generate New Mission
              </button>
            )}
            <button
              onClick={() => onStartMission(mission)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-bold text-white transition-colors shadow-lg shadow-cyan-500/50"
            >
              Start Mission
            </button>
          </div>

          {/* Daily Challenge Info */}
          {showDaily && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-purple-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-bold">
                  Daily Challenge • Same for all players • Resets at midnight
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4">
          <h3 className="font-bold text-cyan-400 mb-2">About Procedural Missions</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Infinite unique missions with random modifiers</li>
            <li>• Higher difficulty = better rewards</li>
            <li>• Daily challenges are the same for all players</li>
            <li>• Modifiers increase both challenge and payout</li>
            <li>• Share your seed to challenge friends!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

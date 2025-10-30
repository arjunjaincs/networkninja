import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, Eye, Target, Award, ArrowRight, Star, Coins } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { formatTime } from '../data/levels'
import { calculateStealthRating, getRatingColor, getRatingDescription } from '../utils/scoring'
import { calculateReputation, calculateCredits } from '../data/metaProgression'
import AfterActionReport from './AfterActionReport'
import CareerProgress from './CareerProgress'

export default function ResultsScreen({ onContinue }) {
  const levelData = useGameState(state => state.levelData)
  const objectives = useGameState(state => state.objectives)
  const visibility = useGameState(state => state.visibility)
  const timeRemaining = useGameState(state => state.timeRemaining)
  const score = useGameState(state => state.score)
  const addReputation = useGameState(state => state.addReputation)
  const addCredits = useGameState(state => state.addCredits)

  if (!levelData) return null

  const stealthRating = calculateStealthRating(visibility)
  const timeUsed = levelData.timeLimit - timeRemaining
  
  // Calculate and award meta-progression rewards
  const reputationEarned = calculateReputation(score, objectives)
  const creditsEarned = calculateCredits(score, objectives)
  
  // Award on first render
  React.useEffect(() => {
    addReputation(reputationEarned)
    addCredits(creditsEarned)
  }, [])

  return (
    <div className="min-h-screen bg-cyber-dark scan-lines flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-block mb-4"
          >
            <Trophy className="w-24 h-24 text-yellow-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-heading font-bold text-cyber-cyan mb-2"
          >
            MISSION COMPLETE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400"
          >
            {levelData.name}
          </motion.p>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 border-2 border-cyan-500/50 rounded-lg p-8 mb-6 text-center"
        >
          <div className="text-sm text-gray-400 mb-2">TOTAL SCORE</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-7xl font-heading font-bold text-cyber-cyan mb-4"
          >
            {score.toLocaleString()}
          </motion.div>
          <div className="flex items-center justify-center gap-2">
            <Award className={`w-8 h-8 ${getRatingColor(stealthRating)}`} />
            <span className={`text-3xl font-heading font-bold ${getRatingColor(stealthRating)}`}>
              {stealthRating} RANK
            </span>
          </div>
          <p className={`text-sm mt-2 ${getRatingColor(stealthRating)}`}>
            {getRatingDescription(stealthRating)}
          </p>
        </motion.div>

        {/* Rewards Earned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Reputation Earned</div>
            <div className="text-3xl font-bold text-yellow-400">+{reputationEarned}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <Coins className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-sm text-gray-400">Credits Earned</div>
            <div className="text-3xl font-bold text-green-400">+{creditsEarned}</div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Objectives */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-heading font-bold text-yellow-400">Objectives</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Primary Objective</span>
                <span className={`font-bold ${objectives.primary ? 'text-green-400' : 'text-red-400'}`}>
                  {objectives.primary ? '✓ Complete' : '✗ Failed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Secondary Objective</span>
                <span className={`font-bold ${objectives.secondary ? 'text-green-400' : 'text-gray-500'}`}>
                  {objectives.secondary ? '✓ Complete (+500)' : '✗ Incomplete'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Tertiary Objective</span>
                <span className={`font-bold ${objectives.tertiary ? 'text-green-400' : 'text-gray-500'}`}>
                  {objectives.tertiary ? '✓ Complete (+300)' : '✗ Incomplete'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-heading font-bold text-cyan-300">Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Time Used</span>
                </div>
                <span className="font-bold text-cyan-300">{formatTime(timeUsed)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Final Visibility</span>
                </div>
                <span className={`font-bold ${
                  visibility < 30 ? 'text-green-400' :
                  visibility < 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {visibility}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Stealth Rating</span>
                </div>
                <span className={`font-bold ${getRatingColor(stealthRating)}`}>
                  {stealthRating}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-heading font-bold text-cyan-300 mb-4">Score Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Base Score</span>
              <span className="text-gray-200">1,000</span>
            </div>
            {objectives.primary && (
              <div className="flex justify-between">
                <span className="text-gray-400">Primary Objective</span>
                <span className="text-green-400">+1,000</span>
              </div>
            )}
            {objectives.secondary && (
              <div className="flex justify-between">
                <span className="text-gray-400">Secondary Objective</span>
                <span className="text-green-400">+500</span>
              </div>
            )}
            {objectives.tertiary && (
              <div className="flex justify-between">
                <span className="text-gray-400">Tertiary Objective</span>
                <span className="text-green-400">+300</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Stealth Bonus</span>
              <span className="text-cyan-400">+{Math.floor((100 - visibility) * 5)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Bonus</span>
              <span className="text-cyan-400">+{Math.floor(timeRemaining / 10)}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold">
              <span className="text-cyan-300">TOTAL</span>
              <span className="text-cyber-cyan text-xl">{score.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* After-Action Report */}
        <AfterActionReport />

        {/* Career Progress */}
        <CareerProgress />

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring' }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="px-12 py-4 bg-cyber-cyan text-cyber-dark font-heading font-bold text-xl rounded-lg glow-cyan hover:bg-cyan-400 transition-colors inline-flex items-center gap-3"
          >
            Continue to Quiz
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

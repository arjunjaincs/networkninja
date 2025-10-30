import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, BookOpen, Settings, TrendingUp, Shuffle, Infinity, Zap, Trophy, Sparkles, ShoppingBag } from 'lucide-react'
import useGameState from './hooks/useGameState'
import BriefingScreen from './components/BriefingScreen'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import GameOverScreen from './components/GameOverScreen'
import QuizScreen from './components/QuizScreen'
import EducationalDebrief from './components/EducationalDebrief'
import SkillTreeScreen from './components/SkillTreeScreen'
import ToolsShop from './components/ToolsShop'
import ProceduralMissionScreen from './components/ProceduralMissionScreen'
import { getCareerRank } from './data/careers'
import { getDailySeed, CHALLENGE_MODIFIERS, getRandomModifier } from './utils/procedural'

function App() {
  const [showModeSelector, setShowModeSelector] = useState(false)
  const [showSkillTree, setShowSkillTree] = useState(false)
  const [showToolsShop, setShowToolsShop] = useState(false)
  const [showProceduralMissions, setShowProceduralMissions] = useState(false)
  const gameState = useGameState(state => state.gameState)

  // Scroll to top when game state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [gameState])

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])
  const totalCareerScore = useGameState(state => state.totalCareerScore)
  const reputation = useGameState(state => state.reputation)
  const credits = useGameState(state => state.credits)
  const initializeLevel = useGameState(state => state.initializeLevel)
  const initializeProceduralLevel = useGameState(state => state.initializeProceduralLevel)
  const initializeEndlessMode = useGameState(state => state.initializeEndlessMode)
  const resetGame = useGameState(state => state.resetGame)
  
  const currentRank = getCareerRank(totalCareerScore)

  const handleStartGame = (levelId = 1) => {
    console.log('Starting level:', levelId)
    initializeLevel(levelId)
  }

  const handleStartProcedural = (difficulty = 'normal', seed = null) => {
    console.log('Starting procedural level:', difficulty, seed)
    initializeProceduralLevel(difficulty, seed)
  }

  const handleStartProceduralMission = (mission) => {
    console.log('Starting procedural mission:', mission)
    // TODO: Initialize level with mission data
    initializeProceduralLevel('normal', mission.seed)
    setShowProceduralMissions(false)
  }

  const handleStartEndless = () => {
    console.log('Starting endless mode')
    initializeEndlessMode()
  }

  const handleStartChallenge = () => {
    console.log('Starting challenge mode')
    const modifier = getRandomModifier()
    console.log('Modifier:', modifier)
    initializeProceduralLevel('normal', null, modifier)
  }

  const handleRetry = () => {
    const currentLevel = useGameState.getState().currentLevel
    initializeLevel(currentLevel)
  }

  const handleContinueToQuiz = () => {
    useGameState.setState({ gameState: 'quiz' })
  }

  const handleContinueToDebrief = () => {
    useGameState.setState({ gameState: 'debrief' })
  }

  const handleContinue = () => {
    // Go back to menu after debrief
    resetGame()
  }

  const handleMainMenu = () => {
    resetGame()
  }

  // Render based on game state
  if (gameState === 'briefing') {
    return <BriefingScreen />
  }

  if (gameState === 'playing' || gameState === 'paused') {
    return <GameScreen />
  }

  if (gameState === 'complete') {
    return <ResultsScreen onContinue={handleContinueToQuiz} />
  }

  if (gameState === 'quiz') {
    return <QuizScreen onContinue={handleContinueToDebrief} />
  }

  if (gameState === 'debrief') {
    return <EducationalDebrief onContinue={handleContinue} />
  }

  if (gameState === 'gameover') {
    return <GameOverScreen onRetry={handleRetry} onMainMenu={handleMainMenu} />
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black relative overflow-hidden">
      {/* Animated background elements - Blue theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)',
        }}></div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl"
        >
          {/* Title with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-8">
              <h1 className="text-8xl font-heading font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 text-transparent bg-clip-text relative z-10 drop-shadow-[0_0_30px_rgba(0,245,255,0.5)]">
                NETWORK NINJA
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 blur-3xl opacity-40 animate-pulse"></div>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-heading font-bold text-cyan-300 tracking-wide">
                Stealth Infiltration Game
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed px-8">
                Hack into corporate networks without being detected. Learn real cybersecurity 
                concepts through engaging stealth gameplay.
              </p>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-4 text-sm"
            >
              <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 rounded-full text-cyan-300 font-mono">v2.0</span>
              <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/40 rounded-full text-blue-300 font-mono">50+ Features</span>
              <span className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/40 rounded-full text-cyan-300 font-mono">Infinite Replayability</span>
            </motion.div>
          </motion.div>

          {/* Campaign Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
              <h2 className="text-2xl font-heading font-bold text-cyan-400">CAMPAIGN</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartGame(1)}
                className="group relative p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Play className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <div className="text-lg font-bold text-cyan-300">Level 1</div>
                <div className="text-xs text-gray-400 mt-1">Tutorial Mission</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartGame(2)}
                className="group relative p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Play className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <div className="text-lg font-bold text-cyan-300">Level 2</div>
                <div className="text-xs text-gray-400 mt-1">Advanced Challenge</div>
              </motion.button>
            </div>

          </motion.div>

          {/* Game Modes Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mt-8"
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <h2 className="text-2xl font-heading font-bold text-purple-400">GAME MODES</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProceduralMissions(true)}
              className="w-full px-8 py-6 bg-gradient-to-r from-purple-600/80 to-pink-600/80 border-2 border-purple-500/50 text-white font-heading font-bold text-lg rounded-xl hover:from-purple-500/80 hover:to-pink-500/80 hover:border-purple-400 transition-all inline-flex items-center justify-center gap-3 group relative backdrop-blur-sm"
              title="Infinite unique missions with modifiers!"
            >
              <Shuffle className="w-6 h-6" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  PROCEDURAL MISSIONS
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">NEW</span>
                </div>
                <div className="text-xs text-purple-200 font-normal mt-1">Infinite unique missions with random modifiers</div>
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 border border-purple-500 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                🎲 Infinite variety • Modifiers • Daily challenges
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartProcedural('normal', getDailySeed())}
              className="w-full px-8 py-6 bg-gradient-to-r from-yellow-600/80 to-orange-600/80 border-2 border-yellow-500/50 text-white font-heading font-bold text-lg rounded-xl hover:from-yellow-500/80 hover:to-orange-500/80 hover:border-yellow-400 transition-all inline-flex items-center justify-center gap-3 group relative backdrop-blur-sm"
              title="Same network for everyone today - compete on leaderboards!"
            >
              <Trophy className="w-6 h-6" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  DAILY CHALLENGE
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">24h</span>
                </div>
                <div className="text-xs text-yellow-200 font-normal mt-1">Same network for all players today</div>
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 border border-yellow-500 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                🏆 Compete on global leaderboards!
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartEndless}
              className="w-full px-8 py-6 bg-gradient-to-r from-red-600/80 to-purple-600/80 border-2 border-red-500/50 text-white font-heading font-bold text-lg rounded-xl hover:from-red-500/80 hover:to-purple-500/80 hover:border-red-400 transition-all inline-flex items-center justify-center gap-3 group relative backdrop-blur-sm"
              title="Survive waves of increasing difficulty!"
            >
              <Infinity className="w-6 h-6" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  ENDLESS MODE
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">∞</span>
                </div>
                <div className="text-xs text-red-200 font-normal mt-1">Survive infinite waves of increasing difficulty</div>
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 border border-red-500 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                ∞ How long can you last?
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartChallenge}
              className="w-full px-8 py-6 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 border-2 border-cyan-500/50 text-white font-heading font-bold text-lg rounded-xl hover:from-cyan-500/80 hover:to-blue-500/80 hover:border-cyan-400 transition-all inline-flex items-center justify-center gap-3 group relative backdrop-blur-sm"
              title="Random challenge modifier with score multiplier!"
            >
              <Zap className="w-6 h-6" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  CHALLENGE MODE
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">HARD</span>
                </div>
                <div className="text-xs text-cyan-200 font-normal mt-1">Modified rules with bonus score multipliers</div>
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 border border-cyan-500 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                ⚡ Random modifiers for extra challenge!
              </div>
            </motion.button>
          </motion.div>

          {/* Stats Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-3 max-w-2xl mx-auto"
          >
            {/* Career Rank */}
            <div className={`p-4 rounded-lg border ${currentRank.borderColor} ${currentRank.bgColor}`}>
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Rank</div>
                <div className="text-2xl mb-1">{currentRank.icon}</div>
                <div className={`text-sm font-heading font-bold ${currentRank.color}`}>
                  {currentRank.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalCareerScore.toLocaleString()} pts
                </div>
              </div>
            </div>

            {/* Reputation */}
            <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Reputation</div>
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm font-heading font-bold text-yellow-400">
                  {reputation.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Rep Points
                </div>
              </div>
            </div>

            {/* Credits */}
            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10">
              <div className="text-center">
                <div className="text-xs text-gray-400 mb-1">Credits</div>
                <div className="text-2xl mb-1">💰</div>
                <div className="text-sm font-heading font-bold text-green-400">
                  {credits.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Currency
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progression Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSkillTree(true)}
              className="px-6 py-3 bg-purple-600 text-white font-heading font-bold rounded-lg hover:bg-purple-500 transition-colors inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Skill Tree
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowToolsShop(true)}
              className="px-6 py-3 bg-green-600 text-white font-heading font-bold rounded-lg hover:bg-green-500 transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Tools Shop
            </motion.button>
          </motion.div>

          {/* Footer */}
        </motion.div>
      </div>

      {/* Skill Tree Modal */}
      {showSkillTree && <SkillTreeScreen onClose={() => setShowSkillTree(false)} />}
      
      {/* Tools Shop Modal */}
      {showToolsShop && <ToolsShop onClose={() => setShowToolsShop(false)} />}
      
      {/* Procedural Missions Screen - Fixed overlay */}
      {showProceduralMissions && (
        <div className="fixed inset-0 z-50 overflow-auto">
          <ProceduralMissionScreen
            onStartMission={handleStartProceduralMission}
            onBack={() => setShowProceduralMissions(false)}
          />
        </div>
      )}
    </div>
  )
}

export default App

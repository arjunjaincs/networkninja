import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, AlertTriangle, Eye, MessageSquare, Shield, Terminal as TerminalIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import StatusBar from './StatusBar'
import NetworkMap from './NetworkMap'
import ActionPanel from './ActionPanel'
import ObjectivePanel from './ObjectivePanel'
import ActionLog from './ActionLog'
import SocialEngineeringChat from './SocialEngineeringChat'
import HackingTerminal from './HackingTerminal'
import CommandHints from './CommandHints'
import DynamicNewsTicker from './DynamicNewsTicker'
import NewsArticleModal from './NewsArticleModal'
import NetworkTrafficOverlay from './NetworkTrafficOverlay'
import TutorialHints from './TutorialHints'
import XRayMode from './XRayMode'
import useGameState from '../hooks/useGameState'
import useTimer from '../hooks/useTimer'
import { checkForDetection } from '../utils/detection'
import { triggerRandomEvent, getEventColor } from '../data/cinematicEvents'
import { actions } from '../data/actions'

export default function GameScreen() {
  useTimer() // Start the timer hook
  
  const [executingAction, setExecutingAction] = useState(null)
  const [xrayMode, setXrayMode] = useState(false)
  const [xrayAction, setXrayAction] = useState(null)
  const [showSocialEngineering, setShowSocialEngineering] = useState(false)
  const [showCounterHackWarning, setShowCounterHackWarning] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalMinimized, setTerminalMinimized] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [counterHackStatus, setCounterHackStatus] = useState({ active: false, progress: 0, timeRemaining: 30 })
  const [showSidebar, setShowSidebar] = useState(true)
  const gameState = useGameState(state => state.gameState)
  const activeEvent = useGameState(state => state.activeEvent)
  const levelData = useGameState(state => state.levelData)
  const pauseGame = useGameState(state => state.pauseGame)
  const resumeGame = useGameState(state => state.resumeGame)
  const triggerEvent = useGameState(state => state.triggerEvent)
  const clearEvent = useGameState(state => state.clearEvent)
  const updateVisibility = useGameState(state => state.updateVisibility)
  const addToActionLog = useGameState(state => state.addToActionLog)
  const compromiseNode = useGameState(state => state.compromiseNode)
  
  // AI Systems
  const aiDefender = useGameState(state => state.aiDefender)
  const counterHack = useGameState(state => state.counterHack)
  const currentSysAdmin = useGameState(state => state.currentSysAdmin)
  const handleSocialEngineeringSuccess = useGameState(state => state.handleSocialEngineeringSuccess)
  const handleSocialEngineeringFailure = useGameState(state => state.handleSocialEngineeringFailure)
  const checkCounterHack = useGameState(state => state.checkCounterHack)
  const deployCountermeasures = useGameState(state => state.deployCountermeasures)
  const disconnectFromTrace = useGameState(state => state.disconnectFromTrace)
  const attemptCounterTrace = useGameState(state => state.attemptCounterTrace)
  const visibility = useGameState(state => state.visibility)
  const discoverNode = useGameState(state => state.discoverNode)
  const currentNode = useGameState(state => state.currentNode)
  const network = useGameState(state => state.network)
  const checkObjectives = useGameState(state => state.checkObjectives)
  const gameOver = useGameState(state => state.gameOver)
  
  // Narrative systems
  const newsHeadlines = useGameState(state => state.newsHeadlines)
  const generateNews = useGameState(state => state.generateNews)

  // Counter-hack timer effect
  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      const status = counterHack.updateTrace(100) // Update every 100ms
      const fullStatus = counterHack.getStatus()
      setCounterHackStatus(fullStatus) // Update UI
      
      if (status.traced) {
        // Player was traced - game over
        gameOver('You were traced by the sysadmin!')
      }
    }, 100)

    return () => clearInterval(interval)
  }, [gameState, counterHack, gameOver])

  const handleActionExecute = async (action) => {
    if (executingAction) return // Prevent multiple actions at once

    setExecutingAction(action)

    // Get current node data
    const currentNodeData = network?.nodes?.find(n => n.id === currentNode)

    // Simulate action execution time
    await new Promise(resolve => setTimeout(resolve, action.timeCost * 100)) // Scaled down for demo

    // Calculate success
    const roll = Math.random() * 100
    const success = roll <= action.successRate

    if (success) {
      // Update visibility
      updateVisibility(action.visibilityIncrease)

      // Handle specific action effects
      if (action.category === 'reconnaissance') {
        // Discover connected nodes
        if (currentNodeData && action.id === 'passiveScan') {
          // Discover one random connected node
          const undiscoveredConnections = currentNodeData.connections.filter(
            connId => !network.nodes.find(n => n.id === connId)?.discovered
          )
          if (undiscoveredConnections.length > 0) {
            const randomConn = undiscoveredConnections[Math.floor(Math.random() * undiscoveredConnections.length)]
            discoverNode(randomConn)
          }
        } else if (action.id === 'networkMapping') {
          // Discover all nodes
          network.nodes.forEach(node => {
            if (!node.discovered) {
              discoverNode(node.id)
            }
          })
        }
      } else if (action.category === 'exploitation') {
        // Compromise current node
        compromiseNode(currentNode)
      } else if (action.category === 'exfiltration') {
        // Mark data as exfiltrated (triggers objective check)
        checkObjectives()
      }

      addToActionLog(action, 'success', `Successfully executed ${action.name}`)

      // AI Defender analyzes action
      aiDefender.analyzeAction({
        type: action.id,
        success: true,
        targetNode: currentNode
      })

      // Check for honeypot
      const honeypotResult = aiDefender.checkHoneypot(action)
      if (honeypotResult) {
        updateVisibility(honeypotResult.visibility)
        addToActionLog(
          { name: 'HONEYPOT', icon: '🍯' },
          'failure',
          honeypotResult.message
        )
      }

      // Check for IDS detection
      const detected = checkForDetection(visibility + action.visibilityIncrease, action.visibilityIncrease)
      if (detected) {
        addToActionLog(
          { name: 'IDS ALERT', icon: '🚨' },
          'failure',
          'Security systems detected suspicious activity!'
        )
        updateVisibility(10) // Additional penalty
      }

      // Check if counter-hack should start
      checkCounterHack()

      // Generate news for significant actions
      if (action.category === 'exfiltration' || action.category === 'exploitation' || visibility > 60) {
        const newsAction = {
          type: action.category,
          target: currentNodeData?.name || 'Unknown Target',
          visibility,
          dataStolen: action.category === 'exfiltration',
          compromised: action.category === 'exploitation',
          timestamp: Date.now()
        }
        generateNews(newsAction)
      }
    } else {
      addToActionLog(action, 'failure', `${action.name} failed`)
      updateVisibility(action.visibilityIncrease * 0.5) // Half visibility on failure
    }

    setExecutingAction(null)
    checkObjectives()
  }

  const handleCommandExecute = async (actionId, params = {}) => {
    // Map command actions to game actions
    const actionMap = {
      'passive_scan': 'passiveScan',
      'port_scan': 'portScan',
      'exploit': 'exploitKnownVuln',
      'brute_force': 'bruteForce',
      'lateral_movement': 'lateralMovement',
      'data_exfiltration': 'dataExfiltration',
      'cover_tracks': 'clearLogs',
    }

    const gameActionId = actionMap[actionId] || actionId
    const action = actions[gameActionId]

    if (action) {
      // Merge command params with action
      const enhancedAction = {
        ...action,
        ...params,
        visibilityIncrease: params.visibility !== undefined ? params.visibility : action.visibilityIncrease,
        timeCost: params.timeCost || action.timeCost,
      }
      
      await handleActionExecute(enhancedAction)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-cyber-dark">
      {/* Status Bar */}
      <StatusBar />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Sidebar - Objectives (Collapsible) */}
        {showSidebar && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 flex-shrink-0"
          >
            <ObjectivePanel />
          </motion.div>
        )}

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute left-4 top-24 z-30 p-2 bg-gray-900/95 border-2 border-cyan-500/50 rounded-lg hover:bg-gray-800 transition-colors backdrop-blur-sm"
          title={showSidebar ? "Hide sidebar" : "Show sidebar"}
        >
          {showSidebar ? <ChevronLeft className="w-5 h-5 text-cyan-400" /> : <ChevronRight className="w-5 h-5 text-cyan-400" />}
        </button>

        {/* Center - Network Map */}
        <div className="flex-1 relative">
          <NetworkMap />
          
          {/* Network Traffic Overlay */}
          <NetworkTrafficOverlay />

          {/* Pause/Resume Button - Top Right Corner */}
          <div className="absolute top-4 right-4 z-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => gameState === 'playing' ? pauseGame() : resumeGame()}
              className="px-4 py-2 bg-gray-900/95 border-2 border-cyan-500/70 rounded-lg hover:bg-gray-800 transition-colors backdrop-blur-sm shadow-lg"
            >
              <div className="flex items-center gap-2">
                {gameState === 'playing' ? (
                  <>
                    <Pause className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-cyan-400">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400">Resume</span>
                  </>
                )}
              </div>
            </motion.button>
          </div>

          {/* Executing Action Overlay */}
          <AnimatePresence>
            {executingAction && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl mb-4"
                  >
                    {executingAction.icon}
                  </motion.div>
                  <h3 className="text-2xl font-heading font-bold text-cyan-300 mb-2">
                    Executing {executingAction.name}
                  </h3>
                  <p className="text-gray-400">{executingAction.description}</p>
                  <motion.div
                    className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                  >
                    <motion.div
                      className="h-full bg-cyber-cyan"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: executingAction.timeCost * 0.1 }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paused Overlay */}
          <AnimatePresence>
            {gameState === 'paused' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center"
                >
                  <h2 className="text-6xl font-heading font-bold text-cyan-300 mb-4">PAUSED</h2>
                  <p className="text-gray-400 mb-6">Click the play button to resume</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resumeGame}
                    className="px-8 py-3 bg-cyber-cyan text-cyber-dark font-bold rounded-lg"
                  >
                    Resume Mission
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar - Actions & Terminal */}
        <div className={`flex-shrink-0 flex flex-col gap-4 transition-all duration-300 ${showTerminal ? 'w-[50vw]' : 'w-96'}`}>
          {/* AI Threat Meter */}
          <div className="bg-gray-900/95 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-sm font-bold text-red-400">AI THREAT LEVEL</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${aiDefender.adaptationLevel}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-gray-400">{aiDefender.adaptationLevel}%</span>
              <span className="text-gray-400">
                {aiDefender.adaptationLevel < 30 ? 'Low' : 
                 aiDefender.adaptationLevel < 60 ? 'Medium' : 
                 aiDefender.adaptationLevel < 90 ? 'High' : 'Critical'}
              </span>
            </div>
            {aiDefender.getRecentCountermeasures().length > 0 && (
              <div className="mt-2 text-xs text-yellow-400">
                ⚠️ {aiDefender.getRecentCountermeasures().length} active countermeasures
              </div>
            )}
          </div>

          {/* Terminal Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTerminal(!showTerminal)}
            className={`px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
              showTerminal 
                ? 'bg-green-600 border-2 border-green-400 text-white shadow-lg shadow-green-500/50' 
                : 'bg-gray-800 border-2 border-gray-600 text-gray-300 hover:border-green-500'
            }`}
          >
            <TerminalIcon className="w-5 h-5" />
            {showTerminal ? 'Hide Terminal' : 'Show Terminal (Expert Mode)'}
          </motion.button>

          {/* Terminal or Action Panel */}
          {showTerminal ? (
            <div className="flex-1 overflow-hidden">
              <HackingTerminal 
                onCommandExecute={handleCommandExecute}
                isMinimized={terminalMinimized}
                onToggleMinimize={() => setTerminalMinimized(!terminalMinimized)}
              />
            </div>
          ) : (
            <ActionPanel onActionExecute={handleActionExecute} />
          )}
        </div>
      </div>

      {/* Bottom - Action Log */}
      <ActionLog />

      {/* Cinematic Event Notification */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 max-w-2xl"
          >
            <div className={`p-6 rounded-lg border-2 ${getEventColor(activeEvent)} bg-gray-900/95 backdrop-blur-sm shadow-2xl`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{activeEvent.icon}</div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-heading font-bold ${getEventColor(activeEvent)} mb-2`}>
                    {activeEvent.name}
                  </h3>
                  <p className="text-gray-300 mb-3">{activeEvent.description}</p>
                  <div className={`text-sm font-bold ${getEventColor(activeEvent)}`}>
                    {activeEvent.effect.message}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Duration: {activeEvent.effect.duration}s
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Buttons - Only show when not paused */}
      {gameState === 'playing' && (
        <div className="fixed bottom-4 left-4 z-30 flex gap-3">
          {/* Social Engineering Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSocialEngineering(true)}
            className="px-4 py-3 bg-cyan-600 border-2 border-cyan-400 rounded-lg text-white font-bold hover:bg-cyan-500 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/50"
            title="Try to manipulate the sysadmin"
          >
            <MessageSquare className="w-5 h-5" />
            Social Eng
          </motion.button>

          {/* X-Ray Mode Toggle Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setXrayMode(true)
              setXrayAction('reconnaissance')
            }}
            className="px-4 py-3 bg-purple-600 border-2 border-purple-400 rounded-lg text-white font-bold hover:bg-purple-500 transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/50"
            title="Learn about cybersecurity concepts in real-time"
          >
            <Eye className="w-5 h-5" />
            X-Ray
          </motion.button>
        </div>
      )}

      {/* Social Engineering Chat */}
      {showSocialEngineering && (
        <SocialEngineeringChat
          sysAdmin={currentSysAdmin}
          onSuccess={handleSocialEngineeringSuccess}
          onFailure={handleSocialEngineeringFailure}
          onClose={() => setShowSocialEngineering(false)}
        />
      )}

      {/* X-Ray Mode Modal */}
      {xrayMode && (
        <XRayMode 
          currentAction={xrayAction} 
          onClose={() => setXrayMode(false)} 
        />
      )}

      {/* Tutorial Hints */}
      <TutorialHints />

      {/* Dynamic News Ticker */}
      {newsHeadlines.length > 0 && (
        <DynamicNewsTicker
          headlines={newsHeadlines}
          onHeadlineClick={(headline) => {
            const article = generateNews({ 
              type: headline.type, 
              target: 'Previous Target',
              timestamp: headline.timestamp 
            })
            setSelectedArticle(article)
          }}
        />
      )}

      {/* News Article Modal */}
      {selectedArticle && (
        <NewsArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* Counter-Hack Warning */}
      {counterHackStatus.active && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-32 right-4 z-40 bg-red-900/95 border-2 border-red-500 rounded-lg p-4 backdrop-blur-sm max-w-sm shadow-2xl shadow-red-500/50"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-300 mb-1">⚠️ INCOMING TRACE!</h3>
              <p className="text-sm text-red-200 mb-2">Sysadmin is tracing your connection!</p>
              
              {/* Timer Display */}
              <div className="text-2xl font-bold text-red-400 mb-3 text-center">
                {counterHackStatus.timeRemaining}s
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-3 bg-red-950 rounded-full overflow-hidden mb-3 border border-red-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
                  animate={{ width: `${counterHackStatus.progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => deployCountermeasures()}
                  disabled={counterHackStatus.countermeasuresRemaining === 0}
                  className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  🛡️ Countermeasures ({counterHackStatus.countermeasuresRemaining})
                </button>
                <button
                  onClick={() => attemptCounterTrace()}
                  disabled={!counterHack.getStatus().canCounterTrace}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 rounded text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎯 Counter-Trace
                </button>
                <button
                  onClick={() => disconnectFromTrace()}
                  className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-xs font-bold"
                >
                  🔌 Disconnect
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

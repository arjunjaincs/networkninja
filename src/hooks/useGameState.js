import { create } from 'zustand'
import { levels } from '../data/levels'
import { actions } from '../data/actions'
import { checkForDetection } from '../utils/detection'
import { AIDefender } from '../systems/AIDefender'
import { CounterHackSystem } from '../systems/CounterHack'
import { getRandomSysAdmin } from '../data/sysAdmins'
import { NewsGenerator } from '../systems/NewsGenerator'
import { MissionGenerator } from '../systems/MissionGenerator'
import { NPCManager } from '../systems/NPCMemory'
import { generateProceduralNetwork } from '../utils/procedural'
import { GEAR_ITEMS } from '../data/metaProgression'
import { getNetworkByLevel } from '../data/networks'

// Helper functions
const getLevel = (levelId) => {
  return levels[levelId] || levels[1]
}

// Counter for unique IDs
let logIdCounter = 0

const useGameState = create((set, get) => ({
  // Game state
  currentLevel: 1,
  currentNode: null,
  visibility: 0,
  noiseLevel: 0,
  alertStatus: 'safe', // safe, suspicious, detected
  timeRemaining: 3600,
  timerActive: false,
  compromisedNodes: [],
  discoveredNodes: [],
  objectives: {
    primary: false,
    secondary: false,
    tertiary: false,
  },
  actionLog: [],
  score: 0,
  totalCareerScore: 0, // Cumulative score across all levels
  gameState: 'menu', // menu, briefing, playing, paused, complete, gameover
  network: null,
  levelData: null,
  tacticsUsed: [], // Track tactics used during gameplay
  quizAnswer: null, // Store quiz answer
  
  // Meta-progression
  reputation: 0,
  credits: 0,
  ownedGear: [],
  equippedGear: [],
  completedContracts: [],
  
  // Skill Tree
  unlockedSkills: [],
  
  // Hack Tools Inventory
  toolInventory: [],
  
  // Cinematic Events
  activeEvent: null,
  lastEventTime: 0,
  
  // Endless mode
  endlessWave: 0,
  endlessMode: false,
  
  // Challenge modifiers
  activeModifier: null,

  // AI Systems
  aiDefender: new AIDefender(),
  counterHack: new CounterHackSystem(),
  currentSysAdmin: getRandomSysAdmin(),
  socialEngineeringActive: false,
  idsDisabledUntil: null,

  // Narrative Systems
  newsGenerator: new NewsGenerator(),
  missionGenerator: new MissionGenerator(),
  npcManager: new NPCManager(),
  newsHeadlines: [],
  generatedMissions: [],

  // Actions
  initializeLevel: (levelId) => {
    const levelData = getLevel(levelId)
    const network = getNetworkByLevel(levelId)
    
    // Find starting node and mark it as compromised
    const startingNode = network.nodes.find(n => n.id === levelData.startingNode)
    if (startingNode) {
      startingNode.compromised = true
    }

    set({
      currentLevel: levelId,
      currentNode: levelData.startingNode,
      visibility: 0,
      noiseLevel: 0,
      alertStatus: 'safe',
      timeRemaining: levelData.timeLimit,
      timerActive: false,
      compromisedNodes: [levelData.startingNode],
      discoveredNodes: network.nodes.filter(n => n.discovered).map(n => n.id),
      objectives: {
        primary: false,
        secondary: false,
        tertiary: false,
      },
      actionLog: [],
      score: 0,
      gameState: 'briefing',
      network,
      levelData,
      tacticsUsed: [],
      quizAnswer: null,
    })
  },

  startGame: () => {
    set({ gameState: 'playing', timerActive: true })
  },

  pauseGame: () => {
    set({ gameState: 'paused', timerActive: false })
  },

  resumeGame: () => {
    set({ gameState: 'playing', timerActive: true })
  },

  updateTimer: () => {
    const { timeRemaining, timerActive, gameState } = get()
    if (timerActive && gameState === 'playing' && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 })
      
      // Check if time ran out
      if (timeRemaining - 1 <= 0) {
        get().gameOver('Time ran out!')
      }
    }
  },

  updateVisibility: (amount) => {
    const { visibility } = get()
    const newVisibility = Math.max(0, Math.min(100, visibility + amount))
    set({ visibility: newVisibility })
    
    // Update alert status based on visibility
    get().updateAlertStatus()
    
    // Check for detection
    if (newVisibility >= 100) {
      get().gameOver('Detected by security systems!')
    }
  },

  updateAlertStatus: () => {
    const { visibility } = get()
    let alertStatus = 'safe'
    
    if (visibility >= 91) {
      alertStatus = 'critical'
    } else if (visibility >= 61) {
      alertStatus = 'high'
    } else if (visibility >= 31) {
      alertStatus = 'suspicious'
    }
    
    set({ alertStatus })
  },

  moveToNode: (nodeId) => {
    const { network, discoveredNodes } = get()
    const node = network.nodes.find(n => n.id === nodeId)
    
    if (node) {
      set({ currentNode: nodeId })
      
      // Discover the node if not already discovered
      if (!discoveredNodes.includes(nodeId)) {
        set({ discoveredNodes: [...discoveredNodes, nodeId] })
        node.discovered = true
      }
    }
  },

  compromiseNode: (nodeId) => {
    const { network, compromisedNodes } = get()
    const node = network.nodes.find(n => n.id === nodeId)
    
    if (node && !compromisedNodes.includes(nodeId)) {
      node.compromised = true
      set({ compromisedNodes: [...compromisedNodes, nodeId] })
      
      // Check if this completes any objectives
      get().checkObjectives()
    }
  },

  discoverNode: (nodeId) => {
    const { network, discoveredNodes } = get()
    const node = network.nodes.find(n => n.id === nodeId)
    
    if (node && !discoveredNodes.includes(nodeId)) {
      node.discovered = true
      set({ discoveredNodes: [...discoveredNodes, nodeId] })
    }
  },

  addToActionLog: (action, result, details) => {
    const { actionLog, tacticsUsed } = get()
    const timestamp = new Date().toLocaleTimeString()
    
    const logEntry = {
      id: `log_${logIdCounter++}`, // Unique ID using counter
      timestamp,
      action: action.name,
      result, // success, failure
      details,
      icon: action.icon,
      category: action.category,
    }
    
    // Track tactics used (for after-action report)
    if (result === 'success' && action.category) {
      const tacticName = action.category.replace('_', ' ')
      if (!tacticsUsed.includes(tacticName)) {
        set({ tacticsUsed: [...tacticsUsed, tacticName] })
      }
    }
    
    // Keep only last 10 entries
    const newLog = [logEntry, ...actionLog].slice(0, 10)
    set({ actionLog: newLog })
  },

  checkObjectives: () => {
    const { levelData, compromisedNodes, visibility, timeRemaining, objectives } = get()
    const newObjectives = { ...objectives }
    
    // Check primary objective
    if (levelData.objectives.primary.targetNode) {
      if (compromisedNodes.includes(levelData.objectives.primary.targetNode)) {
        newObjectives.primary = true
        
        // Only check secondary/tertiary when primary is complete
        // Check secondary objective (visibility threshold)
        if (levelData.objectives.secondary.threshold) {
          if (visibility < levelData.objectives.secondary.threshold) {
            newObjectives.secondary = true
          }
        }
        
        // Check tertiary objective (time or specific node)
        if (levelData.objectives.tertiary.timeLimit) {
          const timeElapsed = levelData.timeLimit - timeRemaining
          if (timeElapsed <= levelData.objectives.tertiary.timeLimit) {
            newObjectives.tertiary = true
          }
        } else if (levelData.objectives.tertiary.targetNode) {
          if (compromisedNodes.includes(levelData.objectives.tertiary.targetNode)) {
            newObjectives.tertiary = true
          }
        }
      }
    }
    
    set({ objectives: newObjectives })
    
    // Check if level is complete
    if (newObjectives.primary) {
      get().completeLevel()
    }
  },

  completeLevel: () => {
    const { objectives, visibility, timeRemaining, levelData, totalCareerScore } = get()
    
    // Calculate score
    let score = 1000 // Base score
    if (objectives.secondary) score += 500
    if (objectives.tertiary) score += 300
    score += Math.floor((100 - visibility) * 5) // Stealth bonus
    score += Math.floor(timeRemaining / 10) // Time bonus
    
    set({ 
      gameState: 'complete',
      timerActive: false,
      score,
      totalCareerScore: totalCareerScore + score, // Add to career total
    })
  },

  setQuizAnswer: (answer) => {
    set({ quizAnswer: answer })
  },

  addQuizBonus: (bonus) => {
    const { score, totalCareerScore } = get()
    set({ 
      score: score + bonus,
      totalCareerScore: totalCareerScore + bonus,
    })
  },

  // Procedural and endless mode
  initializeProceduralLevel: (difficulty, seed = null, modifier = null) => {
    const network = generateProceduralNetwork(difficulty, seed)
    
    // Create level data for procedural level
    const levelData = {
      id: 'procedural',
      name: `Procedural Network (${difficulty})`,
      difficulty,
      timeLimit: modifier?.timeLimit || (difficulty === 'easy' ? 3600 : difficulty === 'normal' ? 1800 : 1200),
      objectives: {
        primary: {
          id: 'steal-data',
          description: 'Exfiltrate target data from the network',
          targetNode: network.nodes.find(n => n.hasData)?.id,
          completed: false,
        },
        secondary: {
          id: 'stealth',
          description: 'Maintain stealth below 60% visibility',
          threshold: 60,
          completed: false,
        },
        tertiary: {
          id: 'speed',
          description: 'Complete within time limit',
          completed: false,
        },
      },
      startingNode: network.nodes[0].id,
      briefing: {
        title: 'Procedural Mission',
        description: 'Infiltrate this randomly generated network and steal the target data.',
        target: 'Unknown Data',
        intel: ['Network topology is randomized', 'Vulnerabilities vary', 'Adapt your strategy'],
        tips: ['Scout thoroughly', 'Plan your route', 'Stay stealthy'],
      },
      educational: {
        concepts: ['Adaptive Tactics', 'Dynamic Planning', 'Improvisation'],
        realWorldExample: {
          title: 'Real-world attacks require adaptation',
          description: 'No two networks are identical. Professional penetration testers must adapt.',
          lesson: 'Flexibility and improvisation are key skills.',
          references: [],
          impact: {},
        },
        defenseStrategies: ['Network diversity', 'Unpredictable configurations'],
        tools: ['Automated scanners', 'Adaptive exploits'],
      },
    }

    set({
      currentLevel: 'procedural',
      currentNode: network.nodes[0].id,
      visibility: 0,
      noiseLevel: 0,
      alertStatus: 'safe',
      timeRemaining: levelData.timeLimit,
      timerActive: false,
      compromisedNodes: [network.nodes[0].id],
      discoveredNodes: network.nodes.filter(n => n.discovered).map(n => n.id),
      objectives: {
        primary: false,
        secondary: false,
        tertiary: false,
      },
      actionLog: [],
      score: 0,
      gameState: 'briefing',
      network,
      levelData,
      tacticsUsed: [],
      quizAnswer: null,
      activeModifier: modifier,
    })
  },

  initializeEndlessMode: () => {
    const network = generateProceduralNetwork('normal')
    
    // Mark first node as discovered
    network.nodes[0].discovered = true
    
    set({
      endlessMode: true,
      endlessWave: 1,
      currentLevel: 'endless',
      currentNode: network.nodes[0].id,
      visibility: 0,
      noiseLevel: 0,
      alertStatus: 'safe',
      timeRemaining: 600, // 10 minutes per wave
      timerActive: true,
      compromisedNodes: [network.nodes[0].id],
      discoveredNodes: [network.nodes[0].id],
      objectives: {
        primary: false,
        secondary: false,
        tertiary: false,
      },
      actionLog: [{
        action: { name: 'ENDLESS MODE START', icon: '∞' },
        result: 'success',
        message: `Wave 1 - Survive and compromise the network!`,
        timestamp: new Date().toLocaleTimeString(),
      }],
      score: 0,
      gameState: 'playing',
      network,
      levelData: {
        id: 'endless',
        name: `Endless Mode - Wave 1`,
        difficulty: 'normal',
        timeLimit: 600,
        objectives: {
          primary: {
            id: 'survive',
            description: 'Compromise all nodes before time runs out',
            completed: false,
          },
        },
        startingNode: network.nodes[0].id,
      },
      tacticsUsed: [],
    })
  },

  nextEndlessWave: () => {
    const { endlessWave, score } = get()
    
    // Increase difficulty with each wave
    const difficulty = endlessWave < 3 ? 'normal' : endlessWave < 6 ? 'hard' : 'expert'
    const network = generateProceduralNetwork(difficulty)
    
    set({
      endlessWave: endlessWave + 1,
      currentNode: network.nodes[0].id,
      visibility: Math.max(0, get().visibility - 20), // Slight visibility reduction
      compromisedNodes: [network.nodes[0].id],
      discoveredNodes: network.nodes.filter(n => n.discovered).map(n => n.id),
      timeRemaining: 600,
      network,
      gameState: 'playing',
    })
  },

  // Meta-progression
  addReputation: (amount) => {
    const { reputation } = get()
    set({ reputation: reputation + amount })
  },

  addCredits: (amount) => {
    const { credits } = get()
    set({ credits: credits + amount })
  },

  purchaseGear: (gearId) => {
    const { credits, ownedGear } = get()
    const gear = GEAR_ITEMS[gearId]
    
    if (gear && credits >= gear.cost && !ownedGear.includes(gearId)) {
      set({
        credits: credits - gear.cost,
        ownedGear: [...ownedGear, gearId],
      })
      return true
    }
    return false
  },

  equipGear: (gearId) => {
    const { ownedGear, equippedGear } = get()
    if (ownedGear.includes(gearId) && !equippedGear.includes(gearId)) {
      set({ equippedGear: [...equippedGear, gearId] })
    }
  },

  unequipGear: (gearId) => {
    const { equippedGear } = get()
    set({ equippedGear: equippedGear.filter(id => id !== gearId) })
  },

  completeContract: (contractId) => {
    const { completedContracts } = get()
    if (!completedContracts.includes(contractId)) {
      set({ completedContracts: [...completedContracts, contractId] })
    }
  },

  // Skill Tree
  unlockSkill: (skillId, cost) => {
    const { reputation, unlockedSkills } = get()
    if (reputation >= cost && !unlockedSkills.includes(skillId)) {
      set({
        reputation: reputation - cost,
        unlockedSkills: [...unlockedSkills, skillId],
      })
      return true
    }
    return false
  },

  // Hack Tools
  craftTool: (toolId, cost) => {
    const { credits, toolInventory } = get()
    const { HACK_TOOLS } = require('../data/hackTools')
    const tool = HACK_TOOLS[toolId]
    
    if (credits >= cost && tool) {
      set({
        credits: credits - cost,
        toolInventory: [...toolInventory, { ...tool, remainingUses: tool.uses }],
      })
      return true
    }
    return false
  },

  useTool: (toolId) => {
    const { toolInventory } = get()
    const toolIndex = toolInventory.findIndex(t => t.id === toolId && t.remainingUses > 0)
    
    if (toolIndex >= 0) {
      const newInventory = [...toolInventory]
      newInventory[toolIndex].remainingUses -= 1
      
      // Remove if no uses left
      if (newInventory[toolIndex].remainingUses === 0) {
        newInventory.splice(toolIndex, 1)
      }
      
      set({ toolInventory: newInventory })
      return toolInventory[toolIndex].effect
    }
    return null
  },

  // Cinematic Events
  triggerEvent: (event) => {
    set({ activeEvent: event, lastEventTime: Date.now() })
  },

  clearEvent: () => {
    set({ activeEvent: null })
  },

  gameOver: (reason) => {
    set({ 
      gameState: 'gameover',
      timerActive: false,
    })
    
    get().addToActionLog(
      { name: 'GAME OVER', icon: '❌' },
      'failure',
      reason
    )
  },

  // AI System Actions
  handleSocialEngineeringSuccess: (benefit) => {
    const { duration, visibilityReduction } = benefit
    set({ 
      idsDisabledUntil: Date.now() + duration,
      visibility: Math.max(0, get().visibility + (visibilityReduction || 0)),
      socialEngineeringActive: false
    })
    
    get().addToActionLog({
      action: 'Social Engineering',
      result: 'success',
      details: `IDS disabled for ${duration/1000}s`,
      icon: '💬',
      timestamp: new Date().toLocaleTimeString()
    })
  },

  handleSocialEngineeringFailure: () => {
    set({ 
      visibility: 100,
      alertStatus: 'critical',
      socialEngineeringActive: false
    })
    
    get().addToActionLog({
      action: 'Social Engineering',
      result: 'failure',
      details: 'Sysadmin suspicious! Alert triggered!',
      icon: '🚨',
      timestamp: new Date().toLocaleTimeString()
    })
  },

  checkCounterHack: () => {
    const { visibility, counterHack } = get()
    if (visibility >= 80) {
      const result = counterHack.startTrace(visibility)
      if (result) {
        get().addToActionLog({
          action: 'Counter-Hack Detected',
          result: 'warning',
          details: result.warning,
          icon: '⚠️',
          timestamp: new Date().toLocaleTimeString()
        })
      }
    }
  },

  deployCountermeasures: () => {
    const result = get().counterHack.deployCountermeasures()
    if (result.success) {
      get().addToActionLog({
        action: 'Countermeasures',
        result: 'success',
        details: result.message,
        icon: '🛡️',
        timestamp: new Date().toLocaleTimeString()
      })
    }
    return result
  },

  disconnectFromTrace: () => {
    const result = get().counterHack.disconnect()
    if (result.success) {
      get().addToActionLog({
        action: 'Emergency Disconnect',
        result: 'success',
        details: result.message,
        icon: '🔌',
        timestamp: new Date().toLocaleTimeString()
      })
    }
    return result
  },

  attemptCounterTrace: () => {
    const result = get().counterHack.counterTrace()
    if (result.success) {
      set({ credits: get().credits + result.reward.credits })
      get().addToActionLog({
        action: 'Counter-Trace',
        result: 'success',
        details: result.reward.message,
        icon: '🎯',
        timestamp: new Date().toLocaleTimeString()
      })
    }
    return result
  },

  // Narrative System Actions
  generateNews: (action) => {
    const { newsGenerator, reputation, score } = get()
    const playerData = { reputation, score }
    
    const headline = newsGenerator.generateHeadline(action, playerData)
    const article = newsGenerator.generateArticle(headline, action, playerData)
    
    set({ newsHeadlines: [...get().newsHeadlines, headline] })
    
    return article
  },

  generateMission: () => {
    const { missionGenerator, reputation, score, actionLog, level } = get()
    const playerState = { reputation, score, actionLog, level }
    
    const mission = missionGenerator.generateMission(playerState)
    set({ generatedMissions: [...get().generatedMissions, mission] })
    
    return mission
  },

  interactWithNPC: (npcId, action) => {
    const { npcManager, reputation } = get()
    npcManager.recordInteraction(npcId, { ...action, playerReputation: reputation })
  },

  getNPCDialogue: (npcId, context = 'greeting') => {
    const npc = get().npcManager.getNPC(npcId)
    return npc ? npc.getDialogue(context) : 'NPC not found'
  },

  resetGame: () => {
    // Reset AI systems
    get().aiDefender.reset()
    get().counterHack.reset()
    
    set({
      currentLevel: 1,
      currentNode: null,
      visibility: 0,
      noiseLevel: 0,
      alertStatus: 'safe',
      timeRemaining: 3600,
      timerActive: false,
      compromisedNodes: [],
      discoveredNodes: [],
      objectives: {
        primary: false,
        secondary: false,
        tertiary: false,
      },
      actionLog: [],
      score: 0,
      gameState: 'menu',
      network: null,
      levelData: null,
      aiDefender: new AIDefender(),
      counterHack: new CounterHackSystem(),
      currentSysAdmin: getRandomSysAdmin(),
      socialEngineeringActive: false,
      idsDisabledUntil: null,
    })
  },
}))

export default useGameState

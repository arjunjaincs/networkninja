/**
 * Game Engine Core - Modular game logic
 * Can be reused across different platforms (web, desktop, mobile, CLI)
 */

export class GameEngine {
  constructor(config = {}) {
    this.version = '2.0.0'
    this.config = {
      tickRate: 100, // ms
      saveVersion: 2,
      ...config,
    }
    this.state = this.getInitialState()
    this.listeners = []
  }

  getInitialState() {
    return {
      gameState: 'menu',
      currentLevel: null,
      currentNode: null,
      network: null,
      visibility: 0,
      noiseLevel: 0,
      alertStatus: 'safe',
      timeRemaining: 0,
      timerActive: false,
      score: 0,
      compromisedNodes: [],
      discoveredNodes: [],
      actionLog: [],
      objectives: {},
    }
  }

  // State management
  setState(updates) {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  getState() {
    return this.state
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  // Game loop
  tick() {
    if (this.state.timerActive && this.state.timeRemaining > 0) {
      this.setState({
        timeRemaining: Math.max(0, this.state.timeRemaining - (this.config.tickRate / 1000))
      })

      if (this.state.timeRemaining <= 0) {
        this.handleTimeout()
      }
    }
  }

  handleTimeout() {
    this.setState({
      gameState: 'gameover',
      timerActive: false,
    })
  }

  // Action execution
  executeAction(action, params) {
    const actionHandlers = {
      reconnaissance: this.handleReconnaissance.bind(this),
      exploit: this.handleExploit.bind(this),
      moveNode: this.handleMoveNode.bind(this),
      exfiltrate: this.handleExfiltrate.bind(this),
      backdoor: this.handleBackdoor.bind(this),
    }

    const handler = actionHandlers[action]
    if (handler) {
      return handler(params)
    }

    return { success: false, message: 'Unknown action' }
  }

  handleReconnaissance(params) {
    const { targetNode } = params
    const visibilityIncrease = 5
    
    this.setState({
      visibility: Math.min(100, this.state.visibility + visibilityIncrease),
      discoveredNodes: [...new Set([...this.state.discoveredNodes, targetNode])],
    })

    this.addToLog({
      action: { name: 'Reconnaissance', icon: '🔍' },
      result: 'success',
      message: `Discovered node: ${targetNode}`,
    })

    return { success: true, visibilityIncrease }
  }

  handleExploit(params) {
    const { targetNode, vulnerability } = params
    const successRate = 0.7 // Base 70% success rate
    const success = Math.random() < successRate

    if (success) {
      this.setState({
        compromisedNodes: [...this.state.compromisedNodes, targetNode],
        visibility: Math.min(100, this.state.visibility + 15),
      })

      this.addToLog({
        action: { name: 'Exploit', icon: '💥' },
        result: 'success',
        message: `Compromised ${targetNode} using ${vulnerability}`,
      })

      return { success: true }
    }

    this.setState({
      visibility: Math.min(100, this.state.visibility + 25),
    })

    this.addToLog({
      action: { name: 'Exploit', icon: '💥' },
      result: 'failure',
      message: `Failed to exploit ${targetNode}`,
    })

    return { success: false }
  }

  handleMoveNode(params) {
    const { targetNode } = params
    
    this.setState({
      currentNode: targetNode,
      visibility: Math.min(100, this.state.visibility + 3),
    })

    this.addToLog({
      action: { name: 'Move', icon: '🚶' },
      result: 'success',
      message: `Moved to ${targetNode}`,
    })

    return { success: true }
  }

  handleExfiltrate(params) {
    const { data } = params
    
    this.setState({
      visibility: Math.min(100, this.state.visibility + 20),
      score: this.state.score + 1000,
    })

    this.addToLog({
      action: { name: 'Exfiltrate', icon: '📤' },
      result: 'success',
      message: `Exfiltrated ${data}`,
    })

    return { success: true, score: 1000 }
  }

  handleBackdoor(params) {
    const { targetNode } = params
    
    this.setState({
      visibility: Math.min(100, this.state.visibility + 10),
    })

    this.addToLog({
      action: { name: 'Backdoor', icon: '🚪' },
      result: 'success',
      message: `Installed backdoor on ${targetNode}`,
    })

    return { success: true }
  }

  addToLog(entry) {
    this.setState({
      actionLog: [
        ...this.state.actionLog,
        { ...entry, timestamp: new Date().toLocaleTimeString() }
      ].slice(-50) // Keep last 50 entries
    })
  }

  // Save/Load with versioning
  saveGame() {
    const saveData = {
      version: this.config.saveVersion,
      timestamp: Date.now(),
      state: this.state,
    }

    return JSON.stringify(saveData)
  }

  loadGame(saveDataString) {
    try {
      const saveData = JSON.parse(saveDataString)
      
      // Version migration
      if (saveData.version < this.config.saveVersion) {
        return this.migrateSave(saveData)
      }

      this.setState(saveData.state)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  migrateSave(oldSaveData) {
    // Migration logic for different save versions
    let migratedData = { ...oldSaveData }

    // v1 -> v2: Add new fields
    if (oldSaveData.version === 1) {
      migratedData.state.unlockedSkills = migratedData.state.unlockedSkills || []
      migratedData.state.toolInventory = migratedData.state.toolInventory || []
      migratedData.version = 2
    }

    this.setState(migratedData.state)
    return { success: true, migrated: true, fromVersion: oldSaveData.version }
  }

  // Reset
  reset() {
    this.state = this.getInitialState()
    this.notifyListeners()
  }
}

export default GameEngine

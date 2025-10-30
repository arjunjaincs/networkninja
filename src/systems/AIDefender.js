export class AIDefender {
  constructor() {
    this.playerPatterns = {
      actionHistory: [],
      favoriteActions: new Map(),
      timingPatterns: [],
      targetPreferences: []
    }
    this.adaptationLevel = 0 // 0-100
    this.honeypots = []
    this.lastAdaptation = Date.now()
    this.countermeasures = []
  }

  analyzeAction(action) {
    // Track player behavior
    this.playerPatterns.actionHistory.push({
      type: action.type,
      timestamp: Date.now(),
      success: action.success,
      targetNode: action.targetNode
    })

    // Count action frequency
    const count = this.playerPatterns.favoriteActions.get(action.type) || 0
    this.playerPatterns.favoriteActions.set(action.type, count + 1)

    // Adapt every 5 actions
    if (this.playerPatterns.actionHistory.length % 5 === 0) {
      this.adapt()
    }
  }

  adapt() {
    this.adaptationLevel = Math.min(this.adaptationLevel + 10, 100)
    
    // Find most used action
    const mostUsed = this.getMostUsedAction()
    
    console.log(`🤖 AI Adapting! Most used action: ${mostUsed}`)
    
    // Counter it
    if (mostUsed === 'port_scan' || mostUsed === 'passive_scan') {
      this.closeVulnerablePorts()
      this.deployHoneypot('fake_open_port')
    } else if (mostUsed === 'brute_force') {
      this.enableRateLimiting()
      this.deployHoneypot('weak_password_trap')
    } else if (mostUsed === 'exploit') {
      this.patchVulnerabilities()
      this.increaseMonitoring()
    } else if (mostUsed === 'lateral_movement') {
      this.segmentNetwork()
      this.deployHoneypot('fake_server')
    }

    return {
      adapted: true,
      level: this.adaptationLevel,
      countermeasure: mostUsed
    }
  }

  getMostUsedAction() {
    let maxCount = 0
    let mostUsed = null
    
    this.playerPatterns.favoriteActions.forEach((count, action) => {
      if (count > maxCount) {
        maxCount = count
        mostUsed = action
      }
    })
    
    return mostUsed
  }

  deployHoneypot(type) {
    const honeypot = {
      id: `honeypot_${Date.now()}`,
      type,
      detected: false,
      onTrigger: () => {
        console.log('🍯 HONEYPOT TRIGGERED!')
        return { 
          visibility: 50, 
          alert: 'CRITICAL',
          message: `⚠️ Honeypot detected! ${type} was a trap!`
        }
      }
    }
    
    this.honeypots.push(honeypot)
    
    return honeypot
  }

  closeVulnerablePorts() {
    this.countermeasures.push({
      type: 'port_closure',
      effect: 'Port scanning less effective',
      timestamp: Date.now()
    })
  }

  enableRateLimiting() {
    this.countermeasures.push({
      type: 'rate_limiting',
      effect: 'Brute force attacks slowed',
      timestamp: Date.now()
    })
  }

  patchVulnerabilities() {
    this.countermeasures.push({
      type: 'patch',
      effect: 'Known exploits fixed',
      timestamp: Date.now()
    })
  }

  increaseMonitoring() {
    this.countermeasures.push({
      type: 'monitoring',
      effect: 'Detection rate increased',
      timestamp: Date.now()
    })
  }

  segmentNetwork() {
    this.countermeasures.push({
      type: 'segmentation',
      effect: 'Lateral movement harder',
      timestamp: Date.now()
    })
  }

  getAdaptationBonus() {
    // AI gets stronger as it learns
    return {
      detectionRate: 1 + (this.adaptationLevel / 100),
      responseSpeed: Math.max(0.5, 1 - (this.adaptationLevel / 200)),
      alertThreshold: Math.max(50, 80 - this.adaptationLevel / 5)
    }
  }

  checkHoneypot(action) {
    // Check if action triggers a honeypot
    const triggered = this.honeypots.find(h => 
      !h.detected && 
      (h.type.includes(action.type) || Math.random() < 0.1)
    )

    if (triggered) {
      triggered.detected = true
      return triggered.onTrigger()
    }

    return null
  }

  getRecentCountermeasures() {
    const fiveMinutesAgo = Date.now() - 300000
    return this.countermeasures.filter(c => c.timestamp > fiveMinutesAgo)
  }

  reset() {
    this.playerPatterns = {
      actionHistory: [],
      favoriteActions: new Map(),
      timingPatterns: [],
      targetPreferences: []
    }
    this.adaptationLevel = 0
    this.honeypots = []
    this.countermeasures = []
  }
}

export class CounterHackSystem {
  constructor() {
    this.traceActive = false
    this.traceProgress = 0
    this.traceSpeed = 1
    this.traceStartTime = null
    this.countermeasuresDeployed = 0
  }

  startTrace(visibility) {
    if (visibility >= 80 && !this.traceActive) {
      this.traceActive = true
      this.traceProgress = 0
      this.traceStartTime = Date.now()
      
      console.log('⚠️ INCOMING TRACE DETECTED!')
      
      return {
        active: true,
        duration: 30000, // 30 seconds to trace
        warning: '🔍 Sysadmin is tracing your connection!',
        startTime: this.traceStartTime
      }
    }
    return null
  }

  updateTrace(deltaTime) {
    if (this.traceActive) {
      // Progress increases over time
      const progressIncrement = (deltaTime / 30000) * this.traceSpeed * 100
      this.traceProgress += progressIncrement
      
      if (this.traceProgress >= 100) {
        return this.completeTrace()
      }
      
      return { 
        progress: Math.min(this.traceProgress, 100),
        active: true,
        timeRemaining: Math.max(0, 30 - ((Date.now() - this.traceStartTime) / 1000))
      }
    }
    
    return { progress: 0, active: false }
  }

  completeTrace() {
    this.traceActive = false
    this.traceProgress = 0
    
    return {
      traced: true,
      active: false,
      consequences: {
        creditsLost: 1000,
        toolsLost: Math.min(1, Math.floor(Math.random() * 2)),
        reputationLost: 50,
        visibilityPenalty: 50,
        message: '🚨 YOU HAVE BEEN TRACED!\n\nConsequences:\n- IP Address Burned\n- Tools Confiscated\n- Reputation Damaged\n- Increased Security Globally'
      }
    }
  }

  deployCountermeasures() {
    if (this.traceActive && this.countermeasuresDeployed < 3) {
      this.traceSpeed *= 0.6 // Slow down trace by 40%
      this.countermeasuresDeployed++
      
      return { 
        success: true, 
        message: `🛡️ Countermeasures deployed! Trace slowed by 40%`,
        slowdown: 0.6,
        remaining: 3 - this.countermeasuresDeployed
      }
    }
    
    if (this.countermeasuresDeployed >= 3) {
      return {
        success: false,
        message: '❌ No countermeasures remaining!'
      }
    }
    
    return { success: false, message: '❌ No active trace to counter' }
  }

  disconnect() {
    if (this.traceActive) {
      this.traceActive = false
      this.traceProgress = 0
      this.countermeasuresDeployed = 0
      
      return { 
        success: true, 
        message: '✅ Disconnected safely. Trace aborted.',
        penalty: {
          loseProgress: true,
          message: 'Lost progress on current node'
        }
      }
    }
    
    return { success: false, message: 'No active trace' }
  }

  counterTrace() {
    if (this.traceActive && this.traceProgress < 50) {
      // Player successfully traces back
      this.traceActive = false
      this.traceProgress = 0
      this.countermeasuresDeployed = 0
      
      return {
        success: true,
        reward: {
          credits: 500,
          intel: {
            type: 'sysadmin_location',
            data: 'Discovered sysadmin physical location',
            bonus: 'Reduced detection rate for 2 minutes'
          },
          message: '🎯 COUNTER-TRACE SUCCESSFUL!\n\nRewards:\n+ 500 Credits\n+ Sysadmin Intel\n+ Reduced Detection (2 min)'
        }
      }
    }
    
    if (this.traceProgress >= 50) {
      return { 
        success: false, 
        message: '❌ Too late! Trace too advanced to counter-trace.'
      }
    }
    
    return { success: false, message: '❌ No active trace to counter' }
  }

  getStatus() {
    const timeRemaining = this.traceActive && this.traceStartTime
      ? Math.max(0, 30 - ((Date.now() - this.traceStartTime) / 1000))
      : 0

    return {
      active: this.traceActive,
      progress: this.traceProgress,
      speed: this.traceSpeed,
      timeRemaining: Math.ceil(timeRemaining),
      countermeasuresRemaining: Math.max(0, 3 - this.countermeasuresDeployed),
      canCounterTrace: this.traceActive && this.traceProgress < 50
    }
  }

  reset() {
    this.traceActive = false
    this.traceProgress = 0
    this.traceSpeed = 1
    this.traceStartTime = null
    this.countermeasuresDeployed = 0
  }
}

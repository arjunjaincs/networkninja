// NPC Memory System - NPCs remember player actions and react accordingly

export class NPCMemory {
  constructor(npcId, npcName, npcType) {
    this.npcId = npcId
    this.npcName = npcName
    this.npcType = npcType // 'ally', 'neutral', 'enemy'
    this.interactions = []
    this.reputation = 0 // -100 to +100
    this.trustLevel = 50 // 0 to 100
    this.remembers = true
    this.betrayed = false
    this.lastInteraction = null
  }

  recordInteraction(action) {
    const interaction = {
      action: action.type,
      timestamp: Date.now(),
      playerReputation: action.playerReputation || 0,
      outcome: action.outcome, // 'helped', 'betrayed', 'neutral', 'attacked'
      details: action.details
    }

    this.interactions.push(interaction)
    this.lastInteraction = interaction

    // Update reputation based on action
    this.updateReputation(action)

    // Check for betrayal
    if (action.outcome === 'betrayed') {
      this.betrayed = true
      this.trustLevel = 0
      this.npcType = 'enemy'
    }
  }

  updateReputation(action) {
    const reputationChanges = {
      'helped': +20,
      'betrayed': -100,
      'attacked': -50,
      'neutral': 0,
      'defended': +30,
      'saved': +50,
      'ignored': -10
    }

    const change = reputationChanges[action.outcome] || 0
    this.reputation = Math.max(-100, Math.min(100, this.reputation + change))

    // Update trust level
    if (action.outcome === 'helped' || action.outcome === 'saved') {
      this.trustLevel = Math.min(100, this.trustLevel + 15)
    } else if (action.outcome === 'betrayed' || action.outcome === 'attacked') {
      this.trustLevel = 0
    }
  }

  getDialogue(context = 'greeting') {
    // Generate dialogue based on relationship and memory
    
    if (this.betrayed) {
      return this.getBetrayalDialogue()
    }

    if (this.reputation < -50) {
      return this.getHostileDialogue(context)
    }

    if (this.reputation > 50) {
      return this.getFriendlyDialogue(context)
    }

    return this.getNeutralDialogue(context)
  }

  getBetrayalDialogue() {
    const betrayalLines = [
      `You! I remember what you did. I'll never forget, and I'll never forgive.`,
      `After everything... you betrayed me. Get out of my sight.`,
      `I trusted you. That was my mistake. One I won't make again.`,
      `You're dead to me. Don't ever contact me again.`,
      `I should have known better than to trust a hacker like you.`
    ]
    return this.random(betrayalLines)
  }

  getHostileDialogue(context) {
    const hostileGreetings = [
      `What do you want? Make it quick.`,
      `I don't have time for you.`,
      `You've got some nerve showing up here.`,
      `State your business and leave.`
    ]

    const hostileHelp = [
      `Why would I help you after what you've done?`,
      `You're on your own. I want nothing to do with you.`,
      `Help you? Not a chance.`,
      `Find someone else. I'm done with you.`
    ]

    return context === 'help' ? this.random(hostileHelp) : this.random(hostileGreetings)
  }

  getFriendlyDialogue(context) {
    const friendlyGreetings = [
      `Good to see you again, friend. Need help with something?`,
      `Hey! Always happy to see you. What's up?`,
      `My favorite hacker! What can I do for you?`,
      `You've proven yourself trustworthy. I'm here if you need me.`
    ]

    const friendlyHelp = [
      `Of course I'll help. You've earned it.`,
      `For you? Anything. You've had my back before.`,
      `I owe you one anyway. Let's do this.`,
      `You know I've got your back. What do you need?`
    ]

    const friendlyInfo = [
      `I heard some interesting intel you might want to know...`,
      `Between you and me, there's a vulnerability in the ${this.random(['bank', 'hospital', 'government'])} system.`,
      `I can get you access to some premium tools if you're interested.`,
      `Word on the street is there's a big score coming up. Want in?`
    ]

    if (context === 'help') return this.random(friendlyHelp)
    if (context === 'info') return this.random(friendlyInfo)
    return this.random(friendlyGreetings)
  }

  getNeutralDialogue(context) {
    const neutralGreetings = [
      `What brings you here?`,
      `I'm listening.`,
      `You need something?`,
      `Make it quick. I'm busy.`
    ]

    const neutralHelp = [
      `I might be able to help... for the right price.`,
      `Depends on what you need.`,
      `I'll consider it. What's in it for me?`,
      `Maybe. But you'll owe me.`
    ]

    return context === 'help' ? this.random(neutralHelp) : this.random(neutralGreetings)
  }

  willHelp() {
    if (this.betrayed) return false
    if (this.reputation < -30) return false
    if (this.trustLevel < 30) return Math.random() < 0.3
    if (this.reputation > 50) return true
    return Math.random() < 0.6
  }

  getHelpCost() {
    // Calculate cost based on relationship
    if (this.reputation > 70) return 0 // Free help for good friends
    if (this.reputation > 30) return 500 // Discounted
    if (this.reputation > 0) return 1000 // Normal price
    return 2000 // Expensive for enemies
  }

  offerQuest() {
    if (this.reputation < 30) return null
    if (this.interactions.length < 3) return null

    // Generate quest based on NPC type and relationship
    const quests = {
      ally: {
        title: `Help ${this.npcName}`,
        description: `${this.npcName} needs your help with a personal matter.`,
        reward: { credits: 2000, reputation: 30 }
      },
      neutral: {
        title: `Job from ${this.npcName}`,
        description: `${this.npcName} has a job opportunity for you.`,
        reward: { credits: 1500, reputation: 15 }
      }
    }

    return quests[this.npcType] || null
  }

  getRelationshipStatus() {
    if (this.betrayed) return 'BETRAYED'
    if (this.reputation > 70) return 'TRUSTED ALLY'
    if (this.reputation > 30) return 'FRIEND'
    if (this.reputation > 0) return 'ACQUAINTANCE'
    if (this.reputation > -30) return 'UNFRIENDLY'
    if (this.reputation > -70) return 'HOSTILE'
    return 'ENEMY'
  }

  getMemoryDescription() {
    if (this.interactions.length === 0) {
      return `You haven't interacted with ${this.npcName} yet.`
    }

    const lastAction = this.lastInteraction
    const timeAgo = this.getTimeAgo(lastAction.timestamp)

    if (this.betrayed) {
      return `${this.npcName} will never forgive your betrayal ${timeAgo}.`
    }

    if (this.reputation > 50) {
      return `${this.npcName} trusts you after you helped them ${timeAgo}.`
    }

    if (this.reputation < -30) {
      return `${this.npcName} hasn't forgotten what you did ${timeAgo}.`
    }

    return `You last interacted with ${this.npcName} ${timeAgo}.`
  }

  getTimeAgo(timestamp) {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return 'moments ago'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  random(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Export/Import for persistence
  export() {
    return {
      npcId: this.npcId,
      npcName: this.npcName,
      npcType: this.npcType,
      interactions: this.interactions,
      reputation: this.reputation,
      trustLevel: this.trustLevel,
      betrayed: this.betrayed,
      lastInteraction: this.lastInteraction
    }
  }

  static import(data) {
    const npc = new NPCMemory(data.npcId, data.npcName, data.npcType)
    npc.interactions = data.interactions || []
    npc.reputation = data.reputation || 0
    npc.trustLevel = data.trustLevel || 50
    npc.betrayed = data.betrayed || false
    npc.lastInteraction = data.lastInteraction || null
    return npc
  }
}

// NPC Manager - Manages all NPCs
export class NPCManager {
  constructor() {
    this.npcs = new Map()
    this.initializeDefaultNPCs()
  }

  initializeDefaultNPCs() {
    const defaultNPCs = [
      { id: 'mentor', name: 'The Mentor', type: 'ally' },
      { id: 'rival', name: 'Shadow', type: 'neutral' },
      { id: 'contact', name: 'Deep Throat', type: 'ally' },
      { id: 'vendor', name: 'The Vendor', type: 'neutral' },
      { id: 'agent', name: 'Agent Smith', type: 'enemy' }
    ]

    defaultNPCs.forEach(npc => {
      this.npcs.set(npc.id, new NPCMemory(npc.id, npc.name, npc.type))
    })
  }

  getNPC(npcId) {
    return this.npcs.get(npcId)
  }

  recordInteraction(npcId, action) {
    const npc = this.getNPC(npcId)
    if (npc) {
      npc.recordInteraction(action)
    }
  }

  getAllNPCs() {
    return Array.from(this.npcs.values())
  }

  getAvailableQuests() {
    const quests = []
    this.npcs.forEach(npc => {
      const quest = npc.offerQuest()
      if (quest) {
        quests.push({ ...quest, npcId: npc.npcId, npcName: npc.npcName })
      }
    })
    return quests
  }

  reset() {
    this.npcs.clear()
    this.initializeDefaultNPCs()
  }
}

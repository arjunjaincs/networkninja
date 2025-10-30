// Procedural Mission Generator
// Generates infinite unique missions with modifiers

class ProceduralMissionGenerator {
  constructor() {
    this.missionTypes = [
      {
        id: 'data_heist',
        name: 'Data Heist',
        description: 'Steal sensitive files before backup',
        objective: 'steal',
        icon: '💾',
        baseReward: 1000,
        difficulty: 2
      },
      {
        id: 'sabotage',
        name: 'Sabotage',
        description: 'Corrupt systems without detection',
        objective: 'sabotage',
        icon: '💣',
        baseReward: 1200,
        difficulty: 3
      },
      {
        id: 'surveillance',
        name: 'Surveillance',
        description: 'Monitor network traffic for 2 minutes',
        objective: 'surveil',
        icon: '👁️',
        baseReward: 800,
        difficulty: 1
      },
      {
        id: 'backdoor',
        name: 'Backdoor Installation',
        description: 'Plant persistent access',
        objective: 'plant',
        icon: '🚪',
        baseReward: 1500,
        difficulty: 3
      },
      {
        id: 'rescue',
        name: 'Data Rescue',
        description: 'Extract whistleblower data',
        objective: 'rescue',
        icon: '🆘',
        baseReward: 2000,
        difficulty: 4
      }
    ]

    this.targets = [
      { id: 'bank', name: 'International Bank', security: 'high', nodes: 12 },
      { id: 'hospital', name: 'Medical Center', security: 'medium', nodes: 8 },
      { id: 'government', name: 'Government Agency', security: 'maximum', nodes: 15 },
      { id: 'corp', name: 'Tech Corporation', security: 'high', nodes: 10 },
      { id: 'university', name: 'Research University', security: 'low', nodes: 6 },
      { id: 'military', name: 'Military Base', security: 'maximum', nodes: 20 }
    ]

    this.modifiers = [
      {
        id: 'honeypot_hell',
        name: 'Honeypot Hell',
        description: '50% of nodes are traps',
        icon: '🍯',
        difficulty: +2,
        rewardMultiplier: 1.5,
        effect: { honeypotChance: 0.5 }
      },
      {
        id: 'ai_aggressive',
        name: 'Aggressive AI',
        description: 'AI defender is highly active',
        icon: '🤖',
        difficulty: +3,
        rewardMultiplier: 1.8,
        effect: { aiAggression: 2.0 }
      },
      {
        id: 'time_pressure',
        name: 'Time Pressure',
        description: 'Half the normal time limit',
        icon: '⏱️',
        difficulty: +2,
        rewardMultiplier: 1.6,
        effect: { timeMultiplier: 0.5 }
      },
      {
        id: 'stealth_required',
        name: 'Ghost Protocol',
        description: 'Must stay below 40% visibility',
        icon: '👻',
        difficulty: +2,
        rewardMultiplier: 1.7,
        effect: { maxVisibility: 40 }
      },
      {
        id: 'limited_tools',
        name: 'Limited Arsenal',
        description: 'Only 3 action types available',
        icon: '🔧',
        difficulty: +1,
        rewardMultiplier: 1.3,
        effect: { limitedActions: 3 }
      },
      {
        id: 'mega_network',
        name: 'Mega Network',
        description: '2x network size',
        icon: '🌐',
        difficulty: +2,
        rewardMultiplier: 1.5,
        effect: { networkSizeMultiplier: 2 }
      },
      {
        id: 'no_saves',
        name: 'Ironman Mode',
        description: 'One mistake = game over',
        icon: '💀',
        difficulty: +4,
        rewardMultiplier: 2.5,
        effect: { oneLife: true }
      }
    ]
  }

  // Seeded random number generator
  seededRandom(seed) {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  // Pick random item from array using seed
  pickRandom(array, seed) {
    const index = Math.floor(this.seededRandom(seed) * array.length)
    return array[index]
  }

  // Generate mission from seed
  generateMission(seed = Date.now()) {
    const missionType = this.pickRandom(this.missionTypes, seed)
    const target = this.pickRandom(this.targets, seed + 1)
    
    // Determine number of modifiers based on seed
    const modifierCount = Math.floor(this.seededRandom(seed + 2) * 3) // 0-2 modifiers
    const selectedModifiers = []
    
    for (let i = 0; i < modifierCount; i++) {
      const modifier = this.pickRandom(this.modifiers, seed + 3 + i)
      if (!selectedModifiers.find(m => m.id === modifier.id)) {
        selectedModifiers.push(modifier)
      }
    }

    // Calculate difficulty and reward
    const baseDifficulty = missionType.difficulty + this.getSecurityLevel(target.security)
    const modifierDifficulty = selectedModifiers.reduce((sum, m) => sum + m.difficulty, 0)
    const totalDifficulty = baseDifficulty + modifierDifficulty

    const rewardMultiplier = selectedModifiers.reduce((mult, m) => mult * m.rewardMultiplier, 1)
    const totalReward = Math.floor(missionType.baseReward * rewardMultiplier * (1 + totalDifficulty * 0.2))

    // Generate story
    const story = this.generateStory(missionType, target, selectedModifiers)

    return {
      id: `mission_${seed}`,
      seed,
      type: missionType,
      target,
      modifiers: selectedModifiers,
      difficulty: totalDifficulty,
      reward: totalReward,
      story,
      timeLimit: this.calculateTimeLimit(missionType, selectedModifiers),
      objectives: this.generateObjectives(missionType, target, selectedModifiers)
    }
  }

  getSecurityLevel(security) {
    const levels = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'maximum': 4
    }
    return levels[security] || 2
  }

  calculateTimeLimit(missionType, modifiers) {
    let baseTime = 1800 // 30 minutes in seconds
    
    // Adjust based on mission type
    if (missionType.id === 'surveillance') {
      baseTime = 120 // 2 minutes
    } else if (missionType.id === 'rescue') {
      baseTime = 1200 // 20 minutes
    }

    // Apply modifier effects
    const timePressure = modifiers.find(m => m.id === 'time_pressure')
    if (timePressure) {
      baseTime *= timePressure.effect.timeMultiplier
    }

    return baseTime
  }

  generateObjectives(missionType, target, modifiers) {
    const objectives = {
      primary: {
        description: `${missionType.description} at ${target.name}`,
        targetNode: 'server-main', // Will be set by level generator
        completed: false
      },
      secondary: {
        description: 'Maintain stealth',
        threshold: 60,
        completed: false
      },
      tertiary: {
        description: 'Complete quickly',
        timeLimit: 1800,
        completed: false
      }
    }

    // Adjust based on modifiers
    const stealthMod = modifiers.find(m => m.id === 'stealth_required')
    if (stealthMod) {
      objectives.secondary.threshold = stealthMod.effect.maxVisibility
    }

    return objectives
  }

  generateStory(missionType, target, modifiers) {
    const stories = {
      data_heist: [
        `Intelligence suggests ${target.name} is storing classified data. Your mission: infiltrate and extract before the next backup cycle.`,
        `A whistleblower has revealed ${target.name} is hiding sensitive information. Get in, get the data, get out.`,
        `${target.name} has been compromised before. They've upgraded security, but you're better. Prove it.`
      ],
      sabotage: [
        `A rival organization wants ${target.name}'s systems corrupted. They're paying well for discretion.`,
        `${target.name} has been causing problems. Time to send a message they won't forget.`,
        `Your client needs ${target.name} offline for 48 hours. Make it look like an accident.`
      ],
      surveillance: [
        `Monitor ${target.name}'s network traffic for 2 minutes. We need to know what they're planning.`,
        `${target.name} is communicating with someone. Find out who and what they're saying.`,
        `Passive surveillance on ${target.name}. Don't get detected, just watch and learn.`
      ],
      backdoor: [
        `Plant a backdoor in ${target.name}'s network. Future access is worth more than quick cash.`,
        `${target.name} will be a valuable asset. Ensure we can return whenever we want.`,
        `Install persistent access at ${target.name}. The client has long-term plans.`
      ],
      rescue: [
        `A whistleblower at ${target.name} needs extraction. Their data could expose everything.`,
        `${target.name} is holding critical evidence. Get it out before they destroy it.`,
        `Someone inside ${target.name} wants to talk. Extract their data before they're silenced.`
      ]
    }

    const storyOptions = stories[missionType.id] || stories.data_heist
    const baseStory = storyOptions[Math.floor(Math.random() * storyOptions.length)]

    // Add modifier context
    let modifierContext = ''
    if (modifiers.length > 0) {
      modifierContext = '\n\n⚠️ COMPLICATIONS:\n'
      modifiers.forEach(mod => {
        modifierContext += `• ${mod.name}: ${mod.description}\n`
      })
    }

    return baseStory + modifierContext
  }

  // Generate daily challenge (same seed for all players)
  generateDailyChallenge() {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    return this.generateMission(seed)
  }
}

export default ProceduralMissionGenerator

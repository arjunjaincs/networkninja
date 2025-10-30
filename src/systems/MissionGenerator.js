// Procedural Mission Generator - Creates missions based on player history

export class MissionGenerator {
  constructor() {
    this.generatedMissions = []
    this.missionTemplates = this.initializeTemplates()
  }

  initializeTemplates() {
    return {
      revenge: {
        title: 'They Know Who You Are',
        difficulty: 'hard',
        timeLimit: 900,
        rewardMultiplier: 2.0
      },
      fame: {
        title: 'Interview Request',
        difficulty: 'medium',
        timeLimit: 600,
        rewardMultiplier: 1.5
      },
      rivalry: {
        title: 'Race Against Time',
        difficulty: 'hard',
        timeLimit: 600,
        rewardMultiplier: 2.5
      },
      alliance: {
        title: 'Help an Ally',
        difficulty: 'medium',
        timeLimit: 1200,
        rewardMultiplier: 1.8
      },
      escalation: {
        title: 'Heat is Rising',
        difficulty: 'extreme',
        timeLimit: 480,
        rewardMultiplier: 3.0
      }
    }
  }

  generateMission(playerState) {
    // Check conditions and generate appropriate mission
    
    if (this.shouldGenerateRevengeMission(playerState)) {
      return this.createRevengeMission(playerState)
    }

    if (this.shouldGenerateFameMission(playerState)) {
      return this.createFameMission(playerState)
    }

    if (this.shouldGenerateRivalryMission(playerState)) {
      return this.createRivalryMission(playerState)
    }

    if (this.shouldGenerateAllianceMission(playerState)) {
      return this.createAllianceMission(playerState)
    }

    if (this.shouldGenerateEscalationMission(playerState)) {
      return this.createEscalationMission(playerState)
    }

    // Default: Generate random mission
    return this.createRandomMission(playerState)
  }

  // REVENGE MISSION - Target fights back
  shouldGenerateRevengeMission(playerState) {
    const hackedTargets = playerState.actionLog?.filter(a => a.result === 'success') || []
    return hackedTargets.length > 5 && Math.random() < 0.3
  }

  createRevengeMission(playerState) {
    const previousTargets = this.getPreviousTargets(playerState)
    const target = this.random(previousTargets) || 'TechCorp'

    return {
      id: `revenge_${Date.now()}`,
      type: 'revenge',
      title: `${target} Strikes Back`,
      briefing: `
🎯 URGENT MISSION

${target}, one of your previous targets, has hired elite security consultants to track you down. 
They've analyzed your attack patterns and are dangerously close to identifying you.

THREAT LEVEL: CRITICAL

Your digital footprints from the previous attack are still in their systems. If they find you, 
everything you've built will be destroyed.

OBJECTIVES:
• Delete all logs from previous attack
• Plant false evidence pointing to another hacker
• Disable their enhanced security systems

TIME IS RUNNING OUT. They're getting closer every minute.
      `.trim(),
      objectives: {
        primary: {
          description: 'Delete all attack logs',
          targetNode: 'log_server',
          reward: 3000,
          type: 'cover_tracks'
        },
        secondary: {
          description: 'Plant false evidence',
          reward: 1500,
          type: 'misdirection'
        },
        tertiary: {
          description: 'Disable security upgrades',
          reward: 1000,
          type: 'sabotage'
        }
      },
      difficulty: 'hard',
      timeLimit: 900,
      consequences: {
        success: 'You successfully covered your tracks. They lost your trail.',
        failure: 'They traced you! Lose all data from previous hacks and -50 reputation.'
      },
      rewards: {
        credits: 5000,
        reputation: 30,
        unlocks: ['advanced_stealth']
      }
    }
  }

  // FAME MISSION - Media attention
  shouldGenerateFameMission(playerState) {
    return playerState.reputation > 50 && Math.random() < 0.4
  }

  createFameMission(playerState) {
    return {
      id: `fame_${Date.now()}`,
      type: 'fame',
      title: 'The Interview',
      briefing: `
📰 MEDIA REQUEST

A journalist from CyberNews wants to interview you anonymously about your activities.
Your reputation has caught their attention.

This could boost your standing significantly, but also increases risk.

CHOICE TIME:
This mission offers multiple paths. Your decision will shape your future.
      `.trim(),
      choices: [
        {
          id: 'accept',
          text: 'Accept the interview',
          description: 'Share your story with the world',
          consequences: {
            reputation: +40,
            visibility: +25,
            unlocks: ['media_contact', 'public_figure']
          },
          outcome: 'Your interview goes viral. You become a folk hero to some, a criminal to others.'
        },
        {
          id: 'decline',
          text: 'Decline and stay hidden',
          description: 'Maintain operational security',
          consequences: {
            reputation: 0,
            visibility: -10
          },
          outcome: 'You remain in the shadows. Sometimes anonymity is the best defense.'
        },
        {
          id: 'mislead',
          text: 'Give false information',
          description: 'Misdirect investigators',
          consequences: {
            reputation: -15,
            visibility: -20,
            unlocks: ['master_of_deception']
          },
          outcome: 'Your false trail sends investigators in the wrong direction. Clever.'
        }
      ],
      difficulty: 'medium',
      timeLimit: 600,
      rewards: {
        credits: 2000,
        reputation: 25
      }
    }
  }

  // RIVALRY MISSION - Compete with another hacker
  shouldGenerateRivalryMission(playerState) {
    return playerState.score > 10000 && Math.random() < 0.35
  }

  createRivalryMission(playerState) {
    const rivalNames = ['Shadow', 'Phantom', 'Ghost', 'Cipher', 'Vortex']
    const rivalName = this.random(rivalNames)

    return {
      id: `rivalry_${Date.now()}`,
      type: 'rivalry',
      title: `Race Against ${rivalName}`,
      briefing: `
⚡ COMPETITION DETECTED

Your rival ${rivalName} is targeting the same network as you.
Whoever gets the data first wins. Loser loses reputation.

${rivalName} is already inside. You need to move FAST.

STAKES:
• Winner: +5000 credits, +50 reputation
• Loser: -2000 credits, -30 reputation

This is personal now.
      `.trim(),
      objectives: {
        primary: {
          description: `Get the data before ${rivalName}`,
          timeLimit: 600,
          reward: 5000,
          type: 'race'
        }
      },
      rivalBehavior: {
        name: rivalName,
        skill: playerState.level * 0.9,
        actions: ['scanning', 'exploiting', 'exfiltrating'],
        progressRate: 1.2 // Slightly faster than normal
      },
      difficulty: 'hard',
      timeLimit: 600,
      consequences: {
        win: `You beat ${rivalName}! They won't forget this.`,
        lose: `${rivalName} got the data first. Your reputation takes a hit.`
      },
      rewards: {
        credits: 5000,
        reputation: 50,
        unlocks: ['rival_defeated']
      }
    }
  }

  // ALLIANCE MISSION - Help an ally
  shouldGenerateAllianceMission(playerState) {
    return playerState.reputation > 30 && Math.random() < 0.25
  }

  createAllianceMission(playerState) {
    return {
      id: `alliance_${Date.now()}`,
      type: 'alliance',
      title: 'Ally in Need',
      briefing: `
🤝 ALLIANCE REQUEST

A fellow hacker you helped before needs your assistance.
They're pinned down in a corporate network and need extraction.

Help them escape and you'll have a powerful ally.
Abandon them and you'll make an enemy.

MISSION: Extract your ally from the network before security catches them.
      `.trim(),
      objectives: {
        primary: {
          description: 'Create escape route for ally',
          reward: 3000,
          type: 'rescue'
        },
        secondary: {
          description: 'Cover their tracks',
          reward: 1500,
          type: 'cover_tracks'
        }
      },
      difficulty: 'medium',
      timeLimit: 1200,
      consequences: {
        success: 'Your ally escapes safely. They owe you one.',
        failure: 'Your ally was captured. They blame you.'
      },
      rewards: {
        credits: 4000,
        reputation: 40,
        unlocks: ['trusted_ally']
      }
    }
  }

  // ESCALATION MISSION - Heat is too high
  shouldGenerateEscalationMission(playerState) {
    return playerState.visibility > 70 && Math.random() < 0.5
  }

  createEscalationMission(playerState) {
    return {
      id: `escalation_${Date.now()}`,
      type: 'escalation',
      title: 'Too Hot to Handle',
      briefing: `
🚨 EXTREME DANGER

Your recent activities have attracted serious attention.
Multiple agencies are coordinating to find you.

You need to go dark. NOW.

EMERGENCY OBJECTIVES:
• Wipe all traces of your identity
• Establish new identity
• Lay low for a while

This is your last chance to disappear.
      `.trim(),
      objectives: {
        primary: {
          description: 'Wipe digital footprint',
          reward: 4000,
          type: 'emergency_cleanup'
        },
        secondary: {
          description: 'Create false identity',
          reward: 2000,
          type: 'identity_theft'
        }
      },
      difficulty: 'extreme',
      timeLimit: 480,
      consequences: {
        success: 'You successfully go dark. Heat level reset to 0.',
        failure: 'GAME OVER. You were caught.'
      },
      rewards: {
        credits: 6000,
        reputation: -20, // Going dark reduces reputation
        unlocks: ['ghost_protocol']
      }
    }
  }

  // RANDOM MISSION - Procedurally generated
  createRandomMission(playerState) {
    const companies = ['TechCorp', 'MediSys', 'FinanceHub', 'DataVault', 'CyberDyne']
    const objectives = ['steal data', 'expose corruption', 'sabotage systems', 'corporate espionage']
    const twists = ['rival appears', 'security upgrade', 'insider help', 'time pressure']

    const company = this.random(companies)
    const objective = this.random(objectives)
    const twist = this.random(twists)

    return {
      id: `random_${Date.now()}`,
      type: 'standard',
      title: `Operation ${company}`,
      briefing: `
📋 NEW CONTRACT

Target: ${company}
Objective: ${objective}
Complication: ${twist}

Standard infiltration job. Get in, complete the objective, get out.

Payment on completion.
      `.trim(),
      objectives: {
        primary: {
          description: `Complete ${objective} at ${company}`,
          reward: 2000,
          type: 'standard'
        }
      },
      difficulty: 'medium',
      timeLimit: 1200,
      rewards: {
        credits: 2500,
        reputation: 15
      }
    }
  }

  // Helper methods
  getPreviousTargets(playerState) {
    const targets = []
    playerState.actionLog?.forEach(action => {
      if (action.target && !targets.includes(action.target)) {
        targets.push(action.target)
      }
    })
    return targets.length > 0 ? targets : ['TechCorp', 'MediSys']
  }

  random(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  getMissionHistory() {
    return this.generatedMissions
  }

  reset() {
    this.generatedMissions = []
  }
}

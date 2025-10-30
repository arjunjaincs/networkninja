// Meta-progression system: Reputation, Credits, and Unlockables

export const REPUTATION_TIERS = [
  { name: 'Unknown', minRep: 0, icon: '❓', color: 'text-gray-400' },
  { name: 'Novice', minRep: 100, icon: '🌱', color: 'text-green-400' },
  { name: 'Known', minRep: 500, icon: '📢', color: 'text-blue-400' },
  { name: 'Respected', minRep: 1500, icon: '⭐', color: 'text-yellow-400' },
  { name: 'Elite', minRep: 5000, icon: '💎', color: 'text-cyan-400' },
  { name: 'Legendary', minRep: 15000, icon: '👑', color: 'text-purple-400' },
]

export const GEAR_ITEMS = {
  // Tools that modify gameplay
  STEALTH_KIT: {
    id: 'stealth_kit',
    name: 'Stealth Kit Pro',
    description: 'Reduces visibility increase by 25% for all actions',
    cost: 1000,
    icon: '🎒',
    effect: { visibilityReduction: 0.25 },
    category: 'tool',
  },
  EXPLOIT_PACK: {
    id: 'exploit_pack',
    name: 'Premium Exploit Pack',
    description: 'Increases success rate of all exploits by 15%',
    cost: 1500,
    icon: '⚡',
    effect: { successRateBonus: 0.15 },
    category: 'tool',
  },
  SCANNER_PRO: {
    id: 'scanner_pro',
    name: 'Advanced Scanner',
    description: 'Reconnaissance actions reveal more information',
    cost: 800,
    icon: '🔍',
    effect: { enhancedRecon: true },
    category: 'tool',
  },
  TIME_EXTENDER: {
    id: 'time_extender',
    name: 'Time Dilation Device',
    description: 'Start each mission with +10 minutes',
    cost: 2000,
    icon: '⏰',
    effect: { bonusTime: 600 },
    category: 'tool',
  },
  LUCKY_CHARM: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    description: 'Reroll one failed action per mission',
    cost: 1200,
    icon: '🍀',
    effect: { rerollsPerMission: 1 },
    category: 'tool',
  },
  
  // Cosmetic themes
  MATRIX_THEME: {
    id: 'matrix_theme',
    name: 'Matrix Theme',
    description: 'Green on black terminal aesthetic',
    cost: 500,
    icon: '💚',
    effect: { theme: 'matrix' },
    category: 'cosmetic',
  },
  NEON_THEME: {
    id: 'neon_theme',
    name: 'Neon Nights',
    description: 'Vibrant neon color scheme',
    cost: 500,
    icon: '🌈',
    effect: { theme: 'neon' },
    category: 'cosmetic',
  },
  HACKER_AVATAR: {
    id: 'hacker_avatar',
    name: 'Elite Hacker Avatar',
    description: 'Custom profile icon',
    cost: 300,
    icon: '🎭',
    effect: { avatar: 'elite' },
    category: 'cosmetic',
  },
}

export const DAILY_CONTRACTS = {
  SPEED_RUN: {
    id: 'speed_run',
    name: 'Speed Demon',
    description: 'Complete any level in under 10 minutes',
    reward: { credits: 500, reputation: 100 },
    icon: '⚡',
  },
  GHOST: {
    id: 'ghost',
    name: 'Ghost in the Machine',
    description: 'Complete a level with less than 30% visibility',
    reward: { credits: 400, reputation: 80 },
    icon: '👻',
  },
  PERFECT_RUN: {
    id: 'perfect_run',
    name: 'Perfect Execution',
    description: 'Complete all objectives in a single level',
    reward: { credits: 600, reputation: 120 },
    icon: '💯',
  },
  EXPLORER: {
    id: 'explorer',
    name: 'Network Explorer',
    description: 'Discover all nodes in a procedural network',
    reward: { credits: 300, reputation: 60 },
    icon: '🗺️',
  },
  SURVIVOR: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Survive 5 waves in Endless Mode',
    reward: { credits: 800, reputation: 150 },
    icon: '🛡️',
  },
}

// Calculate reputation from score
export const calculateReputation = (score, objectives) => {
  let rep = Math.floor(score / 100)
  if (objectives.primary) rep += 50
  if (objectives.secondary) rep += 30
  if (objectives.tertiary) rep += 20
  return rep
}

// Calculate credits earned
export const calculateCredits = (score, objectives) => {
  let credits = Math.floor(score / 50)
  if (objectives.primary) credits += 100
  if (objectives.secondary) credits += 50
  if (objectives.tertiary) credits += 30
  return credits
}

// Get reputation tier
export const getReputationTier = (reputation) => {
  let tier = REPUTATION_TIERS[0]
  for (const t of REPUTATION_TIERS) {
    if (reputation >= t.minRep) {
      tier = t
    } else {
      break
    }
  }
  return tier
}

// Check if daily contract is complete
export const checkDailyContract = (contract, gameState) => {
  switch (contract.id) {
    case 'speed_run':
      return gameState.timeRemaining > (gameState.levelData.timeLimit - 600)
    case 'ghost':
      return gameState.visibility < 30
    case 'perfect_run':
      return gameState.objectives.primary && 
             gameState.objectives.secondary && 
             gameState.objectives.tertiary
    case 'explorer':
      return gameState.discoveredNodes.length === gameState.network.nodes.length
    case 'survivor':
      return gameState.endlessWave >= 5
    default:
      return false
  }
}

// Get random daily contracts (3 per day)
export const getDailyContracts = () => {
  const contracts = Object.values(DAILY_CONTRACTS)
  const shuffled = contracts.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

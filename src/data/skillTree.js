// Skill Tree - Unlock upgrades with reputation points

export const SKILL_CATEGORIES = {
  STEALTH: 'stealth',
  SPEED: 'speed',
  EXPLOITATION: 'exploitation',
  RECONNAISSANCE: 'reconnaissance',
}

export const SKILLS = {
  // Stealth Branch
  GHOST_MODE: {
    id: 'ghost_mode',
    name: 'Ghost Mode',
    category: SKILL_CATEGORIES.STEALTH,
    description: 'Reduce all visibility increases by 20%',
    cost: 500,
    icon: '👻',
    tier: 1,
    effect: { visibilityReduction: 0.2 },
    requires: [],
  },
  SHADOW_WALKER: {
    id: 'shadow_walker',
    name: 'Shadow Walker',
    category: SKILL_CATEGORIES.STEALTH,
    description: 'Reduce all visibility increases by 35%',
    cost: 1500,
    icon: '🌑',
    tier: 2,
    effect: { visibilityReduction: 0.35 },
    requires: ['ghost_mode'],
  },
  INVISIBLE: {
    id: 'invisible',
    name: 'Invisible',
    category: SKILL_CATEGORIES.STEALTH,
    description: 'Reduce all visibility increases by 50%',
    cost: 3000,
    icon: '✨',
    tier: 3,
    effect: { visibilityReduction: 0.5 },
    requires: ['shadow_walker'],
  },
  
  // Speed Branch
  QUICK_HANDS: {
    id: 'quick_hands',
    name: 'Quick Hands',
    category: SKILL_CATEGORIES.SPEED,
    description: 'Reduce action time by 25%',
    cost: 500,
    icon: '⚡',
    tier: 1,
    effect: { timeReduction: 0.25 },
    requires: [],
  },
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    category: SKILL_CATEGORIES.SPEED,
    description: 'Reduce action time by 40%',
    cost: 1500,
    icon: '⚡⚡',
    tier: 2,
    effect: { timeReduction: 0.4 },
    requires: ['quick_hands'],
  },
  TIME_WARP: {
    id: 'time_warp',
    name: 'Time Warp',
    category: SKILL_CATEGORIES.SPEED,
    description: 'Reduce action time by 60%',
    cost: 3000,
    icon: '⏰',
    tier: 3,
    effect: { timeReduction: 0.6 },
    requires: ['lightning_fast'],
  },
  
  // Exploitation Branch
  EXPLOIT_MASTER: {
    id: 'exploit_master',
    name: 'Exploit Master',
    category: SKILL_CATEGORIES.EXPLOITATION,
    description: 'Increase exploit success rate by 15%',
    cost: 500,
    icon: '🔓',
    tier: 1,
    effect: { successRateBonus: 0.15 },
    requires: [],
  },
  ZERO_DAY_HUNTER: {
    id: 'zero_day_hunter',
    name: 'Zero-Day Hunter',
    category: SKILL_CATEGORIES.EXPLOITATION,
    description: 'Increase exploit success rate by 25%',
    cost: 1500,
    icon: '🎯',
    tier: 2,
    effect: { successRateBonus: 0.25 },
    requires: ['exploit_master'],
  },
  GODMODE: {
    id: 'godmode',
    name: 'God Mode',
    category: SKILL_CATEGORIES.EXPLOITATION,
    description: 'All exploits have 100% success rate',
    cost: 5000,
    icon: '👑',
    tier: 3,
    effect: { successRateBonus: 1.0 },
    requires: ['zero_day_hunter'],
  },
  
  // Reconnaissance Branch
  EAGLE_EYE: {
    id: 'eagle_eye',
    name: 'Eagle Eye',
    category: SKILL_CATEGORIES.RECONNAISSANCE,
    description: 'Reconnaissance reveals more information',
    cost: 500,
    icon: '🦅',
    tier: 1,
    effect: { enhancedRecon: true },
    requires: [],
  },
  NETWORK_VISION: {
    id: 'network_vision',
    name: 'Network Vision',
    category: SKILL_CATEGORIES.RECONNAISSANCE,
    description: 'See all connected nodes automatically',
    cost: 1500,
    icon: '👁️',
    tier: 2,
    effect: { autoDiscover: true },
    requires: ['eagle_eye'],
  },
  OMNISCIENT: {
    id: 'omniscient',
    name: 'Omniscient',
    category: SKILL_CATEGORIES.RECONNAISSANCE,
    description: 'See entire network from the start',
    cost: 3000,
    icon: '🔮',
    tier: 3,
    effect: { seeAll: true },
    requires: ['network_vision'],
  },
}

export const getSkillsByCategory = (category) => {
  return Object.values(SKILLS).filter(skill => skill.category === category)
}

export const canUnlockSkill = (skillId, unlockedSkills, reputation) => {
  const skill = SKILLS[skillId]
  if (!skill) return false
  
  // Check if already unlocked
  if (unlockedSkills.includes(skillId)) return false
  
  // Check reputation cost
  if (reputation < skill.cost) return false
  
  // Check requirements
  if (skill.requires.length > 0) {
    return skill.requires.every(req => unlockedSkills.includes(req))
  }
  
  return true
}

export const getActiveSkillEffects = (unlockedSkills) => {
  const effects = {
    visibilityReduction: 0,
    timeReduction: 0,
    successRateBonus: 0,
    enhancedRecon: false,
    autoDiscover: false,
    seeAll: false,
  }
  
  unlockedSkills.forEach(skillId => {
    const skill = SKILLS[skillId]
    if (skill && skill.effect) {
      Object.keys(skill.effect).forEach(key => {
        if (typeof skill.effect[key] === 'number') {
          effects[key] = Math.max(effects[key], skill.effect[key])
        } else {
          effects[key] = skill.effect[key] || effects[key]
        }
      })
    }
  })
  
  return effects
}

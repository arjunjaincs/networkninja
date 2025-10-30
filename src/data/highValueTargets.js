// High-Value Targets - Risk vs Reward system

export const HIGH_VALUE_TARGETS = {
  CEO_LAPTOP: {
    id: 'ceo_laptop',
    name: "CEO's Laptop",
    icon: '💼',
    description: 'Contains executive communications and strategic plans',
    scoreBonus: 5000,
    visibilitySpike: 40,
    difficulty: 'extreme',
    requirements: ['Compromised at least 3 nodes'],
  },
  BACKUP_SERVER: {
    id: 'backup_server',
    name: 'Backup Server',
    icon: '💾',
    description: 'Full database backups with historical data',
    scoreBonus: 3000,
    visibilitySpike: 25,
    difficulty: 'hard',
    requirements: ['Access to server subnet'],
  },
  SOURCE_CODE_REPO: {
    id: 'source_code',
    name: 'Source Code Repository',
    icon: '📦',
    description: 'Proprietary software and algorithms',
    scoreBonus: 4000,
    visibilitySpike: 30,
    difficulty: 'hard',
    requirements: ['Compromised developer workstation'],
  },
  CRYPTO_WALLET: {
    id: 'crypto_wallet',
    name: 'Cryptocurrency Wallet',
    icon: '💰',
    description: 'Company crypto assets and private keys',
    scoreBonus: 10000,
    visibilitySpike: 50,
    difficulty: 'extreme',
    requirements: ['Finance server access'],
  },
  CUSTOMER_DATABASE: {
    id: 'customer_db',
    name: 'Customer Database',
    icon: '👥',
    description: 'Complete customer records and PII',
    scoreBonus: 6000,
    visibilitySpike: 35,
    difficulty: 'very_hard',
    requirements: ['Database server compromised'],
  },
}

export const addHighValueTargetsToNetwork = (network, difficulty) => {
  // Add 1-3 high-value targets based on difficulty
  const targetCount = difficulty === 'easy' ? 1 : difficulty === 'normal' ? 2 : 3
  const availableTargets = Object.values(HIGH_VALUE_TARGETS)
  
  // Randomly select targets
  const selectedTargets = availableTargets
    .sort(() => Math.random() - 0.5)
    .slice(0, targetCount)
  
  // Add to random nodes
  const eligibleNodes = network.nodes.filter(n => 
    n.type === 'server' || n.type === 'workstation' || n.type === 'database'
  )
  
  selectedTargets.forEach((target, i) => {
    if (eligibleNodes[i]) {
      eligibleNodes[i].highValueTarget = target
    }
  })
  
  return network
}

export const calculateHighValueBonus = (target) => {
  return {
    score: target.scoreBonus,
    visibilityIncrease: target.visibilitySpike,
    achievement: `Exfiltrated ${target.name}!`,
  }
}

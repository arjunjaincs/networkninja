// Cinematic Events - Random dramatic moments that force adaptation

export const CINEMATIC_EVENTS = {
  ADMIN_LOGIN: {
    id: 'admin_login',
    name: 'Admin Logging In',
    description: 'A system administrator is logging into the network!',
    icon: '👨‍💼',
    effect: {
      visibilityIncrease: 20,
      message: 'ALERT: Administrator detected on the network',
      duration: 30,
    },
    probability: 0.15,
    color: 'yellow',
  },
  SECURITY_SCAN: {
    id: 'security_scan',
    name: 'Security Scan Initiated',
    description: 'Automated security scan is running!',
    icon: '🔍',
    effect: {
      visibilityIncrease: 15,
      message: 'WARNING: Security scan in progress',
      duration: 45,
    },
    probability: 0.2,
    color: 'orange',
  },
  POWER_OUTAGE: {
    id: 'power_outage',
    name: 'Power Outage',
    description: 'Brief power outage - systems rebooting',
    icon: '⚡',
    effect: {
      visibilityDecrease: 30,
      message: 'OPPORTUNITY: Power outage detected - reduced monitoring',
      duration: 20,
      bonus: true,
    },
    probability: 0.1,
    color: 'green',
  },
  IDS_UPDATE: {
    id: 'ids_update',
    name: 'IDS Signature Update',
    description: 'Intrusion Detection System updating signatures',
    icon: '🛡️',
    effect: {
      idsDisabled: true,
      message: 'OPPORTUNITY: IDS temporarily offline for updates',
      duration: 60,
      bonus: true,
    },
    probability: 0.08,
    color: 'green',
  },
  FIREWALL_ALERT: {
    id: 'firewall_alert',
    name: 'Firewall Alert',
    description: 'Firewall detected suspicious traffic',
    icon: '🔥',
    effect: {
      visibilityIncrease: 25,
      message: 'CRITICAL: Firewall alert triggered',
      duration: 30,
    },
    probability: 0.12,
    color: 'red',
  },
  BACKUP_RUNNING: {
    id: 'backup_running',
    name: 'Backup in Progress',
    description: 'Automated backup creating system snapshot',
    icon: '💾',
    effect: {
      message: 'INFO: Backup running - network activity masked',
      visibilityDecrease: 10,
      duration: 40,
      bonus: true,
    },
    probability: 0.15,
    color: 'blue',
  },
  SOC_ANALYST: {
    id: 'soc_analyst',
    name: 'SOC Analyst Active',
    description: 'Security Operations Center analyst reviewing logs',
    icon: '👁️',
    effect: {
      visibilityIncrease: 30,
      message: 'DANGER: SOC analyst actively monitoring',
      duration: 60,
    },
    probability: 0.1,
    color: 'red',
  },
  MAINTENANCE_WINDOW: {
    id: 'maintenance_window',
    name: 'Maintenance Window',
    description: 'Scheduled maintenance - reduced security',
    icon: '🔧',
    effect: {
      visibilityDecrease: 20,
      message: 'OPPORTUNITY: Maintenance window - security relaxed',
      duration: 90,
      bonus: true,
    },
    probability: 0.05,
    color: 'green',
  },
  INCIDENT_RESPONSE: {
    id: 'incident_response',
    name: 'Incident Response Team',
    description: 'IR team investigating suspicious activity',
    icon: '🚨',
    effect: {
      visibilityIncrease: 40,
      message: 'CRITICAL: Incident Response team deployed',
      duration: 45,
    },
    probability: 0.08,
    color: 'red',
  },
}

export const triggerRandomEvent = (currentTime, lastEventTime, difficulty) => {
  // Don't trigger events too frequently
  const minTimeBetweenEvents = 120 // 2 minutes
  if (currentTime - lastEventTime < minTimeBetweenEvents) {
    return null
  }
  
  // Adjust probability based on difficulty
  const difficultyMultiplier = {
    easy: 0.5,
    normal: 1.0,
    hard: 1.5,
    expert: 2.0,
  }[difficulty] || 1.0
  
  // Check each event
  const events = Object.values(CINEMATIC_EVENTS)
  for (const event of events) {
    const roll = Math.random()
    const adjustedProbability = event.probability * difficultyMultiplier
    
    if (roll < adjustedProbability) {
      return {
        ...event,
        triggeredAt: currentTime,
        expiresAt: currentTime + event.effect.duration,
      }
    }
  }
  
  return null
}

export const applyEventEffect = (event, gameState) => {
  const effects = {}
  
  if (event.effect.visibilityIncrease) {
    effects.visibilityChange = event.effect.visibilityIncrease
  }
  
  if (event.effect.visibilityDecrease) {
    effects.visibilityChange = -event.effect.visibilityDecrease
  }
  
  if (event.effect.idsDisabled) {
    effects.idsDisabled = true
  }
  
  effects.message = event.effect.message
  effects.isBonus = event.effect.bonus || false
  effects.duration = event.effect.duration
  
  return effects
}

export const getEventColor = (event) => {
  const colors = {
    green: 'text-green-400 border-green-500',
    yellow: 'text-yellow-400 border-yellow-500',
    orange: 'text-orange-400 border-orange-500',
    red: 'text-red-400 border-red-500',
    blue: 'text-blue-400 border-blue-500',
  }
  return colors[event.color] || colors.yellow
}

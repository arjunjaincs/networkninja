// IDS/IPS detection logic

export const calculateDetectionChance = (visibility, noiseLevel) => {
  // Detection chance increases with visibility and noise
  const baseChance = (visibility * 0.5) + (noiseLevel * 0.3)
  return Math.min(100, Math.max(0, baseChance))
}

export const checkForDetection = (visibility, noiseLevel) => {
  const detectionChance = calculateDetectionChance(visibility, noiseLevel)
  const roll = Math.random() * 100
  
  return roll < detectionChance
}

export const getDetectionRisk = (visibility) => {
  if (visibility < 30) return 'low'
  if (visibility < 60) return 'medium'
  if (visibility < 90) return 'high'
  return 'critical'
}

export const getDetectionRiskColor = (risk) => {
  switch (risk) {
    case 'low':
      return 'text-cyber-green'
    case 'medium':
      return 'text-cyber-yellow'
    case 'high':
      return 'text-orange-500'
    case 'critical':
      return 'text-cyber-red'
    default:
      return 'text-gray-400'
  }
}

export const getAlertStatusColor = (alertStatus) => {
  switch (alertStatus) {
    case 'safe':
      return 'bg-cyber-green'
    case 'suspicious':
      return 'bg-cyber-yellow'
    case 'high':
      return 'bg-orange-500'
    case 'critical':
      return 'bg-cyber-red'
    default:
      return 'bg-gray-500'
  }
}

export const getAlertStatusText = (alertStatus) => {
  switch (alertStatus) {
    case 'safe':
      return 'SAFE'
    case 'suspicious':
      return 'SUSPICIOUS'
    case 'high':
      return 'HIGH ALERT'
    case 'critical':
      return 'CRITICAL'
    default:
      return 'UNKNOWN'
  }
}

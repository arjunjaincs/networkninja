// Scoring and rating calculations

export const calculateStealthRating = (visibility, maxVisibility = 100) => {
  const stealthPercent = ((maxVisibility - visibility) / maxVisibility) * 100
  
  if (stealthPercent >= 90) return 'S'
  if (stealthPercent >= 80) return 'A'
  if (stealthPercent >= 70) return 'B'
  if (stealthPercent >= 60) return 'C'
  if (stealthPercent >= 50) return 'D'
  return 'F'
}

export const calculateTimeBonus = (timeRemaining, timeLimit) => {
  const timeUsedPercent = ((timeLimit - timeRemaining) / timeLimit) * 100
  
  if (timeUsedPercent <= 25) return 500 // Very fast
  if (timeUsedPercent <= 50) return 300 // Fast
  if (timeUsedPercent <= 75) return 100 // Normal
  return 0 // Slow
}

export const calculateObjectiveBonus = (objectives) => {
  let bonus = 0
  if (objectives.primary) bonus += 1000
  if (objectives.secondary) bonus += 500
  if (objectives.tertiary) bonus += 300
  return bonus
}

export const calculateTotalScore = (objectives, visibility, timeRemaining, timeLimit) => {
  const objectiveBonus = calculateObjectiveBonus(objectives)
  const stealthBonus = Math.floor((100 - visibility) * 5)
  const timeBonus = calculateTimeBonus(timeRemaining, timeLimit)
  
  return objectiveBonus + stealthBonus + timeBonus
}

export const getRatingColor = (rating) => {
  switch (rating) {
    case 'S':
      return 'text-cyber-cyan'
    case 'A':
      return 'text-cyber-green'
    case 'B':
      return 'text-green-400'
    case 'C':
      return 'text-cyber-yellow'
    case 'D':
      return 'text-orange-500'
    case 'F':
      return 'text-cyber-red'
    default:
      return 'text-gray-400'
  }
}

export const getRatingDescription = (rating) => {
  switch (rating) {
    case 'S':
      return 'Perfect Stealth - Ghost'
    case 'A':
      return 'Excellent Stealth - Ninja'
    case 'B':
      return 'Good Stealth - Professional'
    case 'C':
      return 'Average Stealth - Competent'
    case 'D':
      return 'Poor Stealth - Sloppy'
    case 'F':
      return 'Failed Stealth - Detected'
    default:
      return 'Unknown'
  }
}

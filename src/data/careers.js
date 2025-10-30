// Career progression system - from Script Kiddie to Nation-State Operator

export const CAREER_RANKS = {
  SCRIPT_KIDDIE: 'script_kiddie',
  AMATEUR_HACKER: 'amateur_hacker',
  PENETRATION_TESTER: 'penetration_tester',
  RED_TEAMER: 'red_teamer',
  ADVANCED_PERSISTENT_THREAT: 'advanced_persistent_threat',
  NATION_STATE_OPERATOR: 'nation_state_operator',
}

export const careerLevels = [
  {
    id: CAREER_RANKS.SCRIPT_KIDDIE,
    name: 'Script Kiddie',
    icon: '🐣',
    minScore: 0,
    description: 'Just starting out. Using basic tools and techniques.',
    skills: ['Basic reconnaissance', 'Simple exploits', 'Following tutorials'],
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500',
  },
  {
    id: CAREER_RANKS.AMATEUR_HACKER,
    name: 'Amateur Hacker',
    icon: '💻',
    minScore: 5000,
    description: 'Learning the ropes. Starting to understand how systems work.',
    skills: ['Network mapping', 'Vulnerability scanning', 'Basic exploitation'],
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500',
  },
  {
    id: CAREER_RANKS.PENETRATION_TESTER,
    name: 'Penetration Tester',
    icon: '🔐',
    minScore: 15000,
    description: 'Professional security tester. Authorized to find vulnerabilities.',
    skills: ['Methodical testing', 'Report writing', 'Client communication', 'Stealth techniques'],
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500',
  },
  {
    id: CAREER_RANKS.RED_TEAMER,
    name: 'Red Team Operator',
    icon: '🎯',
    minScore: 30000,
    description: 'Elite offensive security. Simulating real-world adversaries.',
    skills: ['Advanced persistence', 'Social engineering', 'Custom exploits', 'Operational security'],
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500',
  },
  {
    id: CAREER_RANKS.ADVANCED_PERSISTENT_THREAT,
    name: 'APT Specialist',
    icon: '👤',
    minScore: 50000,
    description: 'Advanced Persistent Threat operator. Long-term campaigns.',
    skills: ['Zero-day development', 'Infrastructure setup', 'Long-term persistence', 'Counter-forensics'],
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
  },
  {
    id: CAREER_RANKS.NATION_STATE_OPERATOR,
    name: 'Nation-State Operator',
    icon: '🌐',
    minScore: 75000,
    description: 'Elite cyber warfare specialist. State-sponsored operations.',
    skills: ['Supply chain attacks', 'Critical infrastructure', 'Attribution evasion', 'Strategic operations'],
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500',
  },
]

export const getCareerRank = (totalScore) => {
  // Find the highest rank the player qualifies for
  let currentRank = careerLevels[0]
  
  for (const rank of careerLevels) {
    if (totalScore >= rank.minScore) {
      currentRank = rank
    } else {
      break
    }
  }
  
  return currentRank
}

export const getNextRank = (currentRank) => {
  const currentIndex = careerLevels.findIndex(r => r.id === currentRank.id)
  if (currentIndex < careerLevels.length - 1) {
    return careerLevels[currentIndex + 1]
  }
  return null
}

export const getProgressToNextRank = (totalScore, currentRank) => {
  const nextRank = getNextRank(currentRank)
  if (!nextRank) return 100 // Max rank achieved
  
  const currentMin = currentRank.minScore
  const nextMin = nextRank.minScore
  const progress = ((totalScore - currentMin) / (nextMin - currentMin)) * 100
  
  return Math.min(100, Math.max(0, progress))
}

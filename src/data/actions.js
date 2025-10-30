// Action definitions with noise levels, time costs, and success rates

export const ACTION_CATEGORIES = {
  RECONNAISSANCE: 'reconnaissance',
  EXPLOITATION: 'exploitation',
  MOVEMENT: 'movement',
  STEALTH: 'stealth',
  EXFILTRATION: 'exfiltration',
}

export const NOISE_LEVELS = {
  QUIET: 'quiet',
  MODERATE: 'moderate',
  LOUD: 'loud',
}

export const actions = {
  // RECONNAISSANCE
  passiveScan: {
    id: 'passiveScan',
    name: 'Passive Scan',
    category: ACTION_CATEGORIES.RECONNAISSANCE,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: 5,
    timeCost: 10,
    successRate: 100,
    description: 'Quietly observe network traffic to identify one connected node',
    command: 'ping <target>',
    icon: '🔍',
    energyCost: 10,
  },
  portScan: {
    id: 'portScan',
    name: 'Port Scan',
    category: ACTION_CATEGORIES.RECONNAISSANCE,
    noiseLevel: NOISE_LEVELS.MODERATE,
    visibilityIncrease: 20,
    timeCost: 5,
    successRate: 100,
    description: 'Scan all ports on current node to reveal vulnerabilities',
    command: 'nmap <target>',
    icon: '🔎',
    energyCost: 20,
  },
  networkMapping: {
    id: 'networkMapping',
    name: 'Network Mapping',
    category: ACTION_CATEGORIES.RECONNAISSANCE,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: 10,
    timeCost: 15,
    successRate: 100,
    command: 'nmap -sS <target>',
    description: 'Map the entire network topology',
    icon: '🗺️',
    energyCost: 25,
  },

  // EXPLOITATION
  exploitKnownVuln: {
    id: 'exploitKnownVuln',
    name: 'Exploit Known Vulnerability',
    category: ACTION_CATEGORIES.EXPLOITATION,
    noiseLevel: NOISE_LEVELS.MODERATE,
    visibilityIncrease: 25,
    timeCost: 8,
    successRate: 70,
    description: 'Use known exploits to compromise the current node',
    command: 'exploit <target>',
    icon: '⚡',
    energyCost: 30,
  },
  bruteForce: {
    id: 'bruteForce',
    name: 'Brute Force',
    category: ACTION_CATEGORIES.EXPLOITATION,
    noiseLevel: NOISE_LEVELS.LOUD,
    visibilityIncrease: 50,
    timeCost: 20,
    successRate: 90,
    description: 'Force your way in - loud but effective',
    command: 'hydra -l admin -P wordlist.txt',
    icon: '💥',
    energyCost: 40,
  },
  zeroDayExploit: {
    id: 'zeroDayExploit',
    name: 'Zero-Day Exploit',
    category: ACTION_CATEGORIES.EXPLOITATION,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: 15,
    timeCost: 12,
    successRate: 50,
    description: 'Use an unknown exploit - risky but stealthy',
    command: 'msfconsole',
    icon: '🎯',
    energyCost: 50,
  },

  // MOVEMENT
  lateralMovement: {
    id: 'lateralMovement',
    name: 'Lateral Movement',
    category: ACTION_CATEGORIES.MOVEMENT,
    noiseLevel: NOISE_LEVELS.MODERATE,
    visibilityIncrease: 20,
    timeCost: 5,
    successRate: 100,
    description: 'Move to a connected node',
    icon: '➡️',
    energyCost: 15,
  },
  pivot: {
    id: 'pivot',
    name: 'Pivot',
    category: ACTION_CATEGORIES.MOVEMENT,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: 10,
    timeCost: 10,
    successRate: 100,
    description: 'Establish persistent access for quick re-entry',
    icon: '🔄',
    energyCost: 25,
  },

  // STEALTH
  clearLogs: {
    id: 'clearLogs',
    name: 'Clear Logs',
    category: ACTION_CATEGORIES.STEALTH,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: -30,
    timeCost: 8,
    successRate: 100,
    description: 'Remove traces of your activities',
    command: 'rm /var/log/* && history -c',
    icon: '🧹',
    energyCost: 20,
  },
  createBackdoor: {
    id: 'createBackdoor',
    name: 'Create Backdoor',
    category: ACTION_CATEGORIES.STEALTH,
    noiseLevel: NOISE_LEVELS.MODERATE,
    visibilityIncrease: 25,
    timeCost: 15,
    successRate: 100,
    description: 'Install persistent access mechanism',
    icon: '🚪',
    energyCost: 35,
  },
  coverTracks: {
    id: 'coverTracks',
    name: 'Cover Tracks',
    category: ACTION_CATEGORIES.STEALTH,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: -40,
    timeCost: 12,
    successRate: 100,
    description: 'Thoroughly hide all evidence of intrusion',
    icon: '👻',
    energyCost: 30,
  },

  // EXFILTRATION
  downloadData: {
    id: 'downloadData',
    name: 'Download Data',
    category: ACTION_CATEGORIES.EXFILTRATION,
    noiseLevel: NOISE_LEVELS.MODERATE,
    visibilityIncrease: 30,
    timeCost: 10,
    successRate: 100,
    description: 'Quickly download target data',
    icon: '📥',
    energyCost: 25,
  },
  encryptAndSend: {
    id: 'encryptAndSend',
    name: 'Encrypt & Send',
    category: ACTION_CATEGORIES.EXFILTRATION,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: 15,
    timeCost: 15,
    successRate: 100,
    description: 'Securely exfiltrate data with encryption',
    icon: '🔐',
    energyCost: 30,
  },
  usbDrop: {
    id: 'usbDrop',
    name: 'USB Drop',
    category: ACTION_CATEGORIES.EXFILTRATION,
    noiseLevel: NOISE_LEVELS.QUIET,
    visibilityIncrease: 5,
    timeCost: 20,
    successRate: 100,
    description: 'Physical data exfiltration - requires workstation access',
    icon: '💾',
    energyCost: 15,
  },
}

// Helper function to get actions by category
export const getActionsByCategory = (category) => {
  return Object.values(actions).filter(action => action.category === category)
}

// Helper function to get noise level color
export const getNoiseColor = (noiseLevel) => {
  switch (noiseLevel) {
    case NOISE_LEVELS.QUIET:
      return 'text-cyber-green'
    case NOISE_LEVELS.MODERATE:
      return 'text-cyber-yellow'
    case NOISE_LEVELS.LOUD:
      return 'text-cyber-red'
    default:
      return 'text-gray-400'
  }
}

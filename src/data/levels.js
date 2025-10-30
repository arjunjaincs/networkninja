// Level definitions with objectives, difficulty, and educational content

export const DIFFICULTY = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  EXPERT: 'expert',
}

export const levels = {
  1: {
    id: 1,
    name: 'Small Office Network',
    difficulty: DIFFICULTY.EASY,
    timeLimit: 3600, // 60 minutes in seconds
    objectives: {
      primary: {
        id: 'steal-employee-db',
        description: 'Steal employee database from file server',
        targetNode: 'file-server-1',
        completed: false,
      },
      secondary: {
        id: 'no-ids-trigger',
        description: 'Complete without triggering IDS (stay below 60% visibility)',
        threshold: 60,
        completed: false,
      },
      tertiary: {
        id: 'time-bonus',
        description: 'Complete within 30 minutes',
        timeLimit: 1800,
        completed: false,
      },
    },
    startingNode: 'workstation-1',
    briefing: {
      title: 'Mission Briefing: Small Office Infiltration',
      description: 'A small business has been suspected of illegal activities. Your mission is to infiltrate their network and extract their employee database as evidence.',
      target: 'Employee Database on File Server',
      intel: [
        'Network has basic security - no IDS/IPS detected',
        'You have compromised an employee workstation via phishing',
        'File server is connected to workstations',
        'Weak passwords are common in this network',
      ],
      tips: [
        'Start with reconnaissance to map the network',
        'Use stealth actions to keep visibility low',
        'Clear logs regularly to avoid detection',
      ],
    },
    educational: {
      concepts: [
        'Lateral Movement',
        'Network Reconnaissance',
        'Log Clearing',
        'Data Exfiltration',
      ],
      realWorldExample: {
        title: 'Similar Attack: Target Corporation Breach (2013)',
        description: 'Attackers compromised a third-party HVAC vendor, moved laterally through the network, and stole 40 million credit card numbers.',
        lesson: 'Even small entry points can lead to major breaches if lateral movement is not restricted.',
        references: [
          { title: 'Target Breach Analysis', url: 'https://krebsonsecurity.com/2014/02/target-hackers-broke-in-via-hvac-company/' },
          { title: 'Lessons Learned', url: 'https://www.sans.org/reading-room/whitepapers/breaches/case-study-critical-controls-target-breach-35412' },
        ],
        impact: {
          financialLoss: '$162 million in settlements',
          recordsStolen: '40 million credit cards',
          duration: '2 weeks undetected',
        },
      },
      defenseStrategies: [
        'Network Segmentation: Isolate critical systems',
        'Log Monitoring: Detect unusual access patterns',
        'Least Privilege: Limit user permissions',
        'Multi-Factor Authentication: Prevent credential theft',
      ],
      tools: [
        'Nmap: Network scanning and reconnaissance',
        'Metasploit: Exploitation framework',
        'Mimikatz: Credential extraction',
        'PowerShell Empire: Post-exploitation',
      ],
    },
  },
  2: {
    id: 2,
    name: 'Corporate Network',
    difficulty: DIFFICULTY.NORMAL,
    timeLimit: 1800, // 30 minutes
    objectives: {
      primary: {
        id: 'exfiltrate-financial-reports',
        description: 'Exfiltrate financial reports from finance server',
        targetNode: 'finance-server-1',
        completed: false,
      },
      secondary: {
        id: 'avoid-ids',
        description: 'Avoid IDS detection (stay below 50% visibility)',
        threshold: 50,
        completed: false,
      },
      tertiary: {
        id: 'compromise-admin',
        description: 'Compromise IT Admin workstation for bonus',
        targetNode: 'workstation-3',
        completed: false,
      },
    },
    startingNode: 'workstation-1',
    briefing: {
      title: 'Mission Briefing: Corporate Espionage',
      description: 'A competitor wants insider information. Infiltrate the corporate network and steal their Q4 financial reports.',
      target: 'Financial Reports on Finance Server',
      intel: [
        'Network has active IDS monitoring',
        'Finance PC has been compromised via phishing',
        'IT Admin has elevated privileges',
        'Multiple workstations and servers present',
      ],
      tips: [
        'IDS will increase detection chance - be stealthy',
        'Use quiet actions when possible',
        'IT Admin PC may provide easier access to servers',
        'Cover your tracks frequently',
      ],
    },
    educational: {
      concepts: [
        'IDS Evasion',
        'Privilege Escalation',
        'Network Pivoting',
        'Stealth Techniques',
      ],
      realWorldExample: {
        title: 'Similar Attack: Sony Pictures Hack (2014)',
        description: 'Attackers infiltrated Sony\'s network, moved laterally, and exfiltrated 100TB of data including unreleased films and employee information.',
        lesson: 'Corporate networks need robust monitoring and segmentation to prevent lateral movement.',
        references: [
          { title: 'Sony Breach Timeline', url: 'https://www.csoonline.com/article/2861020/the-sony-pictures-hack-what-you-need-to-know.html' },
          { title: 'Technical Analysis', url: 'https://www.riskbasedsecurity.com/2014/12/a-breakdown-and-analysis-of-the-december-2014-sony-hack/' },
        ],
        impact: {
          financialLoss: '$100+ million in damages',
          recordsStolen: '100TB of data',
          duration: 'Months of persistence',
        },
      },
      defenseStrategies: [
        'IDS/IPS Deployment: Monitor for suspicious activity',
        'Privileged Access Management: Control admin accounts',
        'Network Traffic Analysis: Detect data exfiltration',
        'Security Awareness Training: Prevent phishing',
      ],
      tools: [
        'Cobalt Strike: Advanced threat emulation',
        'BloodHound: Active Directory mapping',
        'Wireshark: Network traffic analysis',
        'Sysmon: System monitoring',
      ],
    },
  },
}

// Helper functions
export const getLevel = (levelId) => {
  return levels[levelId]
}

export const getTotalLevels = () => {
  return Object.keys(levels).length
}

export const getNextLevel = (currentLevel) => {
  const nextLevelId = currentLevel + 1
  return levels[nextLevelId] || null
}

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case DIFFICULTY.EASY:
      return 'text-cyber-green'
    case DIFFICULTY.NORMAL:
      return 'text-cyber-yellow'
    case DIFFICULTY.HARD:
      return 'text-orange-500'
    case DIFFICULTY.EXPERT:
      return 'text-cyber-red'
    default:
      return 'text-gray-400'
  }
}

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

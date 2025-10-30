// Dynamic Mission Generator - Procedural briefings and objectives

export const MISSION_TEMPLATES = {
  CORPORATE_ESPIONAGE: {
    id: 'corporate_espionage',
    companies: ['TechCorp', 'BioGenix', 'CyberDyne Systems', 'Nexus Industries', 'Quantum Labs'],
    targets: ['trade secrets', 'product designs', 'financial reports', 'merger documents', 'R&D data'],
    briefing: "Your client needs intel on {company}'s {target}. Infiltrate their network and exfiltrate the data without triggering their security team.",
    objectives: {
      primary: "Locate and exfiltrate {target}",
      secondary: "Remain undetected (visibility < 70%)",
      tertiary: "Compromise executive workstation",
    },
  },
  
  WHISTLEBLOWER: {
    id: 'whistleblower',
    companies: ['MegaPharm', 'Global Energy Corp', 'DataMine Inc', 'ChemTech Industries'],
    targets: ['safety violations', 'illegal activities', 'cover-up documents', 'fraud evidence', 'environmental data'],
    briefing: "Anonymous tip suggests {company} is hiding {target}. Break in, find the evidence, and leak it to the press. The public deserves to know.",
    objectives: {
      primary: "Obtain evidence of {target}",
      secondary: "Copy data to external server",
      tertiary: "Leave no trace of intrusion",
    },
  },
  
  RANSOMWARE: {
    id: 'ransomware',
    companies: ['City Hospital', 'Regional Bank', 'School District', 'Manufacturing Co'],
    targets: ['patient records', 'financial systems', 'student data', 'production systems'],
    briefing: "Ransomware gang hired you to infiltrate {company} and encrypt their {target}. Deploy the payload and establish persistence for ransom negotiations.",
    objectives: {
      primary: "Deploy ransomware on {target}",
      secondary: "Establish backdoor for persistence",
      tertiary: "Disable backup systems",
    },
  },
  
  HACKTIVIST: {
    id: 'hacktivist',
    companies: ['Government Agency', 'Defense Contractor', 'Surveillance Corp', 'Border Control'],
    targets: ['classified documents', 'surveillance data', 'citizen records', 'operation plans'],
    briefing: "Your activist group opposes {company}'s activities. Breach their network, steal {target}, and expose their operations to the world.",
    objectives: {
      primary: "Exfiltrate {target}",
      secondary: "Deface internal systems with message",
      tertiary: "Leak data to multiple outlets",
    },
  },
  
  NATION_STATE: {
    id: 'nation_state',
    companies: ['Foreign Embassy', 'Military Contractor', 'Intelligence Agency', 'Critical Infrastructure'],
    targets: ['diplomatic cables', 'weapon systems', 'agent identities', 'infrastructure controls'],
    briefing: "State-sponsored operation: Infiltrate {company} and acquire {target}. This is a matter of national security. Use any means necessary.",
    objectives: {
      primary: "Steal {target}",
      secondary: "Plant surveillance implants",
      tertiary: "Maintain long-term access",
    },
  },
  
  PENETRATION_TEST: {
    id: 'pentest',
    companies: ['Fortune 500 Company', 'Healthcare Provider', 'Financial Institution', 'Tech Startup'],
    targets: ['security weaknesses', 'access controls', 'data protection', 'incident response'],
    briefing: "{company} hired you for a penetration test. Assess their {target} and document all vulnerabilities. They want to know how secure they really are.",
    objectives: {
      primary: "Test {target} thoroughly",
      secondary: "Document all findings",
      tertiary: "Avoid causing damage or disruption",
    },
  },
}

export const MORAL_ALIGNMENTS = {
  WHISTLEBLOWER: {
    name: 'Whistleblower',
    icon: '📢',
    description: 'Expose corruption and wrongdoing for the greater good',
    color: 'blue',
    availableMissions: ['WHISTLEBLOWER', 'HACKTIVIST', 'PENETRATION_TEST'],
    tools: ['Anonymous routing', 'Secure drop sites', 'Media contacts'],
    scoreMultiplier: 1.2,
  },
  
  MERCENARY: {
    name: 'Mercenary',
    icon: '💰',
    description: 'Work for the highest bidder, no questions asked',
    color: 'yellow',
    availableMissions: ['CORPORATE_ESPIONAGE', 'RANSOMWARE', 'NATION_STATE', 'PENETRATION_TEST'],
    tools: ['Advanced exploits', 'Custom malware', 'Offshore servers'],
    scoreMultiplier: 1.5,
  },
  
  HACKTIVIST: {
    name: 'Hacktivist',
    icon: '✊',
    description: 'Fight for digital freedom and social justice',
    color: 'purple',
    availableMissions: ['HACKTIVIST', 'WHISTLEBLOWER', 'PENETRATION_TEST'],
    tools: ['DDoS tools', 'Defacement kits', 'Leak platforms'],
    scoreMultiplier: 1.3,
  },
}

export const generateMission = (alignment = 'MERCENARY', difficulty = 'normal') => {
  const alignmentData = MORAL_ALIGNMENTS[alignment]
  const availableTemplates = alignmentData.availableMissions.map(id => 
    Object.values(MISSION_TEMPLATES).find(t => t.id.toUpperCase() === id)
  ).filter(Boolean)
  
  // Select random template
  const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)]
  
  // Fill in random values
  const company = template.companies[Math.floor(Math.random() * template.companies.length)]
  const target = template.targets[Math.floor(Math.random() * template.targets.length)]
  
  const briefing = template.briefing
    .replace(/{company}/g, company)
    .replace(/{target}/g, target)
  
  const objectives = {
    primary: {
      id: 'primary',
      description: template.objectives.primary.replace(/{target}/g, target),
      completed: false,
    },
    secondary: {
      id: 'secondary',
      description: template.objectives.secondary.replace(/{target}/g, target),
      completed: false,
    },
    tertiary: {
      id: 'tertiary',
      description: template.objectives.tertiary.replace(/{target}/g, target),
      completed: false,
    },
  }
  
  return {
    id: `${template.id}_${Date.now()}`,
    type: template.id,
    company,
    target,
    briefing,
    objectives,
    alignment: alignmentData.name,
    alignmentIcon: alignmentData.icon,
    difficulty,
    scoreMultiplier: alignmentData.scoreMultiplier,
    generatedAt: new Date().toISOString(),
  }
}

export const generateDebrief = (mission, result) => {
  const { alignment, company, target, objectives } = mission
  const { success, score, visibility, timeUsed } = result
  
  const debriefs = {
    WHISTLEBLOWER: {
      success: `Mission accomplished. The evidence of ${target} has been leaked to multiple news outlets. ${company}'s corruption will be exposed.`,
      failure: `Mission failed. ${company}'s security team detected the intrusion before you could leak the ${target}. The truth remains hidden.`,
    },
    MERCENARY: {
      success: `Contract fulfilled. The ${target} has been delivered to the client. Payment received: ${score} credits. Another satisfied customer.`,
      failure: `Contract failed. ${company}'s defenses were too strong. No payment. Your reputation takes a hit.`,
    },
    HACKTIVIST: {
      success: `Victory for the cause! ${company}'s ${target} has been exposed. The people now know the truth. Power to the people!`,
      failure: `The operation failed. ${company} remains in power. But the fight continues. We'll be back.`,
    },
  }
  
  const alignmentKey = Object.keys(MORAL_ALIGNMENTS).find(key => 
    MORAL_ALIGNMENTS[key].name === alignment
  ) || 'MERCENARY'
  
  const baseDebrief = success 
    ? debriefs[alignmentKey].success 
    : debriefs[alignmentKey].failure
  
  // Add performance notes
  let performanceNotes = []
  
  if (visibility < 30) {
    performanceNotes.push("🥷 Ghost-like stealth. They never saw you coming.")
  } else if (visibility > 80) {
    performanceNotes.push("🚨 Loud and messy. Every alarm in the building went off.")
  }
  
  if (objectives.secondary.completed && objectives.tertiary.completed) {
    performanceNotes.push("⭐ All objectives completed. Flawless execution.")
  }
  
  if (timeUsed < 300) {
    performanceNotes.push("⚡ Lightning fast. In and out before they knew what happened.")
  }
  
  return {
    summary: baseDebrief,
    performanceNotes,
    score,
    visibility,
    timeUsed,
  }
}

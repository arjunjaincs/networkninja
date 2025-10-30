// AI Security Opponent - Narrative responses to player actions

export const AI_OPPONENT_RESPONSES = {
  // Low visibility (0-30)
  LOW_VISIBILITY: [
    "SOC: Network traffic appears normal. No anomalies detected.",
    "IDS: Baseline activity within acceptable parameters.",
    "Security Team: All systems operational. No alerts.",
    "Firewall: Standard traffic patterns observed.",
    "SIEM: No suspicious events logged in the past hour.",
  ],
  
  // Medium visibility (31-60)
  MEDIUM_VISIBILITY: [
    "SOC Analyst: Hmm, seeing some unusual port scans. Investigating...",
    "IDS Alert: Anomalous traffic pattern detected on subnet 192.168.1.0/24",
    "Security Team: Multiple failed login attempts logged. Monitoring closely.",
    "Firewall: Suspicious connection attempts from unknown source.",
    "SIEM: Correlation rule triggered - potential reconnaissance activity.",
    "SOC Lead: Team, keep an eye on those authentication logs.",
  ],
  
  // High visibility (61-80)
  HIGH_VISIBILITY: [
    "SOC Analyst: ALERT! Confirmed intrusion attempt in progress!",
    "IDS: CRITICAL - Exploit signature matched! Blocking traffic.",
    "Security Team: All hands on deck! We have an active breach!",
    "Incident Response: Initiating containment procedures NOW.",
    "SIEM: Multiple high-severity alerts! Attacker is inside the network!",
    "SOC Lead: Lock down all critical systems! This is not a drill!",
    "Firewall: Emergency rules activated. Dropping suspicious connections.",
  ],
  
  // Critical visibility (81-100)
  CRITICAL_VISIBILITY: [
    "SOC Director: FULL INCIDENT RESPONSE MODE! All teams mobilize!",
    "IDS: BREACH CONFIRMED! Attacker has compromised multiple systems!",
    "Security Team: Isolating affected segments! Calling in forensics!",
    "Incident Commander: We're being actively exploited! Shut it down!",
    "SIEM: CRITICAL BREACH - Data exfiltration detected!",
    "SOC Lead: Contact law enforcement! This is a major incident!",
    "Firewall: Maximum security posture! Blocking all non-essential traffic!",
    "CISO: Board has been notified. PR team on standby.",
  ],
  
  // Specific action responses
  RECONNAISSANCE: [
    "IDS: Port scan detected from external source.",
    "SOC: Someone's mapping our network topology...",
    "Firewall: Reconnaissance activity logged and flagged.",
  ],
  
  EXPLOITATION: [
    "IDS: EXPLOIT ATTEMPT DETECTED! Signature: {exploit}",
    "SOC Analyst: They're trying to exploit a vulnerability!",
    "Security Team: Active exploitation in progress! Respond immediately!",
  ],
  
  PRIVILEGE_ESCALATION: [
    "SIEM: Privilege escalation attempt detected!",
    "SOC: Attacker is trying to gain admin access!",
    "Security Team: CRITICAL - Unauthorized privilege elevation!",
  ],
  
  DATA_EXFILTRATION: [
    "DLP: Large data transfer detected! Possible exfiltration!",
    "SOC: They're stealing our data! Block outbound connections!",
    "SIEM: ALERT - Sensitive data leaving the network!",
  ],
  
  BACKDOOR: [
    "IDS: Persistent backdoor mechanism detected!",
    "SOC: They're establishing persistence! Find and remove it!",
    "Security Team: Backdoor installation in progress!",
  ],
}

export const getAIResponse = (visibility, actionType = null) => {
  let responses = []
  
  // Select response pool based on visibility
  if (visibility < 30) {
    responses = AI_OPPONENT_RESPONSES.LOW_VISIBILITY
  } else if (visibility < 60) {
    responses = AI_OPPONENT_RESPONSES.MEDIUM_VISIBILITY
  } else if (visibility < 80) {
    responses = AI_OPPONENT_RESPONSES.HIGH_VISIBILITY
  } else {
    responses = AI_OPPONENT_RESPONSES.CRITICAL_VISIBILITY
  }
  
  // Add action-specific responses
  if (actionType && AI_OPPONENT_RESPONSES[actionType]) {
    responses = [...responses, ...AI_OPPONENT_RESPONSES[actionType]]
  }
  
  // Return random response
  return responses[Math.floor(Math.random() * responses.length)]
}

export const generateContextualResponse = (gameState) => {
  const { visibility, compromisedNodes, discoveredNodes, timeRemaining } = gameState
  
  // Time-based urgency
  if (timeRemaining < 60 && visibility > 70) {
    return "SOC Lead: They're running out of time but still active! Increase monitoring!"
  }
  
  // Progress-based responses
  if (compromisedNodes.length > 5 && visibility < 40) {
    return "SOC Analyst: How did they compromise so many systems without triggering alerts?!"
  }
  
  if (discoveredNodes.length > 10 && visibility < 30) {
    return "Security Team: Someone's been quietly mapping our entire network..."
  }
  
  // Default to visibility-based
  return getAIResponse(visibility)
}

export const AI_OPPONENT_PERSONALITIES = {
  ROOKIE: {
    name: "Junior SOC Analyst",
    description: "New to the job, slower to detect threats",
    detectionDelay: 1.5,
    responseQuality: 0.7,
    messages: [
      "Um, is this normal? Should I escalate this?",
      "Let me check the playbook...",
      "I think I see something but I'm not sure...",
    ],
  },
  
  VETERAN: {
    name: "Senior SOC Analyst",
    description: "Experienced defender, quick to spot anomalies",
    detectionDelay: 1.0,
    responseQuality: 1.0,
    messages: [
      "I've seen this pattern before. Initiating response.",
      "Textbook intrusion attempt. Not on my watch.",
      "Nice try, but I know all the tricks.",
    ],
  },
  
  EXPERT: {
    name: "Incident Response Lead",
    description: "Elite defender, anticipates attacker moves",
    detectionDelay: 0.7,
    responseQuality: 1.3,
    messages: [
      "Predicted your next move. Countermeasures deployed.",
      "You're good, but I'm better. Game over.",
      "I've been hunting threats like you for 15 years.",
    ],
  },
}

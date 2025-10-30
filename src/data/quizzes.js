// Educational quizzes for each level

export const levelQuizzes = {
  1: {
    question: "How would a blue team (defenders) detect and stop the attack you just performed?",
    options: [
      {
        id: 'a',
        text: 'Implement network segmentation to isolate critical systems',
        correct: true,
        explanation: 'Correct! Network segmentation limits lateral movement. Even if one system is compromised, attackers cannot easily reach other systems.',
      },
      {
        id: 'b',
        text: 'Use stronger passwords only',
        correct: false,
        explanation: 'While strong passwords help, they are not enough. Attackers can use other methods like exploiting vulnerabilities or social engineering.',
      },
      {
        id: 'c',
        text: 'Disable all network connections',
        correct: false,
        explanation: 'This would prevent the attack but also make the network unusable. Security should balance protection with functionality.',
      },
      {
        id: 'd',
        text: 'Install antivirus software only',
        correct: false,
        explanation: 'Antivirus is one layer, but modern attacks often bypass it. Defense in depth requires multiple security controls.',
      },
    ],
    blueTeamStrategies: [
      'Deploy IDS/IPS to monitor network traffic',
      'Implement log aggregation and SIEM for detection',
      'Use network segmentation (VLANs, firewalls)',
      'Enable multi-factor authentication',
      'Regular security awareness training',
      'Patch management and vulnerability scanning',
    ],
  },
  2: {
    question: "The IDS detected some of your activities. What is the BEST way for defenders to respond to IDS alerts?",
    options: [
      {
        id: 'a',
        text: 'Investigate alerts immediately with a documented incident response process',
        correct: true,
        explanation: 'Correct! Quick investigation with proper procedures helps contain threats before they cause damage. Time is critical in incident response.',
      },
      {
        id: 'b',
        text: 'Ignore alerts because they are usually false positives',
        correct: false,
        explanation: 'Dangerous approach! While false positives exist, ignoring alerts can miss real attacks. Tune your IDS and investigate all alerts.',
      },
      {
        id: 'c',
        text: 'Immediately shut down all systems',
        correct: false,
        explanation: 'Too extreme. This causes business disruption. Proper incident response involves assessment, containment, and measured response.',
      },
      {
        id: 'd',
        text: 'Wait 24 hours to see if more alerts appear',
        correct: false,
        explanation: 'Waiting gives attackers time to establish persistence and exfiltrate data. Rapid response is essential.',
      },
    ],
    blueTeamStrategies: [
      'Tune IDS/IPS to reduce false positives',
      'Implement automated response for known threats',
      'Create incident response playbooks',
      'Practice incident response with tabletop exercises',
      'Use threat intelligence feeds',
      'Implement network traffic analysis (NTA)',
    ],
  },
}

export const getQuizForLevel = (levelId) => {
  return levelQuizzes[levelId] || null
}

export const calculateQuizBonus = (correct) => {
  return correct ? 500 : 0 // Bonus points for correct answer
}

// Dynamic News Generator - Creates unique headlines based on player actions

export class NewsGenerator {
  constructor() {
    this.headlines = []
    this.companies = ['TechCorp', 'MediSys', 'FinanceHub', 'DataVault', 'CyberDyne', 'SecureNet']
    this.journalists = ['Sarah Chen', 'Mike Rodriguez', 'Dr. Kim Park', 'Alex Thompson']
  }

  generateHeadline(action, playerData) {
    const templates = {
      hospital_hack: [
        `Cyber Attack on ${action.target} Exposes ${this.randomNumber(5000, 50000)} Patient Records`,
        `Healthcare Crisis: ${action.target} Systems Compromised by Unknown Hacker`,
        `FBI Investigating Massive Breach at ${action.target} Medical Center`,
        `${action.target} Patients Urged to Monitor Credit After Data Breach`
      ],
      bank_heist: [
        `${action.target} Reports $${this.randomNumber(100000, 5000000)} Stolen in Cyber Heist`,
        `Digital Bank Robbery: ${action.target} Customers Panic as Accounts Compromised`,
        `Mysterious Hacker Strikes ${action.target}, Stock Prices Plummet 15%`,
        `${action.target} CEO Resigns After Devastating Cyber Attack`
      ],
      data_leak: [
        `Leaked Documents from ${action.target} Expose Corporate Corruption`,
        `Anonymous Hacker Dumps ${this.randomNumber(10, 500)}GB of ${action.target} Internal Files`,
        `${action.target} Faces Lawsuit After Massive Data Breach`,
        `Whistleblower or Criminal? ${action.target} Hacker Sparks Debate`
      ],
      government_hack: [
        `National Security Alert: ${action.target} Systems Breached`,
        `Cyber Warfare Suspected in ${action.target} Attack`,
        `Government Offers $1M Reward for Information on ${action.target} Hacker`,
        `${action.target} Breach Exposes Classified Information`
      ],
      corporate_espionage: [
        `${action.target} Accuses Rival of Hiring Hacker for Corporate Espionage`,
        `Trade Secrets Stolen: ${action.target} Loses Millions in Intellectual Property`,
        `${action.target} Stock Crashes After Hacker Reveals Secret Product Plans`
      ]
    }

    const actionType = this.determineActionType(action)
    const template = this.random(templates[actionType] || templates.data_leak)
    
    const headline = {
      id: `news_${Date.now()}`,
      headline: template.replace('${action.target}', action.target || this.random(this.companies)),
      type: actionType,
      timestamp: Date.now(),
      severity: this.calculateSeverity(action)
    }

    this.headlines.push(headline)
    return headline
  }

  generateArticle(headline, action, playerData) {
    const journalist = this.random(this.journalists)
    const timestamp = new Date().toLocaleString()

    return {
      id: headline.id,
      headline: headline.headline,
      author: journalist,
      timestamp,
      content: this.generateContent(headline, action, playerData),
      publicReaction: this.generatePublicReaction(headline, playerData),
      consequences: this.generateConsequences(headline, action),
      relatedStories: this.getRelatedStories(headline.type)
    }
  }

  generateContent(headline, action, playerData) {
    const intros = [
      `In a shocking development that has sent ripples through the cybersecurity community,`,
      `Breaking news tonight as authorities confirm that`,
      `In what experts are calling one of the most sophisticated attacks this year,`,
      `Security researchers have revealed that`
    ]

    const impacts = {
      hospital_hack: `Patient care has been disrupted, with some procedures postponed indefinitely. Medical staff are working with paper records as systems remain offline.`,
      bank_heist: `Thousands of customers report unauthorized transactions on their accounts. The bank has frozen all online services while investigating the breach.`,
      data_leak: `The leaked documents contain sensitive information including employee records, financial statements, and confidential communications.`,
      government_hack: `The breach has raised serious concerns about national security infrastructure and the vulnerability of government systems.`,
      corporate_espionage: `Competitors are scrambling to assess the damage as proprietary information floods underground forums.`
    }

    const quotes = [
      `"This is a wake-up call for the entire industry," said cybersecurity analyst ${this.random(this.journalists)}.`,
      `"We're dealing with a highly sophisticated threat actor," commented FBI spokesperson Jennifer Martinez.`,
      `"The scale of this breach is unprecedented," warned security expert Dr. James Wilson.`,
      `"This could have been prevented with proper security measures," criticized industry watchdog Sarah Kim.`
    ]

    return `
${this.random(intros)} ${headline.headline.toLowerCase()}.

${impacts[headline.type] || impacts.data_leak}

The breach, which occurred ${this.getTimeAgo(action.timestamp || Date.now())}, has raised serious questions about digital security infrastructure. Law enforcement agencies are working around the clock to identify the perpetrator.

${this.random(quotes)}

${playerData.reputation > 50 ? 'Some online communities have praised the hacker as a digital whistleblower, while others condemn the attack as criminal.' : 'Authorities have vowed to bring the perpetrator to justice.'}

The investigation is ongoing.
    `.trim()
  }

  generatePublicReaction(headline, playerData) {
    const reactions = [
      { sentiment: 'outrage', text: 'Public demands stronger cybersecurity laws', percentage: 45 },
      { sentiment: 'support', text: 'Some praise hacker as digital whistleblower', percentage: 25 },
      { sentiment: 'fear', text: 'Citizens worry about personal data safety', percentage: 60 },
      { sentiment: 'indifference', text: 'Many express fatigue over constant breaches', percentage: 15 }
    ]

    // Adjust based on player reputation
    if (playerData.reputation > 50) {
      reactions[1].percentage += 20 // More support
      reactions[0].percentage -= 10 // Less outrage
    }

    return reactions.sort((a, b) => b.percentage - a.percentage)
  }

  generateConsequences(headline, action) {
    const baseConsequences = [
      `Stock price drops ${this.randomNumber(10, 30)}%`,
      `CEO announces resignation effective immediately`,
      `Government launches investigation into security practices`,
      `Class action lawsuit filed by affected customers`
    ]

    const specificConsequences = {
      hospital_hack: [
        'Healthcare regulations tightened nationwide',
        'Hospital faces $10M+ in fines',
        'Patient trust at all-time low'
      ],
      bank_heist: [
        'Banking sector increases security budgets by 40%',
        'Federal Reserve launches emergency audit',
        'Customers withdraw millions in panic'
      ],
      government_hack: [
        'National cybersecurity budget doubled',
        'International incident sparks diplomatic tensions',
        'Military cyber defense units deployed'
      ]
    }

    const consequences = [
      ...baseConsequences.slice(0, 2),
      ...(specificConsequences[headline.type] || []).slice(0, 2)
    ]

    return consequences
  }

  getRelatedStories(type) {
    return [
      'Similar attacks reported in neighboring states',
      'Cybersecurity experts offer tips to protect yourself',
      'How hackers are evolving their tactics in 2024'
    ]
  }

  determineActionType(action) {
    if (action.target && action.target.toLowerCase().includes('hospital')) return 'hospital_hack'
    if (action.target && action.target.toLowerCase().includes('bank')) return 'bank_heist'
    if (action.target && action.target.toLowerCase().includes('gov')) return 'government_hack'
    if (action.type === 'corporate') return 'corporate_espionage'
    return 'data_leak'
  }

  calculateSeverity(action) {
    const visibility = action.visibility || 0
    const dataStolen = action.dataStolen || false
    const compromised = action.compromised || false

    if (visibility > 80 || dataStolen) return 'critical'
    if (visibility > 50 || compromised) return 'high'
    if (visibility > 30) return 'medium'
    return 'low'
  }

  getTimeAgo(timestamp) {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return 'moments ago'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  getRecentHeadlines(count = 5) {
    return this.headlines.slice(-count).reverse()
  }

  getHeadlinesByType(type) {
    return this.headlines.filter(h => h.type === type)
  }

  random(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  reset() {
    this.headlines = []
  }
}

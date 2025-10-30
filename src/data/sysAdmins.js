export const sysAdminTypes = {
  paranoid: {
    name: "Marcus Chen",
    avatar: "👨‍💻",
    checkInterval: 30000, // 30 seconds
    behavior: "Constantly monitors logs",
    weakness: "Panics under pressure, makes mistakes",
    schedule: {
      breaks: [],
      shiftEnd: null
    },
    chatResponses: {
      greeting: "Who is this? Identify yourself immediately!",
      suspicious: "I'm calling security RIGHT NOW!",
      tricked: "Wait... let me verify that first...",
      angry: "I KNEW something was wrong! Initiating lockdown!",
      success: "Alright, I'll help you with that."
    },
    socialEngineeringResistance: 0.9
  },
  
  lazy: {
    name: "Dave Johnson", 
    avatar: "😴",
    checkInterval: 300000, // 5 minutes
    behavior: "Minimal effort, often distracted",
    weakness: "Takes long breaks, ignores minor alerts",
    schedule: {
      breaks: [15, 45], // Minutes past hour
      breakDuration: 120000 // 2 minutes
    },
    chatResponses: {
      greeting: "Yeah, what do you need?",
      suspicious: "Ugh, not another issue...",
      tricked: "Sure, whatever you need buddy. Just let me finish my coffee.",
      angry: "Fine, I'll look into it... eventually.",
      success: "Yeah yeah, I'll take care of it."
    },
    socialEngineeringResistance: 0.3
  },
  
  expert: {
    name: "Dr. Sarah Kim",
    avatar: "👩‍🔬",
    checkInterval: 60000, // 1 minute
    behavior: "Professional and thorough",
    weakness: "Overconfident, ignores 'obvious' false positives",
    schedule: {
      breaks: [30],
      breakDuration: 60000
    },
    chatResponses: {
      greeting: "This is Dr. Kim. How can I help you?",
      suspicious: "I need to verify your credentials first.",
      tricked: "That does seem legitimate... I'll proceed with your request.",
      angry: "Interesting. Very interesting indeed. I'm documenting this.",
      success: "Understood. I'll handle that right away."
    },
    socialEngineeringResistance: 0.6
  }
}

export function getRandomSysAdmin() {
  const types = Object.values(sysAdminTypes)
  return types[Math.floor(Math.random() * types.length)]
}

export function getSysAdminByType(type) {
  return sysAdminTypes[type] || sysAdminTypes.lazy
}

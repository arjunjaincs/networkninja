// Procedural network generation for infinite replayability

import { NODE_TYPES } from '../data/networks'

const NODE_ICONS = {
  [NODE_TYPES.ROUTER]: '🌐',
  [NODE_TYPES.FIREWALL]: '🔥',
  [NODE_TYPES.SWITCH]: '🔀',
  [NODE_TYPES.WORKSTATION]: '🖥️',
  [NODE_TYPES.SERVER]: '🗄️',
  [NODE_TYPES.IDS]: '👁️',
  [NODE_TYPES.IPS]: '🛡️',
  [NODE_TYPES.DATABASE]: '💾',
}

const VULNERABILITIES = [
  'Weak Password',
  'Unpatched SMB',
  'Outdated Software',
  'Misconfigured Rules',
  'Default Credentials',
  'SQL Injection',
  'XSS Vulnerability',
  'Buffer Overflow',
  'Privilege Escalation',
  'Zero-Day Exploit',
  'Phishing Victim',
  'Weak Encryption',
  'Outdated Signatures',
  'Open Admin Panel',
  'Exposed API Keys',
]

const OS_TYPES = {
  [NODE_TYPES.ROUTER]: ['Cisco IOS 12.4', 'Cisco IOS 15.2', 'Juniper JunOS'],
  [NODE_TYPES.FIREWALL]: ['pfSense 2.5', 'Fortinet FortiGate', 'Palo Alto'],
  [NODE_TYPES.SWITCH]: ['Cisco Catalyst', 'HP ProCurve', 'Arista EOS'],
  [NODE_TYPES.WORKSTATION]: ['Windows 10', 'Windows 11', 'Ubuntu 22.04'],
  [NODE_TYPES.SERVER]: ['Windows Server 2019', 'Windows Server 2022', 'Linux Ubuntu 22.04', 'CentOS 8'],
  [NODE_TYPES.IDS]: ['Snort IDS', 'Suricata', 'Zeek'],
  [NODE_TYPES.IPS]: ['Snort IPS', 'Suricata IPS'],
  [NODE_TYPES.DATABASE]: ['MySQL 8.0', 'PostgreSQL 14', 'MongoDB 5.0', 'MSSQL 2019'],
}

const DATA_TYPES = [
  'Employee Database',
  'Financial Reports',
  'Customer Records',
  'Trade Secrets',
  'Source Code',
  'Email Archive',
  'Backup Files',
  'Credentials Database',
  'Payment Information',
  'Medical Records',
]

// Generate random network topology
export const generateProceduralNetwork = (difficulty = 'normal', seed = null) => {
  const random = seed ? seededRandom(seed) : Math.random
  
  const config = getDifficultyConfig(difficulty)
  const nodes = []
  const edges = []
  
  // Always start with entry point
  const entryNode = createNode(NODE_TYPES.WORKSTATION, 0, random, true)
  entryNode.compromised = true
  entryNode.discovered = true
  nodes.push(entryNode)
  
  // Add core infrastructure
  const router = createNode(NODE_TYPES.ROUTER, 1, random)
  router.x = 400
  router.y = 100
  nodes.push(router)
  
  const firewall = createNode(NODE_TYPES.FIREWALL, 2, random)
  firewall.x = 400
  firewall.y = 200
  nodes.push(firewall)
  edges.push({ from: router.id, to: firewall.id, bandwidth: 'high' })
  
  // Add switch if needed
  if (config.nodeCount > 5) {
    const switchNode = createNode(NODE_TYPES.SWITCH, 3, random)
    switchNode.x = 400
    switchNode.y = 300
    nodes.push(switchNode)
    edges.push({ from: firewall.id, to: switchNode.id, bandwidth: 'high' })
  }
  
  // Add IDS/IPS based on difficulty
  if (config.hasIDS) {
    const ids = createNode(NODE_TYPES.IDS, nodes.length, random)
    ids.x = 600
    ids.y = 200
    nodes.push(ids)
    edges.push({ from: firewall.id, to: ids.id, bandwidth: 'medium' })
  }
  
  // Add workstations
  const workstationCount = Math.floor(config.nodeCount * 0.4)
  for (let i = 0; i < workstationCount; i++) {
    const ws = createNode(NODE_TYPES.WORKSTATION, nodes.length, random)
    ws.x = 150 + (i * 150)
    ws.y = 400
    if (i === 0) {
      ws.discovered = true
      edges.push({ from: entryNode.id, to: ws.id, bandwidth: 'medium' })
    }
    nodes.push(ws)
    
    // Connect to switch or firewall
    const connectTo = nodes.find(n => n.type === NODE_TYPES.SWITCH) || firewall
    edges.push({ from: connectTo.id, to: ws.id, bandwidth: 'medium' })
  }
  
  // Add servers (including target)
  const serverCount = Math.floor(config.nodeCount * 0.3)
  for (let i = 0; i < serverCount; i++) {
    const server = createNode(NODE_TYPES.SERVER, nodes.length, random)
    server.x = 200 + (i * 200)
    server.y = 550
    
    // One server has the target data
    if (i === 0) {
      server.hasData = true
      server.dataType = DATA_TYPES[Math.floor(random() * DATA_TYPES.length)]
    }
    
    nodes.push(server)
    
    // Connect to random workstations
    const connectedWS = nodes.filter(n => n.type === NODE_TYPES.WORKSTATION)
      .sort(() => random() - 0.5)
      .slice(0, 2)
    
    connectedWS.forEach(ws => {
      edges.push({ from: ws.id, to: server.id, bandwidth: 'medium' })
    })
  }
  
  // Build connection lists
  nodes.forEach(node => {
    node.connections = edges
      .filter(e => e.from === node.id || e.to === node.id)
      .map(e => e.from === node.id ? e.to : e.from)
  })
  
  return {
    id: `procedural-${Date.now()}`,
    name: `Procedural Network (${difficulty})`,
    nodes,
    edges,
    seed: seed || Date.now(),
  }
}

// Create a single node
const createNode = (type, index, random, isEntry = false) => {
  const vulnCount = Math.floor(random() * 3) + 1
  const vulnerabilities = []
  for (let i = 0; i < vulnCount; i++) {
    const vuln = VULNERABILITIES[Math.floor(random() * VULNERABILITIES.length)]
    if (!vulnerabilities.includes(vuln)) {
      vulnerabilities.push(vuln)
    }
  }
  
  const osOptions = OS_TYPES[type] || ['Unknown OS']
  const os = osOptions[Math.floor(random() * osOptions.length)]
  
  const ports = generatePorts(type, random)
  
  return {
    id: `${type}-${index}`,
    type,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`,
    os,
    vulnerabilities,
    openPorts: ports,
    compromised: false,
    discovered: isEntry,
    hasData: false,
    x: Math.floor(random() * 600) + 100,
    y: Math.floor(random() * 400) + 200,
    icon: NODE_ICONS[type] || '📦',
    connections: [],
  }
}

// Generate realistic ports for node type
const generatePorts = (type, random) => {
  const commonPorts = {
    [NODE_TYPES.ROUTER]: [22, 23, 80, 443],
    [NODE_TYPES.FIREWALL]: [443, 8443],
    [NODE_TYPES.SWITCH]: [22, 23],
    [NODE_TYPES.WORKSTATION]: [445, 3389, 135, 139],
    [NODE_TYPES.SERVER]: [80, 443, 22, 445, 3389],
    [NODE_TYPES.IDS]: [443],
    [NODE_TYPES.IPS]: [443],
    [NODE_TYPES.DATABASE]: [3306, 5432, 1433, 27017],
  }
  
  const ports = commonPorts[type] || [80, 443]
  const count = Math.floor(random() * 3) + 2
  return ports.slice(0, count)
}

// Get difficulty configuration
const getDifficultyConfig = (difficulty) => {
  const configs = {
    easy: {
      nodeCount: 5,
      hasIDS: false,
      timeLimit: 3600,
      idsAggressiveness: 0,
    },
    normal: {
      nodeCount: 10,
      hasIDS: true,
      timeLimit: 1800,
      idsAggressiveness: 0.5,
    },
    hard: {
      nodeCount: 15,
      hasIDS: true,
      timeLimit: 1200,
      idsAggressiveness: 0.8,
    },
    expert: {
      nodeCount: 20,
      hasIDS: true,
      timeLimit: 600,
      idsAggressiveness: 1.0,
    },
  }
  
  return configs[difficulty] || configs.normal
}

// Seeded random for reproducible networks
const seededRandom = (seed) => {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

// Generate daily challenge seed
export const getDailySeed = () => {
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  return hashCode(dateString)
}

// Simple hash function for seeds
const hashCode = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Generate challenge modifiers
export const CHALLENGE_MODIFIERS = {
  NO_STEALTH: {
    id: 'no_stealth',
    name: 'No Stealth Actions',
    description: 'Stealth actions are disabled. Complete without clearing logs.',
    icon: '🚫',
    scoreMultiplier: 1.5,
    disabledCategories: ['stealth'],
  },
  TIME_ATTACK: {
    id: 'time_attack',
    name: 'Time Attack',
    description: 'Complete the mission in 5 minutes or less.',
    icon: '⏱️',
    scoreMultiplier: 2.0,
    timeLimit: 300,
  },
  BLIND_MODE: {
    id: 'blind_mode',
    name: 'Blind Network',
    description: 'Network map is hidden. Navigate by memory.',
    icon: '🕶️',
    scoreMultiplier: 2.5,
    hideMap: true,
  },
  LOUD_ONLY: {
    id: 'loud_only',
    name: 'Loud & Proud',
    description: 'Only loud actions allowed. Brute force everything.',
    icon: '💥',
    scoreMultiplier: 1.8,
    allowedNoiseLevel: 'loud',
  },
  PERFECT_STEALTH: {
    id: 'perfect_stealth',
    name: 'Ghost Protocol',
    description: 'Stay below 20% visibility at all times.',
    icon: '👻',
    scoreMultiplier: 3.0,
    maxVisibility: 20,
  },
  ONE_SHOT: {
    id: 'one_shot',
    name: 'One Shot',
    description: 'All exploits have 100% success but only one attempt per node.',
    icon: '🎯',
    scoreMultiplier: 2.2,
    oneAttemptPerNode: true,
  },
}

// Get random challenge modifier
export const getRandomModifier = () => {
  const modifiers = Object.values(CHALLENGE_MODIFIERS)
  return modifiers[Math.floor(Math.random() * modifiers.length)]
}

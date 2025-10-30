// Network topology definitions for each level

export const NODE_TYPES = {
  ROUTER: 'router',
  FIREWALL: 'firewall',
  SWITCH: 'switch',
  WORKSTATION: 'workstation',
  SERVER: 'server',
  IDS: 'ids',
  IPS: 'ips',
  DATABASE: 'database',
}

// Level 1: Small Office Network
export const level1Network = {
  id: 'level1',
  name: 'Small Office Network',
  nodes: [
    {
      id: 'router-1',
      type: NODE_TYPES.ROUTER,
      name: 'Main Router',
      os: 'Cisco IOS 12.4',
      vulnerabilities: ['CVE-2023-1234', 'Weak Password'],
      openPorts: [22, 80, 443],
      compromised: false,
      discovered: true,
      hasData: false,
      x: 400,
      y: 100,
      icon: '🌐',
      connections: ['firewall-1'],
    },
    {
      id: 'firewall-1',
      type: NODE_TYPES.FIREWALL,
      name: 'Edge Firewall',
      os: 'pfSense 2.5',
      vulnerabilities: ['Misconfigured Rules'],
      openPorts: [443],
      compromised: false,
      discovered: true,
      hasData: false,
      x: 400,
      y: 250,
      icon: '🔥',
      connections: ['router-1', 'workstation-1', 'workstation-2'],
    },
    {
      id: 'workstation-1',
      type: NODE_TYPES.WORKSTATION,
      name: 'Employee PC #1',
      os: 'Windows 10',
      vulnerabilities: ['Unpatched SMB', 'Weak Password'],
      openPorts: [445, 3389],
      compromised: true, // Starting point
      discovered: true,
      hasData: false,
      x: 250,
      y: 400,
      icon: '🖥️',
      connections: ['firewall-1', 'file-server-1'],
    },
    {
      id: 'workstation-2',
      type: NODE_TYPES.WORKSTATION,
      name: 'Employee PC #2',
      os: 'Windows 10',
      vulnerabilities: ['Outdated Software'],
      openPorts: [445, 3389],
      compromised: false,
      discovered: false,
      hasData: false,
      x: 550,
      y: 400,
      icon: '🖥️',
      connections: ['firewall-1', 'file-server-1'],
    },
    {
      id: 'file-server-1',
      type: NODE_TYPES.SERVER,
      name: 'File Server',
      os: 'Windows Server 2019',
      vulnerabilities: ['Weak Admin Password'],
      openPorts: [445, 139],
      compromised: false,
      discovered: false,
      hasData: true, // TARGET DATA HERE
      dataType: 'Employee Database',
      x: 400,
      y: 550,
      icon: '🗄️',
      connections: ['workstation-1', 'workstation-2'],
    },
  ],
  edges: [
    { from: 'router-1', to: 'firewall-1', bandwidth: 'high' },
    { from: 'firewall-1', to: 'workstation-1', bandwidth: 'medium' },
    { from: 'firewall-1', to: 'workstation-2', bandwidth: 'medium' },
    { from: 'workstation-1', to: 'file-server-1', bandwidth: 'medium' },
    { from: 'workstation-2', to: 'file-server-1', bandwidth: 'medium' },
  ],
}

// Level 2: Corporate Network (more complex)
export const level2Network = {
  id: 'level2',
  name: 'Corporate Network',
  nodes: [
    {
      id: 'router-1',
      type: NODE_TYPES.ROUTER,
      name: 'Border Router',
      os: 'Cisco IOS 15.2',
      vulnerabilities: ['CVE-2023-5678'],
      openPorts: [22, 80, 443],
      compromised: false,
      discovered: true,
      hasData: false,
      x: 400,
      y: 50,
      icon: '🌐',
      connections: ['firewall-1'],
    },
    {
      id: 'firewall-1',
      type: NODE_TYPES.FIREWALL,
      name: 'Corporate Firewall',
      os: 'Fortinet FortiGate',
      vulnerabilities: ['Default Config'],
      openPorts: [443, 8443],
      compromised: false,
      discovered: true,
      hasData: false,
      x: 400,
      y: 150,
      icon: '🔥',
      connections: ['router-1', 'switch-1', 'ids-1'],
    },
    {
      id: 'ids-1',
      type: NODE_TYPES.IDS,
      name: 'Intrusion Detection',
      os: 'Snort IDS',
      vulnerabilities: ['Outdated Signatures'],
      openPorts: [443],
      compromised: false,
      discovered: false,
      hasData: false,
      x: 600,
      y: 150,
      icon: '👁️',
      connections: ['firewall-1'],
    },
    {
      id: 'switch-1',
      type: NODE_TYPES.SWITCH,
      name: 'Core Switch',
      os: 'Cisco Catalyst',
      vulnerabilities: [],
      openPorts: [22],
      compromised: false,
      discovered: true,
      hasData: false,
      x: 400,
      y: 280,
      icon: '🔀',
      connections: ['firewall-1', 'workstation-1', 'workstation-2', 'workstation-3', 'workstation-4'],
    },
    {
      id: 'workstation-1',
      type: NODE_TYPES.WORKSTATION,
      name: 'Finance PC',
      os: 'Windows 11',
      vulnerabilities: ['Phishing Victim'],
      openPorts: [445, 3389],
      compromised: true, // Starting point
      discovered: true,
      hasData: false,
      x: 150,
      y: 400,
      icon: '🖥️',
      connections: ['switch-1', 'finance-server-1'],
    },
    {
      id: 'workstation-2',
      type: NODE_TYPES.WORKSTATION,
      name: 'HR PC',
      os: 'Windows 11',
      vulnerabilities: [],
      openPorts: [445, 3389],
      compromised: false,
      discovered: false,
      hasData: false,
      x: 300,
      y: 400,
      icon: '🖥️',
      connections: ['switch-1'],
    },
    {
      id: 'workstation-3',
      type: NODE_TYPES.WORKSTATION,
      name: 'IT Admin PC',
      os: 'Windows 11',
      vulnerabilities: ['Elevated Privileges'],
      openPorts: [445, 3389, 5985],
      compromised: false,
      discovered: false,
      hasData: false,
      x: 500,
      y: 400,
      icon: '🖥️',
      connections: ['switch-1', 'finance-server-1', 'app-server-1'],
    },
    {
      id: 'workstation-4',
      type: NODE_TYPES.WORKSTATION,
      name: 'Marketing PC',
      os: 'Windows 11',
      vulnerabilities: [],
      openPorts: [445, 3389],
      compromised: false,
      discovered: false,
      hasData: false,
      x: 650,
      y: 400,
      icon: '🖥️',
      connections: ['switch-1'],
    },
    {
      id: 'finance-server-1',
      type: NODE_TYPES.SERVER,
      name: 'Finance Server',
      os: 'Windows Server 2022',
      vulnerabilities: ['Weak Encryption'],
      openPorts: [445, 1433],
      compromised: false,
      discovered: false,
      hasData: true, // TARGET DATA HERE
      dataType: 'Financial Reports',
      x: 250,
      y: 550,
      icon: '💰',
      connections: ['workstation-1', 'workstation-3'],
    },
    {
      id: 'app-server-1',
      type: NODE_TYPES.SERVER,
      name: 'Application Server',
      os: 'Linux Ubuntu 22.04',
      vulnerabilities: ['Unpatched Apache'],
      openPorts: [80, 443, 22],
      compromised: false,
      discovered: false,
      hasData: false,
      x: 550,
      y: 550,
      icon: '🗄️',
      connections: ['workstation-3'],
    },
  ],
  edges: [
    { from: 'router-1', to: 'firewall-1', bandwidth: 'high' },
    { from: 'firewall-1', to: 'switch-1', bandwidth: 'high' },
    { from: 'firewall-1', to: 'ids-1', bandwidth: 'medium' },
    { from: 'switch-1', to: 'workstation-1', bandwidth: 'medium' },
    { from: 'switch-1', to: 'workstation-2', bandwidth: 'medium' },
    { from: 'switch-1', to: 'workstation-3', bandwidth: 'medium' },
    { from: 'switch-1', to: 'workstation-4', bandwidth: 'medium' },
    { from: 'workstation-1', to: 'finance-server-1', bandwidth: 'medium' },
    { from: 'workstation-3', to: 'finance-server-1', bandwidth: 'medium' },
    { from: 'workstation-3', to: 'app-server-1', bandwidth: 'medium' },
  ],
}

// Helper function to get network by level
export const getNetworkByLevel = (level) => {
  switch (level) {
    case 1:
      return level1Network
    case 2:
      return level2Network
    default:
      return level1Network
  }
}

// Helper function to find node by ID
export const findNode = (network, nodeId) => {
  return network.nodes.find(node => node.id === nodeId)
}

// Helper function to get connected nodes
export const getConnectedNodes = (network, nodeId) => {
  const node = findNode(network, nodeId)
  if (!node) return []
  
  return node.connections
    .map(connId => findNode(network, connId))
    .filter(Boolean)
}

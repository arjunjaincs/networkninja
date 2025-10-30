// Network Packet System with A* Pathfinding and Routing

export class NetworkPacket {
  constructor(id, source, destination, type, data = {}) {
    this.id = id
    this.source = source
    this.destination = destination
    this.type = type // 'normal', 'hacker', 'bot', 'security'
    this.data = data
    this.path = []
    this.currentPathIndex = 0
    this.position = { x: 0, y: 0 }
    this.velocity = { x: 0, y: 0 }
    this.speed = this.getSpeedByType()
    this.latency = Math.random() * 50 + 10 // 10-60ms
    this.dropped = false
    this.encrypted = data.encrypted || false
    this.size = data.size || Math.random() * 100 + 50 // bytes
  }

  getSpeedByType() {
    const speeds = {
      'normal': 2,
      'hacker': 1.5, // Slower, more stealthy
      'bot': 3, // Fast automated scans
      'security': 2.5 // IDS sweeps
    }
    return speeds[this.type] || 2
  }

  getColor() {
    const colors = {
      'normal': '#10b981', // Green
      'hacker': '#ef4444', // Red
      'bot': '#eab308', // Yellow
      'security': '#f97316' // Orange
    }
    return colors[this.type] || '#10b981'
  }

  // A* Pathfinding Algorithm
  findPath(network) {
    const nodes = network.nodes
    const sourceNode = nodes.find(n => n.id === this.source)
    const destNode = nodes.find(n => n.id === this.destination)

    if (!sourceNode || !destNode) {
      this.dropped = true
      return []
    }

    // Initialize
    const openSet = [sourceNode]
    const closedSet = []
    const cameFrom = new Map()
    const gScore = new Map()
    const fScore = new Map()

    nodes.forEach(node => {
      gScore.set(node.id, Infinity)
      fScore.set(node.id, Infinity)
    })

    gScore.set(sourceNode.id, 0)
    fScore.set(sourceNode.id, this.heuristic(sourceNode, destNode))

    while (openSet.length > 0) {
      // Get node with lowest fScore
      let current = openSet[0]
      let currentIndex = 0
      for (let i = 1; i < openSet.length; i++) {
        if (fScore.get(openSet[i].id) < fScore.get(current.id)) {
          current = openSet[i]
          currentIndex = i
        }
      }

      // Reached destination
      if (current.id === destNode.id) {
        return this.reconstructPath(cameFrom, current)
      }

      openSet.splice(currentIndex, 1)
      closedSet.push(current)

      // Check neighbors
      const neighbors = this.getNeighbors(current, nodes)
      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) continue

        const tentativeGScore = gScore.get(current.id) + this.distance(current, neighbor)

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor)
        } else if (tentativeGScore >= gScore.get(neighbor.id)) {
          continue
        }

        cameFrom.set(neighbor.id, current)
        gScore.set(neighbor.id, tentativeGScore)
        fScore.set(neighbor.id, gScore.get(neighbor.id) + this.heuristic(neighbor, destNode))
      }
    }

    // No path found
    this.dropped = true
    return []
  }

  heuristic(nodeA, nodeB) {
    // Euclidean distance
    const dx = nodeA.x - nodeB.x
    const dy = nodeA.y - nodeB.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  distance(nodeA, nodeB) {
    return this.heuristic(nodeA, nodeB)
  }

  getNeighbors(node, allNodes) {
    if (!node.connections) return []
    return node.connections
      .map(connId => allNodes.find(n => n.id === connId))
      .filter(Boolean)
  }

  reconstructPath(cameFrom, current) {
    const path = [current]
    while (cameFrom.has(current.id)) {
      current = cameFrom.get(current.id)
      path.unshift(current)
    }
    return path
  }

  // Update packet position
  update(deltaTime) {
    if (this.dropped || this.currentPathIndex >= this.path.length) {
      return false // Packet completed or dropped
    }

    const targetNode = this.path[this.currentPathIndex]
    const dx = targetNode.x - this.position.x
    const dy = targetNode.y - this.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < 5) {
      // Reached waypoint
      this.currentPathIndex++
      if (this.currentPathIndex >= this.path.length) {
        return false // Reached destination
      }
    } else {
      // Move towards target
      this.velocity.x = (dx / distance) * this.speed
      this.velocity.y = (dy / distance) * this.speed
      this.position.x += this.velocity.x * deltaTime
      this.position.y += this.velocity.y * deltaTime
    }

    // Simulate packet loss (1% chance)
    if (Math.random() < 0.01) {
      this.dropped = true
      return false
    }

    return true // Still traveling
  }

  // Initialize position at source
  initializePosition(network) {
    const sourceNode = network.nodes.find(n => n.id === this.source)
    if (sourceNode) {
      this.position = { x: sourceNode.x, y: sourceNode.y }
    }
  }
}

// Packet Manager
export class PacketManager {
  constructor() {
    this.packets = []
    this.nextId = 0
    this.trafficLevel = 'normal' // low, normal, high
  }

  createPacket(source, destination, type, data = {}) {
    const packet = new NetworkPacket(
      `packet_${this.nextId++}`,
      source,
      destination,
      type,
      data
    )
    this.packets.push(packet)
    return packet
  }

  generateTraffic(network) {
    // Generate normal employee traffic
    if (Math.random() < 0.3) {
      const nodes = network.nodes.filter(n => n.type === 'workstation')
      if (nodes.length >= 2) {
        const source = nodes[Math.floor(Math.random() * nodes.length)]
        const dest = nodes[Math.floor(Math.random() * nodes.length)]
        if (source.id !== dest.id) {
          const packet = this.createPacket(source.id, dest.id, 'normal', {
            encrypted: false,
            size: Math.random() * 1000 + 100
          })
          packet.path = packet.findPath(network)
          packet.initializePosition(network)
        }
      }
    }

    // Generate bot scans
    if (Math.random() < 0.1) {
      const nodes = network.nodes
      if (nodes.length >= 2) {
        const source = nodes[Math.floor(Math.random() * nodes.length)]
        const dest = nodes[Math.floor(Math.random() * nodes.length)]
        if (source.id !== dest.id) {
          const packet = this.createPacket(source.id, dest.id, 'bot', {
            encrypted: false,
            size: 64
          })
          packet.path = packet.findPath(network)
          packet.initializePosition(network)
        }
      }
    }

    // Generate security sweeps
    if (Math.random() < 0.15) {
      const nodes = network.nodes
      const idsNodes = nodes.filter(n => n.type === 'ids' || n.type === 'firewall')
      if (idsNodes.length > 0 && nodes.length > 1) {
        const source = idsNodes[Math.floor(Math.random() * idsNodes.length)]
        const dest = nodes[Math.floor(Math.random() * nodes.length)]
        if (source.id !== dest.id) {
          const packet = this.createPacket(source.id, dest.id, 'security', {
            encrypted: true,
            size: 256
          })
          packet.path = packet.findPath(network)
          packet.initializePosition(network)
        }
      }
    }
  }

  update(deltaTime, network) {
    // Update all packets
    this.packets = this.packets.filter(packet => packet.update(deltaTime))

    // Generate new traffic
    this.generateTraffic(network)

    // Limit packet count for performance
    if (this.packets.length > 100) {
      this.packets = this.packets.slice(-100)
    }
  }

  getActivePackets() {
    return this.packets.filter(p => !p.dropped)
  }

  getTrafficDensity() {
    return this.packets.length
  }

  // Calculate visibility reduction based on traffic
  getStealthBonus() {
    const density = this.getTrafficDensity()
    if (density > 50) return -20 // High traffic = -20% visibility
    if (density > 30) return -10 // Medium traffic = -10% visibility
    return 0
  }

  reset() {
    this.packets = []
    this.nextId = 0
  }
}

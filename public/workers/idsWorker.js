/**
 * IDS Worker - Offload detection calculations to prevent UI blocking
 * Runs in separate thread for better performance
 */

// Detection algorithm
function calculateDetectionRisk(state) {
  const {
    visibility,
    noiseLevel,
    compromisedNodes,
    timeElapsed,
    activeModifier,
  } = state

  // Base detection chance
  let detectionChance = visibility * 0.01

  // Noise level increases detection
  detectionChance += noiseLevel * 0.005

  // More compromised nodes = higher risk
  detectionChance += compromisedNodes.length * 0.02

  // Time pressure (longer you're in, higher the risk)
  detectionChance += (timeElapsed / 600) * 0.1

  // Modifier effects
  if (activeModifier) {
    detectionChance *= activeModifier.detectionMultiplier || 1.0
  }

  // Cap at 95%
  detectionChance = Math.min(0.95, detectionChance)

  return {
    detectionChance,
    riskLevel: getRiskLevel(detectionChance),
    shouldTriggerAlert: Math.random() < detectionChance,
  }
}

function getRiskLevel(chance) {
  if (chance < 0.3) return 'low'
  if (chance < 0.6) return 'medium'
  if (chance < 0.8) return 'high'
  return 'critical'
}

// Pathfinding algorithm (A*)
function findPath(network, startNode, endNode) {
  const nodes = network.nodes
  const edges = network.edges

  // Build adjacency list
  const adjacency = {}
  nodes.forEach(node => {
    adjacency[node.id] = []
  })
  edges.forEach(edge => {
    adjacency[edge.from].push(edge.to)
    adjacency[edge.to].push(edge.from)
  })

  // A* implementation
  const openSet = [startNode]
  const cameFrom = {}
  const gScore = { [startNode]: 0 }
  const fScore = { [startNode]: heuristic(startNode, endNode, nodes) }

  while (openSet.length > 0) {
    // Get node with lowest fScore
    let current = openSet[0]
    let lowestF = fScore[current]
    
    for (const node of openSet) {
      if (fScore[node] < lowestF) {
        current = node
        lowestF = fScore[node]
      }
    }

    if (current === endNode) {
      return reconstructPath(cameFrom, current)
    }

    openSet.splice(openSet.indexOf(current), 1)

    // Check neighbors
    const neighbors = adjacency[current] || []
    for (const neighbor of neighbors) {
      const tentativeGScore = gScore[current] + 1

      if (tentativeGScore < (gScore[neighbor] || Infinity)) {
        cameFrom[neighbor] = current
        gScore[neighbor] = tentativeGScore
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, endNode, nodes)

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor)
        }
      }
    }
  }

  return null // No path found
}

function heuristic(nodeA, nodeB, nodes) {
  const a = nodes.find(n => n.id === nodeA)
  const b = nodes.find(n => n.id === nodeB)
  
  if (!a || !b) return Infinity
  
  // Euclidean distance
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

function reconstructPath(cameFrom, current) {
  const path = [current]
  while (cameFrom[current]) {
    current = cameFrom[current]
    path.unshift(current)
  }
  return path
}

// Network analysis
function analyzeNetwork(network) {
  const { nodes, edges } = network

  // Calculate network metrics
  const metrics = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    avgDegree: (edges.length * 2) / nodes.length,
    vulnerabilityCount: nodes.reduce((sum, node) => 
      sum + (node.vulnerabilities?.length || 0), 0
    ),
    criticalNodes: nodes.filter(node => 
      node.hasData || node.type === 'database'
    ).length,
  }

  // Find central nodes (high connectivity)
  const nodeDegrees = {}
  nodes.forEach(node => {
    nodeDegrees[node.id] = edges.filter(e => 
      e.from === node.id || e.to === node.id
    ).length
  })

  metrics.centralNodes = Object.entries(nodeDegrees)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id)

  return metrics
}

// Message handler
self.onmessage = function(e) {
  const { type, data, id } = e.data

  let result

  switch (type) {
    case 'calculateDetection':
      result = calculateDetectionRisk(data)
      break

    case 'findPath':
      result = findPath(data.network, data.startNode, data.endNode)
      break

    case 'analyzeNetwork':
      result = analyzeNetwork(data.network)
      break

    default:
      result = { error: 'Unknown operation' }
  }

  // Send result back
  self.postMessage({ type, result, id })
}

// Ready signal
self.postMessage({ type: 'ready' })

/**
 * Worker Manager - Manage Web Workers for async operations
 * Offloads heavy calculations to prevent UI blocking
 */

export class WorkerManager {
  constructor() {
    this.workers = {}
    this.messageId = 0
    this.pendingMessages = new Map()
  }

  /**
   * Initialize a worker
   * @param {string} name - Worker name
   * @param {string} scriptPath - Path to worker script
   */
  initWorker(name, scriptPath) {
    if (this.workers[name]) {
      console.warn(`Worker ${name} already initialized`)
      return
    }

    try {
      const worker = new Worker(scriptPath)
      
      worker.onmessage = (e) => {
        this.handleMessage(name, e.data)
      }

      worker.onerror = (error) => {
        console.error(`Worker ${name} error:`, error)
      }

      this.workers[name] = worker
    } catch (error) {
      console.error(`Failed to initialize worker ${name}:`, error)
    }
  }

  /**
   * Send message to worker
   * @param {string} workerName - Worker to send to
   * @param {string} type - Message type
   * @param {*} data - Message data
   * @returns {Promise} Resolves with worker response
   */
  sendMessage(workerName, type, data) {
    return new Promise((resolve, reject) => {
      const worker = this.workers[workerName]
      
      if (!worker) {
        reject(new Error(`Worker ${workerName} not found`))
        return
      }

      const id = this.messageId++
      
      // Store promise callbacks
      this.pendingMessages.set(id, { resolve, reject })

      // Send message
      worker.postMessage({ type, data, id })

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingMessages.has(id)) {
          this.pendingMessages.delete(id)
          reject(new Error('Worker timeout'))
        }
      }, 5000)
    })
  }

  /**
   * Handle worker response
   * @param {string} workerName - Worker that sent message
   * @param {*} message - Message data
   */
  handleMessage(workerName, message) {
    const { type, result, id } = message

    // Handle ready signal
    if (type === 'ready') {
      console.log(`Worker ${workerName} ready`)
      return
    }

    // Resolve pending promise
    if (id !== undefined && this.pendingMessages.has(id)) {
      const { resolve } = this.pendingMessages.get(id)
      this.pendingMessages.delete(id)
      resolve(result)
    }
  }

  /**
   * Terminate a worker
   * @param {string} name - Worker name
   */
  terminateWorker(name) {
    const worker = this.workers[name]
    if (worker) {
      worker.terminate()
      delete this.workers[name]
    }
  }

  /**
   * Terminate all workers
   */
  terminateAll() {
    Object.keys(this.workers).forEach(name => {
      this.terminateWorker(name)
    })
  }

  /**
   * Check if worker is available
   * @param {string} name - Worker name
   * @returns {boolean}
   */
  hasWorker(name) {
    return !!this.workers[name]
  }
}

/**
 * IDS Worker Helper - Specific helper for IDS calculations
 */
export class IDSWorkerHelper {
  constructor(workerManager) {
    this.workerManager = workerManager
    this.workerName = 'idsWorker'
    
    // Initialize worker
    this.workerManager.initWorker(this.workerName, '/workers/idsWorker.js')
  }

  async calculateDetection(gameState) {
    try {
      return await this.workerManager.sendMessage(
        this.workerName,
        'calculateDetection',
        gameState
      )
    } catch (error) {
      console.error('IDS calculation failed:', error)
      // Fallback to sync calculation
      return this.fallbackCalculation(gameState)
    }
  }

  async findPath(network, startNode, endNode) {
    try {
      return await this.workerManager.sendMessage(
        this.workerName,
        'findPath',
        { network, startNode, endNode }
      )
    } catch (error) {
      console.error('Pathfinding failed:', error)
      return null
    }
  }

  async analyzeNetwork(network) {
    try {
      return await this.workerManager.sendMessage(
        this.workerName,
        'analyzeNetwork',
        { network }
      )
    } catch (error) {
      console.error('Network analysis failed:', error)
      return null
    }
  }

  fallbackCalculation(gameState) {
    // Simple fallback if worker fails
    const { visibility } = gameState
    return {
      detectionChance: visibility * 0.01,
      riskLevel: visibility < 30 ? 'low' : visibility < 60 ? 'medium' : 'high',
      shouldTriggerAlert: Math.random() < (visibility * 0.01),
    }
  }
}

export default WorkerManager

/**
 * Level Loader - Load levels from JSON (local or CDN)
 * Enables data-driven levels and community maps
 */

export class LevelLoader {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/levels',
      cache: config.cache !== false,
      ...config,
    }
    this.levelCache = new Map()
  }

  /**
   * Load a level by ID
   * @param {string} levelId - Level identifier
   * @param {boolean} forceRefresh - Skip cache
   * @returns {Promise<Object>} Level data
   */
  async loadLevel(levelId, forceRefresh = false) {
    // Check cache
    if (!forceRefresh && this.config.cache && this.levelCache.has(levelId)) {
      return this.levelCache.get(levelId)
    }

    try {
      const url = `${this.config.baseUrl}/${levelId}.json`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to load level: ${response.statusText}`)
      }

      const levelData = await response.json()
      
      // Validate level data
      this.validateLevel(levelData)
      
      // Cache it
      if (this.config.cache) {
        this.levelCache.set(levelId, levelData)
      }

      return levelData
    } catch (error) {
      console.error(`Error loading level ${levelId}:`, error)
      throw error
    }
  }

  /**
   * Load multiple levels
   * @param {string[]} levelIds - Array of level IDs
   * @returns {Promise<Object[]>} Array of level data
   */
  async loadLevels(levelIds) {
    return Promise.all(levelIds.map(id => this.loadLevel(id)))
  }

  /**
   * Load level manifest (list of available levels)
   * @returns {Promise<Object>} Manifest data
   */
  async loadManifest() {
    try {
      const url = `${this.config.baseUrl}/manifest.json`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error loading manifest:', error)
      // Return empty manifest if not found
      return { levels: [], version: '1.0' }
    }
  }

  /**
   * Validate level structure
   * @param {Object} levelData - Level data to validate
   * @throws {Error} If validation fails
   */
  validateLevel(levelData) {
    const required = ['id', 'name', 'network', 'objectives']
    
    for (const field of required) {
      if (!levelData[field]) {
        throw new Error(`Invalid level: missing required field '${field}'`)
      }
    }

    // Validate network structure
    if (!levelData.network.nodes || !Array.isArray(levelData.network.nodes)) {
      throw new Error('Invalid level: network must have nodes array')
    }

    if (levelData.network.nodes.length === 0) {
      throw new Error('Invalid level: network must have at least one node')
    }

    // Validate objectives
    if (!levelData.objectives.primary) {
      throw new Error('Invalid level: must have primary objective')
    }

    return true
  }

  /**
   * Convert level data to game state format
   * @param {Object} levelData - Raw level data
   * @returns {Object} Formatted level data for game state
   */
  formatLevelForGame(levelData) {
    return {
      id: levelData.id,
      name: levelData.name,
      difficulty: levelData.difficulty || 'normal',
      timeLimit: levelData.timeLimit || 600,
      description: levelData.description || '',
      briefing: levelData.briefing || {},
      objectives: levelData.objectives,
      startingNode: levelData.network.nodes.find(n => n.discovered)?.id || levelData.network.nodes[0].id,
      debrief: levelData.debrief || {},
      metadata: levelData.metadata || {},
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.levelCache.clear()
  }

  /**
   * Preload levels for faster access
   * @param {string[]} levelIds - Levels to preload
   */
  async preloadLevels(levelIds) {
    const promises = levelIds.map(id => 
      this.loadLevel(id).catch(err => {
        console.warn(`Failed to preload level ${id}:`, err)
        return null
      })
    )
    
    await Promise.all(promises)
  }
}

/**
 * Community Level Loader - Load user-created levels
 */
export class CommunityLevelLoader extends LevelLoader {
  constructor(config = {}) {
    super({
      baseUrl: config.baseUrl || '/community-levels',
      ...config,
    })
  }

  /**
   * Submit a community level
   * @param {Object} levelData - Level to submit
   * @returns {Promise<Object>} Submission result
   */
  async submitLevel(levelData) {
    // Validate before submission
    this.validateLevel(levelData)
    
    // In a real implementation, this would POST to a backend
    console.log('Community level submitted:', levelData.id)
    
    return {
      success: true,
      levelId: levelData.id,
      message: 'Level submitted for review',
    }
  }

  /**
   * Rate a community level
   * @param {string} levelId - Level to rate
   * @param {number} rating - Rating (1-5)
   */
  async rateLevel(levelId, rating) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    // In a real implementation, this would POST to a backend
    console.log(`Rated level ${levelId}: ${rating} stars`)
    
    return { success: true }
  }
}

export default LevelLoader

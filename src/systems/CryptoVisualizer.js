// Crypto Visualizer - Visualize encryption algorithms in real-time

export class CryptoVisualizer {
  constructor() {
    this.activeAnimations = []
  }

  // Visualize AES Encryption Steps
  visualizeAES(data, key) {
    const steps = [
      { name: 'Key Expansion', duration: 500, color: '#3b82f6' },
      { name: 'Initial Round', duration: 300, color: '#8b5cf6' },
      { name: 'SubBytes', duration: 400, color: '#ec4899' },
      { name: 'ShiftRows', duration: 400, color: '#f59e0b' },
      { name: 'MixColumns', duration: 400, color: '#10b981' },
      { name: 'AddRoundKey', duration: 400, color: '#06b6d4' },
      { name: 'Final Round', duration: 300, color: '#8b5cf6' },
      { name: 'Encrypted', duration: 500, color: '#22c55e' }
    ]

    return {
      type: 'aes',
      steps,
      totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
      data: this.generateAESVisualization(data)
    }
  }

  generateAESVisualization(data) {
    // Generate visual representation of AES encryption
    const blocks = []
    const blockSize = 16 // AES block size

    for (let i = 0; i < data.length; i += blockSize) {
      const block = data.slice(i, i + blockSize)
      blocks.push({
        original: block,
        encrypted: this.mockEncrypt(block),
        state: 'encrypting'
      })
    }

    return blocks
  }

  mockEncrypt(block) {
    // Mock encryption for visualization
    return block.split('').map(char => 
      String.fromCharCode((char.charCodeAt(0) + 13) % 256)
    ).join('')
  }

  // Visualize RSA Key Exchange
  visualizeRSA() {
    const steps = [
      { name: 'Generate Prime Numbers', duration: 800, color: '#3b82f6', desc: 'p = 61, q = 53' },
      { name: 'Calculate n = p × q', duration: 500, color: '#8b5cf6', desc: 'n = 3233' },
      { name: 'Calculate φ(n)', duration: 500, color: '#ec4899', desc: 'φ(n) = 3120' },
      { name: 'Choose Public Exponent', duration: 400, color: '#f59e0b', desc: 'e = 17' },
      { name: 'Calculate Private Key', duration: 600, color: '#10b981', desc: 'd = 2753' },
      { name: 'Public Key Ready', duration: 400, color: '#06b6d4', desc: '(e, n) = (17, 3233)' },
      { name: 'Private Key Ready', duration: 400, color: '#22c55e', desc: '(d, n) = (2753, 3233)' }
    ]

    return {
      type: 'rsa',
      steps,
      totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
      publicKey: { e: 17, n: 3233 },
      privateKey: { d: 2753, n: 3233 }
    }
  }

  // Visualize Diffie-Hellman Key Exchange
  visualizeDiffieHellman() {
    const steps = [
      { name: 'Agree on Parameters', duration: 500, color: '#3b82f6', desc: 'p = 23, g = 5' },
      { name: 'Alice: Choose Secret', duration: 600, color: '#ec4899', desc: 'a = 6 (secret)' },
      { name: 'Bob: Choose Secret', duration: 600, color: '#8b5cf6', desc: 'b = 15 (secret)' },
      { name: 'Alice: Calculate Public', duration: 700, color: '#f59e0b', desc: 'A = g^a mod p = 8' },
      { name: 'Bob: Calculate Public', duration: 700, color: '#10b981', desc: 'B = g^b mod p = 19' },
      { name: 'Exchange Public Keys', duration: 500, color: '#06b6d4', desc: 'A ↔ B' },
      { name: 'Alice: Calculate Shared', duration: 800, color: '#ec4899', desc: 's = B^a mod p = 2' },
      { name: 'Bob: Calculate Shared', duration: 800, color: '#8b5cf6', desc: 's = A^b mod p = 2' },
      { name: 'Shared Secret Established', duration: 500, color: '#22c55e', desc: 'Shared Key = 2' }
    ]

    return {
      type: 'diffie-hellman',
      steps,
      totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
      sharedSecret: 2
    }
  }

  // Visualize Hash Function
  visualizeHash(data) {
    const steps = [
      { name: 'Padding', duration: 300, color: '#3b82f6' },
      { name: 'Initialize Hash Values', duration: 400, color: '#8b5cf6' },
      { name: 'Process Blocks', duration: 800, color: '#ec4899' },
      { name: 'Compression Function', duration: 600, color: '#f59e0b' },
      { name: 'Final Hash', duration: 400, color: '#22c55e' }
    ]

    // Mock SHA-256 hash
    const hash = this.mockHash(data)

    return {
      type: 'hash',
      steps,
      totalDuration: steps.reduce((sum, step) => sum + step.duration, 0),
      input: data,
      output: hash
    }
  }

  mockHash(data) {
    // Simple mock hash for visualization
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64)
  }

  // Get current step of animation
  getCurrentStep(animation, elapsedTime) {
    let accumulatedTime = 0
    for (let i = 0; i < animation.steps.length; i++) {
      accumulatedTime += animation.steps[i].duration
      if (elapsedTime < accumulatedTime) {
        return {
          index: i,
          step: animation.steps[i],
          progress: (elapsedTime - (accumulatedTime - animation.steps[i].duration)) / animation.steps[i].duration
        }
      }
    }
    return {
      index: animation.steps.length - 1,
      step: animation.steps[animation.steps.length - 1],
      progress: 1.0
    }
  }

  // Format bytes for display
  formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
}

// Encryption Types
export const ENCRYPTION_TYPES = {
  AES_128: { name: 'AES-128', keySize: 128, blockSize: 128 },
  AES_256: { name: 'AES-256', keySize: 256, blockSize: 128 },
  RSA_2048: { name: 'RSA-2048', keySize: 2048 },
  RSA_4096: { name: 'RSA-4096', keySize: 4096 },
  DIFFIE_HELLMAN: { name: 'Diffie-Hellman', keySize: 2048 },
  SHA_256: { name: 'SHA-256', outputSize: 256 },
  SHA_512: { name: 'SHA-512', outputSize: 512 }
}

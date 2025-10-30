// Network Physics Engine - Handles 1000+ particles with canvas rendering

export class NetworkPhysics {
  constructor(canvasRef) {
    this.canvas = canvasRef
    this.ctx = null
    this.particles = []
    this.animationId = null
    this.lastTime = Date.now()
  }

  initialize() {
    if (!this.canvas) return
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
  }

  createParticle(x, y, color, velocity = { x: 0, y: 0 }) {
    return {
      x,
      y,
      vx: velocity.x,
      vy: velocity.y,
      color,
      size: Math.random() * 3 + 1,
      life: 1.0,
      decay: Math.random() * 0.01 + 0.005
    }
  }

  addParticleEffect(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = Math.random() * 2 + 1
      this.particles.push(
        this.createParticle(x, y, color, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        })
      )
    }
  }

  update(deltaTime) {
    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx * deltaTime
      particle.y += particle.vy * deltaTime
      particle.life -= particle.decay
      return particle.life > 0
    })
  }

  render(packets = []) {
    if (!this.ctx) return

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Render particles
    this.particles.forEach(particle => {
      this.ctx.globalAlpha = particle.life
      this.ctx.fillStyle = particle.color
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
    })

    // Render packets
    packets.forEach(packet => {
      this.ctx.globalAlpha = 0.8
      this.ctx.fillStyle = packet.getColor()
      this.ctx.beginPath()
      this.ctx.arc(packet.position.x, packet.position.y, 4, 0, Math.PI * 2)
      this.ctx.fill()

      // Draw trail
      this.ctx.globalAlpha = 0.3
      this.ctx.strokeStyle = packet.getColor()
      this.ctx.lineWidth = 2
      this.ctx.beginPath()
      this.ctx.moveTo(
        packet.position.x - packet.velocity.x * 5,
        packet.position.y - packet.velocity.y * 5
      )
      this.ctx.lineTo(packet.position.x, packet.position.y)
      this.ctx.stroke()
    })

    this.ctx.globalAlpha = 1.0
  }

  start() {
    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - this.lastTime) / 16.67 // Normalize to 60fps
      this.lastTime = now

      this.update(deltaTime)
      this.animationId = requestAnimationFrame(animate)
    }
    animate()
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  resize() {
    if (!this.canvas) return
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
  }

  reset() {
    this.particles = []
  }
}

// Bandwidth Simulator
export class BandwidthSimulator {
  constructor() {
    this.maxBandwidth = 10000 // Total capacity in bytes
    this.currentUsage = 0
    this.congestionThreshold = 0.8
  }

  calculateUsage(packets) {
    // Calculate total bandwidth usage from active packets
    let totalSize = 0
    packets.forEach(packet => {
      totalSize += packet.size || 100
    })
    // Calculate as percentage of max bandwidth
    this.currentUsage = Math.min(100, (totalSize / this.maxBandwidth) * 100)
    return this.currentUsage
  }

  isCongested() {
    return this.currentUsage > this.congestionThreshold * 100
  }

  getLatencyMultiplier() {
    // Increase latency when congested
    if (this.isCongested()) {
      return 1 + (this.currentUsage / 100)
    }
    return 1.0
  }

  getPacketLossRate() {
    // Increase packet loss when congested
    if (this.isCongested()) {
      return Math.min(0.1, (this.currentUsage - 80) / 200)
    }
    return 0.01
  }
}

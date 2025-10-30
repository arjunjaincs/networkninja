// Hack Tools Inventory - Limited use consumables

export const HACK_TOOLS = {
  SMOKE_BOMB: {
    id: 'smoke_bomb',
    name: 'Smoke Bomb',
    description: 'Instantly reduce visibility by 50%',
    icon: '💨',
    cost: 200,
    uses: 1,
    effect: { visibilityReduction: 50 },
    category: 'defensive',
  },
  GOLDEN_EXPLOIT: {
    id: 'golden_exploit',
    name: 'Golden Exploit',
    description: 'Guaranteed successful exploitation (one use)',
    icon: '🔑',
    cost: 500,
    uses: 1,
    effect: { guaranteedSuccess: true },
    category: 'offensive',
  },
  TIME_FREEZE: {
    id: 'time_freeze',
    name: 'Time Freeze',
    description: 'Pause the timer for 2 minutes',
    icon: '⏸️',
    cost: 400,
    uses: 1,
    effect: { freezeTime: 120 },
    category: 'utility',
  },
  DECOY_TRAFFIC: {
    id: 'decoy_traffic',
    name: 'Decoy Traffic',
    description: 'Generate fake traffic to confuse IDS',
    icon: '🎭',
    cost: 300,
    uses: 3,
    effect: { idsConfusion: true },
    category: 'defensive',
  },
  SUPER_SCANNER: {
    id: 'super_scanner',
    name: 'Super Scanner',
    description: 'Reveal all nodes instantly',
    icon: '🔍',
    cost: 600,
    uses: 1,
    effect: { revealAll: true },
    category: 'reconnaissance',
  },
  PERSISTENCE_KIT: {
    id: 'persistence_kit',
    name: 'Persistence Kit',
    description: 'Create backdoors on 3 nodes at once',
    icon: '🚪',
    cost: 450,
    uses: 1,
    effect: { massBackdoor: 3 },
    category: 'offensive',
  },
  GHOST_PROTOCOL: {
    id: 'ghost_protocol',
    name: 'Ghost Protocol',
    description: 'Next 5 actions have zero visibility',
    icon: '👻',
    cost: 800,
    uses: 1,
    effect: { invisibleActions: 5 },
    category: 'defensive',
  },
  RAPID_FIRE: {
    id: 'rapid_fire',
    name: 'Rapid Fire',
    description: 'Next 3 actions take no time',
    icon: '⚡',
    cost: 350,
    uses: 1,
    effect: { instantActions: 3 },
    category: 'utility',
  },
}

export const craftTool = (toolId, credits) => {
  const tool = HACK_TOOLS[toolId]
  if (!tool) return { success: false, message: 'Tool not found' }
  if (credits < tool.cost) return { success: false, message: 'Insufficient credits' }
  
  return {
    success: true,
    tool: { ...tool, remainingUses: tool.uses },
    cost: tool.cost,
  }
}

export const useTool = (toolId, inventory) => {
  const toolInInventory = inventory.find(t => t.id === toolId && t.remainingUses > 0)
  if (!toolInInventory) return { success: false, message: 'Tool not available' }
  
  return {
    success: true,
    effect: toolInInventory.effect,
    remainingUses: toolInInventory.remainingUses - 1,
  }
}

import { useMemo } from 'react'
import useGameState from './useGameState'
import { getActiveSkillEffects } from '../data/skillTree'

/**
 * Hook to calculate and apply skill tree effects to gameplay
 */
export default function useSkillEffects() {
  const unlockedSkills = useGameState(state => state.unlockedSkills)
  
  // Calculate active effects from unlocked skills
  const skillEffects = useMemo(() => {
    return getActiveSkillEffects(unlockedSkills)
  }, [unlockedSkills])

  // Apply skill effects to action parameters
  const applySkillEffects = (action) => {
    if (!action) return action

    const modifiedAction = { ...action }

    // Apply visibility reduction
    if (skillEffects.visibilityReduction > 0) {
      modifiedAction.visibilityIncrease = Math.max(0, 
        action.visibilityIncrease * (1 - skillEffects.visibilityReduction)
      )
    }

    // Apply time reduction
    if (skillEffects.timeReduction > 0) {
      modifiedAction.timeCost = Math.max(1,
        action.timeCost * (1 - skillEffects.timeReduction)
      )
    }

    // Apply success rate bonus
    if (skillEffects.successRateBonus > 0) {
      modifiedAction.successRate = Math.min(100,
        action.successRate + (skillEffects.successRateBonus * 100)
      )
    }

    return modifiedAction
  }

  return {
    skillEffects,
    applySkillEffects
  }
}

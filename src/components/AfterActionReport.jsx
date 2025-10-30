import { motion } from 'framer-motion'
import { FileText, Target, Shield, TrendingUp, Award } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { ACTION_CATEGORIES } from '../data/actions'

export default function AfterActionReport() {
  const tacticsUsed = useGameState(state => state.tacticsUsed)
  const actionLog = useGameState(state => state.actionLog)
  const objectives = useGameState(state => state.objectives)
  const visibility = useGameState(state => state.visibility)
  const levelData = useGameState(state => state.levelData)

  // Analyze tactics used
  const getTacticDescription = (tactic) => {
    const descriptions = {
      'reconnaissance': 'Network mapping and information gathering',
      'exploitation': 'Vulnerability exploitation and system compromise',
      'movement': 'Lateral movement and network traversal',
      'stealth': 'Log clearing and evidence removal',
      'exfiltration': 'Data theft and extraction',
    }
    return descriptions[tactic] || tactic
  }

  const getTacticIcon = (tactic) => {
    const icons = {
      'reconnaissance': '🔍',
      'exploitation': '⚡',
      'movement': '➡️',
      'stealth': '👻',
      'exfiltration': '📥',
    }
    return icons[tactic] || '•'
  }

  // Count actions by category
  const actionsByCategory = actionLog.reduce((acc, log) => {
    if (log.category && log.result === 'success') {
      acc[log.category] = (acc[log.category] || 0) + 1
    }
    return acc
  }, {})

  // Generate summary
  const generateSummary = () => {
    const parts = []
    
    if (actionsByCategory[ACTION_CATEGORIES.RECONNAISSANCE]) {
      parts.push('network reconnaissance')
    }
    if (actionsByCategory[ACTION_CATEGORIES.EXPLOITATION]) {
      parts.push('privilege escalation')
    }
    if (actionsByCategory[ACTION_CATEGORIES.STEALTH]) {
      parts.push('log evasion')
    }
    if (actionsByCategory[ACTION_CATEGORIES.MOVEMENT]) {
      parts.push('lateral movement')
    }
    if (actionsByCategory[ACTION_CATEGORIES.EXFILTRATION]) {
      parts.push('data exfiltration')
    }

    if (parts.length === 0) return 'basic network access'
    if (parts.length === 1) return parts[0]
    if (parts.length === 2) return parts.join(' and ')
    
    const last = parts.pop()
    return parts.join(', ') + ', and ' + last
  }

  const summary = generateSummary()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-cyan-400" />
        <h2 className="text-2xl font-heading font-bold text-cyan-300">After-Action Report</h2>
      </div>

      {/* Mission Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-200 mb-2">Mission Summary</h3>
        <p className="text-gray-300 leading-relaxed">
          This operation demonstrated <span className="text-cyan-400 font-bold">{summary}</span>.
          {objectives.primary && ' Primary objective was successfully completed.'}
          {objectives.secondary && ' Stealth protocols were maintained throughout the operation.'}
          {!objectives.secondary && visibility > 60 && ' However, detection levels were higher than optimal.'}
        </p>
      </div>

      {/* Tactics Used */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-200 mb-3">Tactics, Techniques & Procedures (TTPs)</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {tacticsUsed.map((tactic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
            >
              <span className="text-2xl">{getTacticIcon(tactic)}</span>
              <div>
                <div className="font-bold text-cyan-300 capitalize">{tactic.replace('_', ' ')}</div>
                <div className="text-xs text-gray-400">{getTacticDescription(tactic)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Statistics */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-200 mb-3">Action Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(actionsByCategory).map(([category, count]) => (
            <div key={category} className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-2xl font-bold text-cyan-400">{count}</div>
              <div className="text-xs text-gray-400 capitalize">{category.replace('_', ' ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Key Findings
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          {visibility < 30 && (
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Excellent operational security maintained throughout the mission</span>
            </li>
          )}
          {actionsByCategory[ACTION_CATEGORIES.STEALTH] >= 2 && (
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Effective use of anti-forensics and log clearing techniques</span>
            </li>
          )}
          {actionsByCategory[ACTION_CATEGORIES.RECONNAISSANCE] >= 2 && (
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Thorough reconnaissance conducted before exploitation</span>
            </li>
          )}
          {objectives.tertiary && (
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Efficient time management and rapid objective completion</span>
            </li>
          )}
          {visibility > 70 && (
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">⚠</span>
              <span>High detection risk - more stealth actions recommended</span>
            </li>
          )}
          {!actionsByCategory[ACTION_CATEGORIES.STEALTH] && (
            <li className="flex items-start gap-2">
              <span className="text-yellow-400">⚠</span>
              <span>No log clearing performed - forensic evidence remains</span>
            </li>
          )}
        </ul>
      </div>

      {/* Real-World Comparison */}
      <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <h3 className="text-sm font-bold text-purple-400 mb-2">💡 Real-World Parallel</h3>
        <p className="text-xs text-gray-400">
          The techniques you used mirror those employed in the <span className="text-purple-300 font-bold">{levelData?.educational.realWorldExample.title}</span>.
          Professional penetration testers and red teams use similar methodologies to assess organizational security.
        </p>
      </div>
    </motion.div>
  )
}

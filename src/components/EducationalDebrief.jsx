import { motion } from 'framer-motion'
import { BookOpen, Lightbulb, Shield, Wrench, Briefcase, ArrowRight, AlertTriangle } from 'lucide-react'
import useGameState from '../hooks/useGameState'

export default function EducationalDebrief({ onContinue }) {
  const levelData = useGameState(state => state.levelData)

  if (!levelData || !levelData.educational) return null

  const { concepts, realWorldExample, defenseStrategies, tools } = levelData.educational

  return (
    <div className="min-h-screen bg-cyber-dark scan-lines p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="inline-block mb-4"
          >
            <BookOpen className="w-16 h-16 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-cyber-cyan mb-2">
            What You Learned
          </h1>
          <p className="text-gray-400">
            Understanding the techniques and defenses
          </p>
        </div>

        {/* Concepts Used */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-heading font-bold text-yellow-400">Concepts Used</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {concepts.map((concept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span className="text-gray-200 font-medium">{concept}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real World Example */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-2xl font-heading font-bold text-red-400">Real-World Example</h2>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold text-red-300 mb-2">{realWorldExample.title}</h3>
            <p className="text-gray-300 leading-relaxed mb-3">{realWorldExample.description}</p>
            
            {/* Impact Statistics */}
            {realWorldExample.impact && (
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <div className="p-3 bg-gray-900/50 rounded border border-red-500/20">
                  <div className="text-xs text-gray-400">Financial Loss</div>
                  <div className="text-sm font-bold text-red-300">{realWorldExample.impact.financialLoss}</div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded border border-red-500/20">
                  <div className="text-xs text-gray-400">Records Stolen</div>
                  <div className="text-sm font-bold text-red-300">{realWorldExample.impact.recordsStolen}</div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded border border-red-500/20">
                  <div className="text-xs text-gray-400">Duration</div>
                  <div className="text-sm font-bold text-red-300">{realWorldExample.impact.duration}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-gray-900/50 rounded border border-red-500/20 mb-3">
              <span className="text-red-400 font-bold">💡</span>
              <p className="text-sm text-gray-400">
                <strong className="text-red-300">Lesson:</strong> {realWorldExample.lesson}
              </p>
            </div>

            {/* Reference Links */}
            {realWorldExample.references && realWorldExample.references.length > 0 && (
              <div className="pt-3 border-t border-red-500/20">
                <div className="text-xs font-bold text-red-300 mb-2">📚 Further Reading:</div>
                <div className="space-y-2">
                  {realWorldExample.references.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-cyan-400 hover:text-cyan-300 underline"
                    >
                      → {ref.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Defense Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-heading font-bold text-green-400">Defense Strategies</h2>
          </div>
          <p className="text-gray-400 mb-4">How organizations can protect against these attacks:</p>
          <div className="space-y-3">
            {defenseStrategies.map((strategy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/30"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-200">{strategy}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools & Techniques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-heading font-bold text-purple-400">Tools Used</h2>
          </div>
          <p className="text-gray-400 mb-4">Real penetration testing tools that perform similar functions:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-purple-300">{tool.split(':')[0]}</span>
                </div>
                <p className="text-sm text-gray-400">{tool.split(':')[1]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <h2 className="text-2xl font-heading font-bold text-cyan-300">Career Opportunities</h2>
          </div>
          <p className="text-gray-400 mb-4">
            Interested in cybersecurity? These skills are valuable in various career paths:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {['Penetration Tester', 'Security Analyst', 'Red Team Operator', 'Incident Responder', 'Security Consultant', 'SOC Analyst'].map((career, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + i * 0.05 }}
                className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-center"
              >
                <span className="text-cyan-300 font-medium">{career}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring' }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="px-12 py-4 bg-cyber-cyan text-cyber-dark font-heading font-bold text-xl rounded-lg glow-cyan hover:bg-cyan-400 transition-colors inline-flex items-center gap-3"
          >
            Continue
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

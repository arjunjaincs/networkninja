import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { HelpCircle, X, ChevronRight } from 'lucide-react'

const TUTORIAL_STEPS = [
  {
    id: 1,
    title: "Welcome to Network Ninja!",
    question: "What is your goal?",
    answer: "Infiltrate networks, steal data, and escape without being detected!",
    hints: [
      "Look at the Objectives panel on the left",
      "Your current objective is shown at the top",
      "Complete all objectives to win the level"
    ]
  },
  {
    id: 2,
    title: "Understanding the Network Map",
    question: "What do the colored nodes mean?",
    answer: "Each node represents a computer or server in the network.",
    hints: [
      "🔵 Blue border = Current location",
      "🟢 Green glow = Compromised (you control it)",
      "⚪ Gray = Undiscovered or locked",
      "Click on connected nodes to move"
    ]
  },
  {
    id: 3,
    title: "Taking Actions",
    question: "How do I hack into systems?",
    answer: "Use the Action Panel on the right to perform hacking actions.",
    hints: [
      "🔍 Reconnaissance = Discover network (low visibility)",
      "⚡ Exploitation = Hack into systems (medium visibility)",
      "🧹 Stealth = Cover your tracks (reduces visibility)",
      "📦 Exfiltration = Steal data (high visibility)"
    ]
  },
  {
    id: 4,
    title: "Visibility & Detection",
    question: "What happens if I get detected?",
    answer: "High visibility triggers IDS alerts and counter-hacking!",
    hints: [
      "Visibility bar shows how exposed you are",
      "> 60% = IDS may detect you",
      "> 80% = Sysadmin starts tracing you",
      "Use 'Clear Logs' to reduce visibility"
    ]
  },
  {
    id: 5,
    title: "Expert Mode: Terminal",
    question: "Can I use real hacking commands?",
    answer: "Yes! Click 'Show Terminal (Expert Mode)' to type real commands.",
    hints: [
      "Type 'help' to see all commands",
      "Type 'hint' for objective-specific tips",
      "Use commands like: nmap, exploit, nc -lvp 4444",
      "Stealth flags (like -sS) reduce visibility"
    ]
  },
  {
    id: 6,
    title: "AI Defender",
    question: "Does the AI fight back?",
    answer: "Yes! The AI learns your tactics and adapts defenses.",
    hints: [
      "AI Threat Level shows adaptation progress",
      "Using same tactic repeatedly = AI learns",
      "AI deploys honeypots and countermeasures",
      "Try social engineering to bypass defenses"
    ]
  },
  {
    id: 7,
    title: "Counter-Hack System",
    question: "What if the sysadmin traces me?",
    answer: "You have 30 seconds to escape or counter-trace!",
    hints: [
      "🛡️ Deploy Countermeasures = Slow the trace",
      "⚡ Disconnect = Emergency escape (lose progress)",
      "🎯 Counter-Trace = Hack the hacker (risky!)",
      "Timer counts down from 30 → 0"
    ]
  },
  {
    id: 8,
    title: "Network Traffic",
    question: "What are those moving dots?",
    answer: "Live network packets! You can hide in high traffic.",
    hints: [
      "🟢 Green = Normal employee traffic",
      "🔴 Red = Other hackers",
      "🟡 Yellow = Automated bots",
      "🟠 Orange = Security sweeps",
      "50+ packets = -20% visibility bonus!"
    ]
  }
]

export default function TutorialHints() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const step = TUTORIAL_STEPS[currentStep]

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      setShowAnswer(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setShowAnswer(false)
    }
  }

  return (
    <>
      {/* Tutorial Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 p-4 bg-blue-600 border-2 border-blue-400 rounded-full text-white shadow-lg shadow-blue-500/50 hover:bg-blue-500 transition-colors"
          title="Tutorial & Help"
        >
          <HelpCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Tutorial Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border-2 border-blue-500/50 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-xs text-blue-400">
                      <span className="font-bold">TUTORIAL</span>
                      <span>•</span>
                      <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white leading-tight">
                      {step.title}
                    </h1>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Question */}
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">
                    ❓ {step.question}
                  </h3>
                  
                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold transition-colors flex items-center gap-2"
                    >
                      Show Answer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 font-bold"
                    >
                      ✓ {step.answer}
                    </motion.div>
                  )}
                </div>

                {/* Hints */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-3">
                    💡 Helpful Tips:
                  </h3>
                  <ul className="space-y-2">
                    {step.hints.map((hint, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-sm text-gray-300 flex items-start gap-2 p-3 bg-gray-800/50 rounded border border-gray-700"
                      >
                        <span className="text-yellow-400 flex-shrink-0">•</span>
                        <span>{hint}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-blue-500/30 bg-gray-900/50 flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                
                <div className="flex gap-1">
                  {TUTORIAL_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-blue-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  disabled={currentStep === TUTORIAL_STEPS.length - 1}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

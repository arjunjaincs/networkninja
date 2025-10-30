import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, CheckCircle, XCircle, Lightbulb, Shield, ArrowRight } from 'lucide-react'
import useGameState from '../hooks/useGameState'
import { getQuizForLevel, calculateQuizBonus } from '../data/quizzes'

export default function QuizScreen({ onContinue }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [showBlueTeam, setShowBlueTeam] = useState(false)
  
  const currentLevel = useGameState(state => state.currentLevel)
  const setQuizAnswer = useGameState(state => state.setQuizAnswer)
  const addQuizBonus = useGameState(state => state.addQuizBonus)

  const quiz = getQuizForLevel(currentLevel)

  if (!quiz) {
    onContinue()
    return null
  }

  const handleAnswerSelect = (option) => {
    if (showResult) return
    setSelectedAnswer(option)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return
    
    setShowResult(true)
    setQuizAnswer(selectedAnswer)
    
    if (selectedAnswer.correct) {
      const bonus = calculateQuizBonus(true)
      addQuizBonus(bonus)
    }
  }

  const handleContinue = () => {
    if (selectedAnswer?.correct) {
      setShowBlueTeam(true)
    } else {
      onContinue()
    }
  }

  if (showBlueTeam) {
    return (
      <div className="min-h-screen bg-cyber-dark scan-lines p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-block mb-4"
            >
              <Shield className="w-16 h-16 text-blue-400" />
            </motion.div>
            <h1 className="text-4xl font-heading font-bold text-blue-400 mb-2">
              Blue Team Defense Strategies
            </h1>
            <p className="text-gray-400">How defenders can stop these attacks</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 border border-blue-500/30 rounded-lg p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-blue-300 mb-4">Recommended Defenses</h2>
            <div className="space-y-3">
              {quiz.blueTeamStrategies.map((strategy, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-gray-200">{strategy}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6"
          >
            <p className="text-sm text-gray-300">
              <strong className="text-blue-300">Remember:</strong> Security is a continuous process. 
              Defenders must implement multiple layers of protection (defense in depth) and constantly 
              monitor for threats. No single solution provides complete protection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="px-12 py-4 bg-blue-500 text-white font-heading font-bold text-xl rounded-lg hover:bg-blue-400 transition-colors inline-flex items-center gap-3"
            >
              Continue to Debrief
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cyber-dark scan-lines p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="inline-block mb-4"
          >
            <HelpCircle className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <h1 className="text-4xl font-heading font-bold text-yellow-400 mb-2">
            Knowledge Check
          </h1>
          <p className="text-gray-400">Test your understanding of defensive strategies</p>
          {!showResult && (
            <div className="mt-4 text-sm text-cyan-400">
              💡 Correct answer = +500 bonus points
            </div>
          )}
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-yellow-500/30 rounded-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-200 mb-6">{quiz.question}</h2>

          <div className="space-y-3">
            {quiz.options.map((option) => {
              const isSelected = selectedAnswer?.id === option.id
              const showCorrect = showResult && option.correct
              const showIncorrect = showResult && isSelected && !option.correct

              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-500/20'
                      : showIncorrect
                      ? 'border-red-500 bg-red-500/20'
                      : isSelected
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                      showCorrect
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : showIncorrect
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : isSelected
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                        : 'border-gray-600 text-gray-400'
                    }`}>
                      {showCorrect ? <CheckCircle className="w-5 h-5" /> : 
                       showIncorrect ? <XCircle className="w-5 h-5" /> : 
                       option.id.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200">{option.text}</p>
                      <AnimatePresence>
                        {showResult && (isSelected || option.correct) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-gray-700"
                          >
                            <div className="flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-400">{option.explanation}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          {!showResult ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`px-12 py-4 font-heading font-bold text-xl rounded-lg transition-colors inline-flex items-center gap-3 ${
                selectedAnswer
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="px-12 py-4 bg-cyber-cyan text-cyber-dark font-heading font-bold text-xl rounded-lg hover:bg-cyan-400 transition-colors inline-flex items-center gap-3"
            >
              {selectedAnswer?.correct ? 'Learn Defense Strategies' : 'Continue'}
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          )}
        </motion.div>

        {/* Result Message */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mt-6 p-4 rounded-lg border-2 ${
                selectedAnswer?.correct
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedAnswer?.correct ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-bold text-green-400">Correct! +500 Bonus Points</p>
                      <p className="text-sm text-gray-300">You understand defensive security concepts well!</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="font-bold text-red-400">Not quite right</p>
                      <p className="text-sm text-gray-300">Review the explanation to learn more about defense strategies.</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

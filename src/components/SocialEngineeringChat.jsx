import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Zap } from 'lucide-react'

export default function SocialEngineeringChat({ sysAdmin, onSuccess, onFailure, onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'sysadmin', text: sysAdmin.chatResponses.greeting, timestamp: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const socialEngineeringTactics = [
    {
      text: "Hi, this is Bob from IT. Need to restart the firewall for maintenance.",
      successChance: 0.7 - sysAdmin.socialEngineeringResistance,
      type: "authority",
      icon: "🔧"
    },
    {
      text: "CEO needs urgent access to financial reports. Can you help?",
      successChance: 0.6 - sysAdmin.socialEngineeringResistance,
      type: "urgency",
      icon: "⚡"
    },
    {
      text: "Security audit in progress. Please disable IDS temporarily.",
      successChance: 0.5 - sysAdmin.socialEngineeringResistance,
      type: "technical",
      icon: "🛡️"
    },
    {
      text: "Hey! Remember me from the conference? Can you help with access?",
      successChance: 0.55 - sysAdmin.socialEngineeringResistance,
      type: "familiarity",
      icon: "👋"
    }
  ]

  const handleSend = (tacticText = input) => {
    if (!tacticText.trim() || isTyping) return

    // Add player message
    setMessages(prev => [...prev, { 
      sender: 'player', 
      text: tacticText,
      timestamp: Date.now()
    }])
    setInput('')
    setAttempts(prev => prev + 1)
    setIsTyping(true)

    // Find matching tactic or use custom
    const tactic = socialEngineeringTactics.find(t => t.text === tacticText)
    const successChance = tactic?.successChance || Math.max(0, 0.3 - sysAdmin.socialEngineeringResistance)

    // Determine success
    setTimeout(() => {
      const success = Math.random() < successChance

      if (success) {
        setMessages(prev => [...prev, { 
          sender: 'sysadmin', 
          text: sysAdmin.chatResponses.tricked,
          timestamp: Date.now()
        }])
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            sender: 'system', 
            text: '✅ Social engineering successful! IDS disabled for 60 seconds.',
            timestamp: Date.now()
          }])
          setIsTyping(false)
          
          setTimeout(() => {
            onSuccess({ 
              duration: 60000, // 1 minute access
              benefit: 'IDS_DISABLED',
              visibilityReduction: -30
            })
          }, 1000)
        }, 1000)
      } else {
        setMessages(prev => [...prev, { 
          sender: 'sysadmin', 
          text: sysAdmin.chatResponses.suspicious,
          timestamp: Date.now()
        }])
        
        if (attempts >= 2) {
          setTimeout(() => {
            setMessages(prev => [...prev, { 
              sender: 'sysadmin', 
              text: sysAdmin.chatResponses.angry,
              timestamp: Date.now()
            }])
            
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                sender: 'system', 
                text: '🚨 Social engineering failed! Alert triggered!',
                timestamp: Date.now()
              }])
              setIsTyping(false)
              
              setTimeout(() => {
                onFailure()
              }, 1000)
            }, 1000)
          }, 1000)
        } else {
          setIsTyping(false)
        }
      }
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 w-96 bg-gray-900/95 border-2 border-cyan-500 rounded-lg shadow-2xl z-50 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{sysAdmin.avatar}</span>
          <div>
            <div className="font-bold text-cyan-300">{sysAdmin.name}</div>
            <div className="text-xs text-gray-400">System Administrator</div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-950/50">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.sender === 'player' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                msg.sender === 'player' 
                  ? 'bg-cyan-600 text-white' 
                  : msg.sender === 'system'
                  ? 'bg-purple-600/50 text-purple-200 border border-purple-500/50'
                  : 'bg-gray-800 text-gray-200 border border-gray-700'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 px-3 py-2 rounded-lg text-gray-400 text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick tactics */}
      <div className="p-3 border-t border-cyan-500/30 space-y-2 bg-gray-900/50">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-gray-400 font-bold">QUICK TACTICS:</span>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {socialEngineeringTactics.map((tactic, i) => (
            <button
              key={i}
              onClick={() => handleSend(tactic.text)}
              disabled={isTyping}
              className="w-full text-left px-3 py-2 text-xs bg-gray-800/80 hover:bg-gray-700 rounded text-gray-300 transition-colors border border-gray-700 hover:border-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <span>{tactic.icon}</span>
                <span className="font-bold text-cyan-400">{tactic.type.toUpperCase()}</span>
              </div>
              <div className="mt-1 text-gray-400 truncate">{tactic.text}</div>
              <div className="mt-1 text-xs">
                <span className={`${
                  tactic.successChance > 0.5 ? 'text-green-400' :
                  tactic.successChance > 0.3 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  Success: {Math.round(Math.max(0, tactic.successChance * 100))}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cyan-500/30 bg-gray-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type custom message..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-gray-500">
            Attempts: <span className={attempts >= 2 ? 'text-red-400' : 'text-cyan-400'}>{attempts}/3</span>
          </span>
          <span className="text-gray-500">
            Resistance: <span className="text-yellow-400">{Math.round(sysAdmin.socialEngineeringResistance * 100)}%</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

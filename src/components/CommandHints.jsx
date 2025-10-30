import { motion } from 'framer-motion'
import { Lightbulb, Copy } from 'lucide-react'
import { useState } from 'react'

export default function CommandHints({ currentObjective }) {
  const [copiedCommand, setCopiedCommand] = useState(null)

  const hints = {
    'scan_network': [
      { cmd: 'nmap 192.168.1.1', desc: 'Basic port scan', difficulty: 'beginner' },
      { cmd: 'nmap -sV 192.168.1.1', desc: 'Scan with version detection', difficulty: 'intermediate' },
      { cmd: 'nmap -sS 192.168.1.1', desc: 'Stealth scan (less visible)', difficulty: 'expert' },
    ],
    'exploit_vulnerability': [
      { cmd: 'exploit 192.168.1.1', desc: 'Exploit target', difficulty: 'beginner' },
      { cmd: 'sqlmap -u "http://target.com"', desc: 'SQL injection', difficulty: 'intermediate' },
      { cmd: 'hydra -l admin -P wordlist.txt ssh', desc: 'Brute force', difficulty: 'expert' },
    ],
    'establish_access': [
      { cmd: 'ssh admin@192.168.1.1', desc: 'SSH connection', difficulty: 'beginner' },
      { cmd: 'nc -lvp 4444', desc: 'Reverse shell listener', difficulty: 'intermediate' },
      { cmd: 'msfconsole', desc: 'Launch Metasploit', difficulty: 'expert' },
    ],
    'exfiltrate_data': [
      { cmd: 'cat passwords.txt', desc: 'Read file', difficulty: 'beginner' },
      { cmd: 'grep "password" /etc/shadow', desc: 'Search for passwords', difficulty: 'intermediate' },
      { cmd: 'find / -name "*.txt"', desc: 'Find all text files', difficulty: 'expert' },
    ],
    'cover_tracks': [
      { cmd: 'rm logs.txt', desc: 'Delete file', difficulty: 'beginner' },
      { cmd: 'history -c', desc: 'Clear command history', difficulty: 'intermediate' },
    ]
  }

  const currentHints = hints[currentObjective] || hints['scan_network']

  const copyCommand = (cmd) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCommand(cmd)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'text-green-400 border-green-500/30 bg-green-900/20'
      case 'intermediate': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20'
      case 'expert': return 'text-red-400 border-red-500/30 bg-red-900/20'
      default: return 'text-blue-400 border-blue-500/30 bg-blue-900/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-3"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-bold text-blue-400">COMMAND HINTS</span>
      </div>

      <div className="space-y-2">
        {currentHints.map((hint, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-2 border rounded ${getDifficultyColor(hint.difficulty)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs font-mono font-bold">{hint.cmd}</code>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    hint.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                    hint.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {hint.difficulty}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{hint.desc}</div>
              </div>
              <button
                onClick={() => copyCommand(hint.cmd)}
                className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                title="Copy command"
              >
                {copiedCommand === hint.cmd ? (
                  <span className="text-xs text-green-400">✓</span>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-500/20 text-xs text-gray-400">
        💡 <span className="text-green-400">Beginner</span>: Safe commands to start |{' '}
        <span className="text-yellow-400">Intermediate</span>: More advanced |{' '}
        <span className="text-red-400">Expert</span>: High-risk, high-reward
      </div>
    </motion.div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, Minimize2, Maximize2, HelpCircle } from 'lucide-react'
import { parseCommand, setNetworkContext } from '../utils/commandParser'
import useGameState from '../hooks/useGameState'

export default function HackingTerminal({ onCommandExecute, isMinimized, onToggleMinimize }) {
  const [history, setHistory] = useState([
    { type: 'system', text: '╔═══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║        NETWORK NINJA TERMINAL v2.0 - EXPERT MODE        ║' },
    { type: 'system', text: '╚═══════════════════════════════════════════════════════════╝' },
    { type: 'info', text: '' },
    { type: 'success', text: '✓ Terminal initialized successfully' },
    { type: 'info', text: '' },
    { type: 'warning', text: '💡 Type "help" to see all commands' },
    { type: 'warning', text: '💡 Type "hint" for objective-specific tips' },
    { type: 'info', text: '' },
  ])
  const [input, setInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState([])
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  const currentNode = useGameState(state => state.currentNode)
  const network = useGameState(state => state.network)

  // Update network context when network changes
  useEffect(() => {
    if (network) {
      setNetworkContext(network)
    }
  }, [network])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Focus input when not minimized
  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus()
    }
  }, [isMinimized])

  // Auto-complete suggestions
  const allCommands = [
    'help', 'nmap', 'ping', 'whois', 'exploit', 'sqlmap', 'hydra',
    'nc', 'ssh', 'cat', 'grep', 'find', 'rm', 'history', 'ls', 'clear', 'man'
  ]

  useEffect(() => {
    if (input) {
      const matches = allCommands.filter(cmd => cmd.startsWith(input.toLowerCase()))
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [input])

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add to history
    setHistory(prev => [...prev, { type: 'input', text: `root@kali:~# ${trimmedCmd}` }])
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Parse and execute command
    const currentNodeData = network?.nodes.find(n => n.id === currentNode)
    const result = parseCommand(trimmedCmd, currentNodeData)
    
    // Handle clear command
    if (result.clear) {
      setHistory([
        { type: 'system', text: '╔═══════════════════════════════════════╗' },
        { type: 'system', text: '║   NETWORK NINJA TERMINAL v2.0        ║' },
        { type: 'system', text: '╚═══════════════════════════════════════╝' },
        { type: 'info', text: '' },
      ])
      setInput('')
      return
    }

    // Add result to history
    if (result.output && result.output.length > 0) {
      setHistory(prev => [...prev, ...result.output, { type: 'info', text: '' }])
    }

    // Execute game action
    if (result.action && onCommandExecute) {
      onCommandExecute(result.action, result.params || {})
    }

    setInput('')
    setSuggestions([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length === 1) {
        setInput(suggestions[0])
        setSuggestions([])
      } else if (suggestions.length > 0) {
        setInput(suggestions[0])
      }
    }
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/95 border-2 border-green-500/50 rounded-lg p-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-green-400">Terminal</span>
          </div>
          <button
            onClick={onToggleMinimize}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full bg-black/95 border-2 border-green-500/50 rounded-lg flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-green-500/30 bg-green-950/20">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-green-400" />
          <span className="font-bold font-mono text-green-400">HACKING TERMINAL</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCommand('help')}
            className="text-green-400 hover:text-green-300 transition-colors"
            title="Show help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleMinimize}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-base"
      >
        <AnimatePresence>
          {history.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`
                ${line.type === 'system' ? 'text-cyan-400' : ''}
                ${line.type === 'error' ? 'text-red-400' : ''}
                ${line.type === 'success' ? 'text-green-400' : ''}
                ${line.type === 'warning' ? 'text-yellow-400' : ''}
                ${line.type === 'info' ? 'text-blue-400' : ''}
                ${line.type === 'input' ? 'text-white' : ''}
                whitespace-pre-wrap break-words
              `}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Auto-complete Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 pb-2">
          <div className="bg-gray-900/80 border border-green-500/30 rounded p-2">
            <div className="text-xs text-gray-400 mb-1">Suggestions (Tab to complete):</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(cmd)
                    setSuggestions([])
                    inputRef.current?.focus()
                  }}
                  className="px-2 py-1 bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 rounded text-xs text-green-400 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Line */}
      <div className="p-4 border-t border-green-500/30 bg-green-950/10">
        <div className="flex items-center gap-2 font-mono text-lg">
          <span className="text-green-500 font-bold">root@kali:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400 text-lg"
            placeholder="Type a command..."
            autoFocus
          />
          <span className="text-green-400 animate-pulse text-lg">▊</span>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>↑/↓ history | Tab complete | "help" for commands | "hint" for tips</span>
        </div>
      </div>
    </motion.div>
  )
}

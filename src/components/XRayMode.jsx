import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, AlertCircle, Shield, Target } from 'lucide-react'

const EDUCATIONAL_CONCEPTS = {
  reconnaissance: {
    title: 'Reconnaissance',
    realWorld: 'Information Gathering Phase',
    description: 'Attackers scan networks to identify targets, open ports, and vulnerabilities before launching attacks.',
    examples: [
      'Nmap port scanning',
      'DNS enumeration',
      'WHOIS lookups',
      'Social engineering',
    ],
    defense: 'Use firewalls to limit exposed services, implement IDS to detect scans, practice security through obscurity.',
    icon: '🔍',
    color: 'cyan',
  },
  
  exploitation: {
    title: 'Exploitation',
    realWorld: 'Vulnerability Exploitation',
    description: 'Leveraging security weaknesses to gain unauthorized access to systems.',
    examples: [
      'SQL injection attacks',
      'Buffer overflow exploits',
      'Zero-day vulnerabilities',
      'Unpatched software flaws',
    ],
    defense: 'Regular patching, input validation, least privilege principle, vulnerability scanning.',
    icon: '💥',
    color: 'red',
  },
  
  privilege_escalation: {
    title: 'Privilege Escalation',
    realWorld: 'Gaining Higher Access Rights',
    description: 'Attackers elevate their permissions from normal user to administrator level.',
    examples: [
      'Kernel exploits',
      'Misconfigured sudo rights',
      'Token impersonation',
      'DLL hijacking',
    ],
    defense: 'Principle of least privilege, proper access controls, regular audits, security hardening.',
    icon: '⬆️',
    color: 'orange',
  },
  
  lateral_movement: {
    title: 'Lateral Movement',
    realWorld: 'Moving Through the Network',
    description: 'Once inside, attackers move between systems to reach valuable targets.',
    examples: [
      'Pass-the-hash attacks',
      'Remote desktop protocol',
      'PsExec tool usage',
      'Credential dumping',
    ],
    defense: 'Network segmentation, multi-factor authentication, monitoring lateral traffic, credential protection.',
    icon: '↔️',
    color: 'yellow',
  },
  
  data_exfiltration: {
    title: 'Data Exfiltration',
    realWorld: 'Stealing Sensitive Information',
    description: 'Attackers extract valuable data from compromised systems.',
    examples: [
      'DNS tunneling',
      'HTTPS exfiltration',
      'Cloud storage uploads',
      'Email attachments',
    ],
    defense: 'Data Loss Prevention (DLP), egress filtering, encryption, monitoring outbound traffic.',
    icon: '📤',
    color: 'purple',
  },
  
  persistence: {
    title: 'Persistence',
    realWorld: 'Maintaining Long-Term Access',
    description: 'Attackers establish backdoors to retain access even after reboots or detection.',
    examples: [
      'Registry modifications',
      'Scheduled tasks',
      'Web shells',
      'Rootkits',
    ],
    defense: 'Regular system audits, integrity monitoring, endpoint detection and response (EDR), baseline comparisons.',
    icon: '🔒',
    color: 'green',
  },
  
  covering_tracks: {
    title: 'Covering Tracks',
    realWorld: 'Anti-Forensics',
    description: 'Attackers hide evidence of their intrusion to avoid detection and attribution.',
    examples: [
      'Log deletion',
      'Timestamp modification',
      'Clearing command history',
      'Using encryption',
    ],
    defense: 'Centralized logging, log integrity protection, SIEM correlation, forensic readiness.',
    icon: '🧹',
    color: 'gray',
  },
}

export default function XRayMode({ currentAction, onClose }) {
  if (!currentAction || !EDUCATIONAL_CONCEPTS[currentAction]) {
    return null
  }

  const concept = EDUCATIONAL_CONCEPTS[currentAction]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={`bg-gray-900 border-2 border-${concept.color}-500 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
        >
          {/* Header */}
          <div className={`bg-${concept.color}-500/20 border-b border-${concept.color}-500 p-6 flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              <div className="text-6xl">{concept.icon}</div>
              <div>
                <h2 className={`text-3xl font-heading font-bold text-${concept.color}-400 flex items-center gap-2`}>
                  <BookOpen className="w-8 h-8" />
                  X-Ray Mode
                </h2>
                <p className="text-gray-400 mt-1">Educational Breakdown</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h3 className={`text-2xl font-heading font-bold text-${concept.color}-300 mb-2`}>
                {concept.title}
              </h3>
              <p className="text-xl text-gray-300">{concept.realWorld}</p>
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{concept.description}</p>
            </div>

            {/* Real-World Examples */}
            <div>
              <h4 className={`text-lg font-heading font-bold text-${concept.color}-400 mb-3 flex items-center gap-2`}>
                <Target className="w-5 h-5" />
                Real-World Examples
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {concept.examples.map((example, i) => (
                  <div key={i} className="bg-gray-800/30 border border-gray-700 rounded p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`w-4 h-4 text-${concept.color}-400 mt-1 flex-shrink-0`} />
                      <span className="text-gray-300 text-sm">{example}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Defense Strategies */}
            <div>
              <h4 className={`text-lg font-heading font-bold text-green-400 mb-3 flex items-center gap-2`}>
                <Shield className="w-5 h-5" />
                How to Defend Against This
              </h4>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed">{concept.defense}</p>
              </div>
            </div>

            {/* Cyber Kill Chain Position */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-bold text-gray-400 mb-2">MITRE ATT&CK Framework</h4>
              <p className="text-xs text-gray-500">
                This technique is part of the {concept.title} phase in the cyber kill chain. 
                Understanding each phase helps defenders build layered security controls.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/30">
            <p className="text-xs text-gray-500 text-center">
              💡 Press X-Ray Mode during gameplay to learn about any action in real-time
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Export concepts for use in other components
export { EDUCATIONAL_CONCEPTS }

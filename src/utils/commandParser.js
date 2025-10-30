// Command Parser for Hacking Terminal
// Parses real hacking commands and returns game actions

export function parseCommand(cmd, currentNode) {
  const parts = cmd.trim().split(' ')
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  // Command database
  const commands = {
    // RECONNAISSANCE
    'nmap': handleNmap,
    'ping': handlePing,
    'whois': handleWhois,
    
    // EXPLOITATION
    'msfconsole': handleMetasploit,
    'exploit': handleExploit,
    'sqlmap': handleSQLMap,
    'hydra': handleHydra,
    
    // POST-EXPLOITATION
    'nc': handleNetcat,
    'ssh': handleSSH,
    
    // DATA EXFILTRATION
    'cat': handleCat,
    'grep': handleGrep,
    'find': handleFind,
    
    // COVERING TRACKS
    'rm': handleRm,
    'history': handleHistory,
    
    // UTILITIES
    'help': handleHelp,
    'hint': handleHint,
    'ls': handleLs,
    'clear': handleClear,
    'man': handleMan,
  }

  if (commands[command]) {
    return commands[command](args, currentNode)
  } else {
    return {
      output: [
        { type: 'error', text: `bash: ${command}: command not found` },
        { type: 'info', text: 'Type "help" for available commands' }
      ]
    }
  }
}

// NMAP - Port Scanning
function handleNmap(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: nmap [options] <target>' },
        { type: 'info', text: 'Examples:' },
        { type: 'info', text: '  nmap 192.168.1.1          Basic scan' },
        { type: 'info', text: '  nmap -sV 192.168.1.1      Version detection' },
        { type: 'info', text: '  nmap -sS 192.168.1.1      Stealth scan' },
      ]
    }
  }

  const hasStealthFlag = args.includes('-sS')
  const hasVersionFlag = args.includes('-sV')
  const target = args[args.length - 1]

  const visibility = hasStealthFlag ? 5 : 15
  const timeCost = hasStealthFlag ? 2000 : 3000

  return {
    output: [
      { type: 'system', text: `Starting Nmap 7.94 ( https://nmap.org )` },
      { type: 'system', text: `Nmap scan report for ${target}` },
      { type: 'system', text: `Host is up (0.00043s latency)` },
      { type: 'success', text: `\nPORT     STATE SERVICE${hasVersionFlag ? '     VERSION' : ''}` },
      { type: 'success', text: `22/tcp   open  ssh${hasVersionFlag ? '         OpenSSH 8.2p1' : ''}` },
      { type: 'success', text: `80/tcp   open  http${hasVersionFlag ? '        Apache 2.4.41' : ''}` },
      { type: 'success', text: `443/tcp  open  https${hasVersionFlag ? '       Apache 2.4.41' : ''}` },
      { type: 'success', text: `3306/tcp open  mysql${hasVersionFlag ? '       MySQL 5.7.33' : ''}` },
      { type: 'system', text: `\nNmap done: 1 IP address (1 host up) scanned in ${timeCost/1000}s` },
      { type: 'success', text: hasStealthFlag ? '✅ Stealth mode reduced visibility!' : '' },
    ],
    action: 'passive_scan',
    params: { 
      visibility, 
      timeCost,
      bonus: hasStealthFlag ? 'stealth' : null
    }
  }
}

// PING
function handlePing(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: ping <target>' },
      ]
    }
  }

  const target = args[0]

  return {
    output: [
      { type: 'system', text: `PING ${target} (${target}): 56 data bytes` },
      { type: 'success', text: `64 bytes from ${target}: icmp_seq=0 ttl=64 time=0.043 ms` },
      { type: 'success', text: `64 bytes from ${target}: icmp_seq=1 ttl=64 time=0.051 ms` },
      { type: 'success', text: `64 bytes from ${target}: icmp_seq=2 ttl=64 time=0.048 ms` },
      { type: 'system', text: `\n--- ${target} ping statistics ---` },
      { type: 'success', text: `3 packets transmitted, 3 received, 0% packet loss` },
      { type: 'success', text: '✅ Host is alive!' },
    ],
    action: 'passive_scan',
    params: { visibility: 3, timeCost: 1000 }
  }
}

// WHOIS
function handleWhois(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [{ type: 'error', text: 'Usage: whois <domain>' }]
    }
  }

  return {
    output: [
      { type: 'system', text: `Domain Name: ${args[0]}` },
      { type: 'system', text: `Registrar: GoDaddy.com, LLC` },
      { type: 'system', text: `Creation Date: 2020-01-15` },
      { type: 'system', text: `Expiration Date: 2025-01-15` },
      { type: 'success', text: `Name Server: ns1.example.com` },
      { type: 'success', text: `Name Server: ns2.example.com` },
    ],
    action: 'passive_scan',
    params: { visibility: 2, timeCost: 1500 }
  }
}

// METASPLOIT
function handleMetasploit(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'system', text: '       =[ metasploit v6.3.0                  ]' },
        { type: 'system', text: '+ -- --=[ 2294 exploits - 1201 auxiliary - 409 post       ]' },
        { type: 'system', text: '+ -- --=[ 968 payloads - 45 encoders - 11 nops            ]' },
        { type: 'success', text: '\nmsf6 > Ready to exploit!' },
        { type: 'info', text: 'Use: exploit <target>' },
      ]
    }
  }

  return {
    output: [
      { type: 'system', text: 'Loading exploit modules...' },
      { type: 'success', text: 'Exploit framework ready!' },
    ],
    action: 'exploit',
    params: { visibility: 10 }
  }
}

// EXPLOIT
function handleExploit(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: exploit <target>' },
        { type: 'info', text: 'Example: exploit 192.168.1.1' },
      ]
    }
  }

  return {
    output: [
      { type: 'system', text: '[*] Exploiting target...' },
      { type: 'system', text: '[*] Sending payload...' },
      { type: 'system', text: '[*] Waiting for response...' },
      { type: 'success', text: '[+] Exploit successful!' },
      { type: 'success', text: '🎯 Node compromised!' },
    ],
    action: 'exploit',
    params: { visibility: 25, timeCost: 4000 }
  }
}

// SQL INJECTION
function handleSQLMap(args, currentNode) {
  const hasUrl = args.includes('-u')
  
  if (!hasUrl) {
    return {
      output: [
        { type: 'error', text: 'Usage: sqlmap -u <URL>' },
        { type: 'info', text: 'Example: sqlmap -u "http://target.com/login.php"' },
        { type: 'info', text: 'Options: --dbs (list databases), --dump (extract data)' },
      ]
    }
  }

  return {
    output: [
      { type: 'system', text: '[*] starting @ ' + new Date().toLocaleTimeString() },
      { type: 'system', text: '[*] testing connection to the target URL' },
      { type: 'success', text: '[*] target URL appears to be injectable' },
      { type: 'warning', text: '[*] testing for SQL injection vulnerabilities' },
      { type: 'success', text: '[+] parameter "id" is vulnerable to SQL injection' },
      { type: 'success', text: '[+] database: company_db' },
      { type: 'success', text: '[+] tables: users, passwords, financial_data' },
      { type: 'success', text: '💉 SQL Injection successful!' },
    ],
    action: 'exploit',
    params: { visibility: 30, timeCost: 5000 }
  }
}

// BRUTE FORCE
function handleHydra(args, currentNode) {
  if (args.length < 2) {
    return {
      output: [
        { type: 'error', text: 'Usage: hydra -l <user> -P <wordlist> <target> <service>' },
        { type: 'info', text: 'Example: hydra -l admin -P rockyou.txt 192.168.1.1 ssh' },
      ]
    }
  }

  return {
    output: [
      { type: 'system', text: 'Hydra v9.5 starting...' },
      { type: 'system', text: '[DATA] attacking ssh://192.168.1.1:22/' },
      { type: 'system', text: '[ATTEMPT] login "admin" - pass "password"' },
      { type: 'system', text: '[ATTEMPT] login "admin" - pass "123456"' },
      { type: 'system', text: '[ATTEMPT] login "admin" - pass "admin123"' },
      { type: 'success', text: '[22][ssh] host: 192.168.1.1   login: admin   password: admin123' },
      { type: 'success', text: '🔓 Password cracked!' },
    ],
    action: 'brute_force',
    params: { visibility: 40, timeCost: 6000 }
  }
}

// NETCAT - Reverse Shell
function handleNetcat(args, currentNode) {
  if (args.includes('-l') && args.includes('-v') && args.includes('-p')) {
    const portIndex = args.indexOf('-p') + 1
    const port = args[portIndex] || '4444'
    
    return {
      output: [
        { type: 'success', text: `Listening on 0.0.0.0 ${port}` },
        { type: 'warning', text: 'Waiting for connection...' },
        { type: 'success', text: `Connection received from ${currentNode?.ip || '192.168.1.100'}` },
        { type: 'success', text: '🎯 REVERSE SHELL ESTABLISHED!' },
        { type: 'success', text: 'You now have remote access to the target system!' },
      ],
      action: 'lateral_movement',
      params: { visibility: 25, timeCost: 3000, highValue: true }
    }
  }

  if (args.length >= 2) {
    return {
      output: [
        { type: 'system', text: `Connecting to ${args[0]}:${args[1]}...` },
        { type: 'success', text: 'Connection established!' },
      ],
      action: 'lateral_movement',
      params: { visibility: 15, timeCost: 2000 }
    }
  }

  return {
    output: [
      { type: 'error', text: 'Usage: nc [options] <host> <port>' },
      { type: 'info', text: 'Reverse shell: nc -lvp 4444' },
      { type: 'info', text: 'Connect: nc 192.168.1.1 4444' },
    ]
  }
}

// SSH
function handleSSH(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: ssh user@host' },
        { type: 'info', text: 'Example: ssh admin@192.168.1.1' },
      ]
    }
  }

  return {
    output: [
      { type: 'system', text: `Connecting to ${args[0]}...` },
      { type: 'system', text: 'The authenticity of host cannot be established.' },
      { type: 'warning', text: 'Are you sure you want to continue? (yes)' },
      { type: 'success', text: 'Connection established!' },
      { type: 'success', text: '🔐 SSH access granted!' },
    ],
    action: 'lateral_movement',
    params: { visibility: 20, timeCost: 3000 }
  }
}

// CAT - Read files
function handleCat(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [{ type: 'error', text: 'Usage: cat <filename>' }]
    }
  }

  const filename = args[0]
  const fileContents = {
    '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000::/home/admin:/bin/bash',
    'passwords.txt': 'admin:admin123\nuser:password123\nroot:toor',
    'secret.txt': '🔐 SECRET DATA FOUND!\nAPI_KEY: sk_live_abc123xyz\nDATABASE_PASSWORD: super_secret_pass',
  }

  const content = fileContents[filename] || `${filename}: No such file or directory`

  return {
    output: [
      { type: content.includes('No such file') ? 'error' : 'success', text: content }
    ],
    action: content.includes('SECRET') ? 'data_exfiltration' : null,
    params: { visibility: 5 }
  }
}

// GREP - Search files
function handleGrep(args, currentNode) {
  if (args.length < 2) {
    return {
      output: [
        { type: 'error', text: 'Usage: grep <pattern> <file>' },
        { type: 'info', text: 'Example: grep "password" /etc/shadow' },
      ]
    }
  }

  return {
    output: [
      { type: 'success', text: `Searching for "${args[0]}"...` },
      { type: 'success', text: 'admin:$6$xyz$abc123:18000:0:99999:7:::' },
      { type: 'success', text: 'Found 1 match!' },
    ],
    action: 'data_exfiltration',
    params: { visibility: 8 }
  }
}

// FIND - Search filesystem
function handleFind(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: find <path> -name <pattern>' },
        { type: 'info', text: 'Example: find / -name "*.txt"' },
      ]
    }
  }

  return {
    output: [
      { type: 'system', text: 'Searching filesystem...' },
      { type: 'success', text: '/home/admin/passwords.txt' },
      { type: 'success', text: '/var/www/html/secret.txt' },
      { type: 'success', text: '/root/backup.txt' },
      { type: 'success', text: 'Found 3 files!' },
    ],
    action: 'data_exfiltration',
    params: { visibility: 10, timeCost: 2000 }
  }
}

// RM - Delete files (covering tracks)
function handleRm(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [{ type: 'error', text: 'Usage: rm <filename>' }]
    }
  }

  return {
    output: [
      { type: 'success', text: `Deleted ${args.join(' ')}` },
      { type: 'success', text: '🧹 Tracks covered!' },
    ],
    action: 'cover_tracks',
    params: { visibility: -10 }
  }
}

// HISTORY - Command history
function handleHistory(args, currentNode) {
  if (args.includes('-c')) {
    return {
      output: [
        { type: 'success', text: 'Command history cleared!' },
        { type: 'success', text: '🧹 Logs cleaned!' },
      ],
      action: 'cover_tracks',
      params: { visibility: -15 }
    }
  }

  return {
    output: [
      { type: 'system', text: '  1  nmap -sV 192.168.1.1' },
      { type: 'system', text: '  2  exploit 192.168.1.1' },
      { type: 'system', text: '  3  nc -lvp 4444' },
    ]
  }
}

// HELP
function handleHelp(args, currentNode) {
  return {
    output: [
      { type: 'system', text: '=== NETWORK NINJA TERMINAL ===' },
      { type: 'info', text: '\n📡 RECONNAISSANCE (Low visibility):' },
      { type: 'success', text: '  ping <target>              Check if host is alive' },
      { type: 'success', text: '  nmap <target>              Basic port scan' },
      { type: 'success', text: '  nmap -sV <target>          Scan with version detection' },
      { type: 'success', text: '  nmap -sS <target>          Stealth scan (less visible)' },
      { type: 'success', text: '  whois <domain>             Domain information' },
      { type: 'info', text: '\n💥 EXPLOITATION (Medium visibility):' },
      { type: 'success', text: '  exploit <target>           Exploit vulnerabilities' },
      { type: 'success', text: '  sqlmap -u <url>            SQL injection attack' },
      { type: 'success', text: '  hydra -l user -P pass      Brute force passwords' },
      { type: 'info', text: '\n🎯 POST-EXPLOITATION (High visibility):' },
      { type: 'success', text: '  nc -lvp <port>             Reverse shell listener' },
      { type: 'success', text: '  ssh user@host              SSH connection' },
      { type: 'info', text: '\n📦 DATA EXFILTRATION:' },
      { type: 'success', text: '  cat <file>                 Read file contents' },
      { type: 'success', text: '  grep <pattern> <file>      Search in files' },
      { type: 'success', text: '  find / -name "*.txt"       Search filesystem' },
      { type: 'info', text: '\n🧹 COVERING TRACKS (Reduces visibility):' },
      { type: 'success', text: '  rm <file>                  Delete files' },
      { type: 'success', text: '  history -c                 Clear command history' },
      { type: 'info', text: '\n🛠️ UTILITIES:' },
      { type: 'success', text: '  hint                       Show objective-based hints' },
      { type: 'success', text: '  man <command>              Show command manual' },
      { type: 'success', text: '  clear                      Clear terminal' },
      { type: 'info', text: '\n💡 TIPS:' },
      { type: 'warning', text: '  • Use stealth flags (-sS) to reduce visibility' },
      { type: 'warning', text: '  • Cover your tracks to avoid detection' },
      { type: 'warning', text: '  • Type "hint" for objective-specific help' },
    ]
  }
}

// HINT - Show objective-based hints
function handleHint(args, currentNode) {
  const hints = {
    'scan_network': [
      '💡 Try: nmap 192.168.1.1',
      '💡 Stealth scan: nmap -sS 192.168.1.1',
      '💡 Version detection: nmap -sV 192.168.1.1'
    ],
    'exploit_vulnerability': [
      '💡 Try: exploit 192.168.1.1',
      '💡 SQL injection: sqlmap -u "http://target.com"',
      '💡 Brute force: hydra -l admin -P wordlist.txt ssh'
    ],
    'establish_access': [
      '💡 Reverse shell: nc -lvp 4444',
      '💡 SSH access: ssh admin@192.168.1.1',
      '💡 Metasploit: msfconsole'
    ],
    'exfiltrate_data': [
      '💡 Read files: cat passwords.txt',
      '💡 Search: grep "password" /etc/shadow',
      '💡 Find files: find / -name "*.txt"'
    ],
    'cover_tracks': [
      '💡 Delete files: rm logs.txt',
      '💡 Clear history: history -c'
    ]
  }

  const currentHints = hints['scan_network'] // Default hints

  return {
    output: [
      { type: 'system', text: '💡 HINTS FOR CURRENT OBJECTIVE:' },
      { type: 'info', text: '' },
      ...currentHints.map(hint => ({ type: 'success', text: hint })),
      { type: 'info', text: '' },
      { type: 'warning', text: '💡 Use "help" to see all available commands' }
    ]
  }
}

// LS
function handleLs(args, currentNode) {
  return {
    output: [
      { type: 'success', text: 'passwords.txt  secret.txt  backup.tar.gz  exploit.py' },
    ]
  }
}

// CLEAR
function handleClear(args, currentNode) {
  return {
    output: [],
    clear: true
  }
}

// MAN - Manual pages
function handleMan(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [{ type: 'error', text: 'Usage: man <command>' }]
    }
  }

  const manPages = {
    'nmap': [
      { type: 'system', text: 'NMAP(1)                    Nmap Reference Guide                    NMAP(1)' },
      { type: 'info', text: '\nNAME' },
      { type: 'system', text: '       nmap - Network exploration tool and security scanner' },
      { type: 'info', text: '\nDESCRIPTION' },
      { type: 'system', text: '       Nmap is used to discover hosts and services on a network.' },
      { type: 'info', text: '\nOPTIONS' },
      { type: 'success', text: '       -sV     Version detection' },
      { type: 'success', text: '       -sS     SYN stealth scan' },
      { type: 'success', text: '       -p-     Scan all 65535 ports' },
    ],
    'nc': [
      { type: 'system', text: 'NC(1)                      Netcat Manual                      NC(1)' },
      { type: 'info', text: '\nNAME' },
      { type: 'system', text: '       nc - TCP/IP swiss army knife' },
      { type: 'info', text: '\nDESCRIPTION' },
      { type: 'system', text: '       Netcat is used for reading/writing network connections.' },
      { type: 'info', text: '\nOPTIONS' },
      { type: 'success', text: '       -l      Listen mode' },
      { type: 'success', text: '       -v      Verbose output' },
      { type: 'success', text: '       -p      Port number' },
    ]
  }

  return {
    output: manPages[args[0]] || [
      { type: 'error', text: `No manual entry for ${args[0]}` }
    ]
  }
}

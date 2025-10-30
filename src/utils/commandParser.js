// Command Parser for Hacking Terminal
// Parses real hacking commands and returns game actions

// Global network reference - will be set by the game state
let currentNetwork = null

export function setNetworkContext(network) {
  currentNetwork = network
}

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

// VALIDATION HELPERS
function validateIP(ip) {
  if (!currentNetwork) return { valid: false, error: 'Network not initialized' }
  
  // Check if IP exists in current network
  const node = currentNetwork.nodes.find(n => n.ip === ip)
  if (!node) {
    return { 
      valid: false, 
      error: `Host ${ip} not found in network`,
      suggestion: `Available IPs: ${currentNetwork.nodes.map(n => n.ip).join(', ')}`
    }
  }
  
  // Check if node is discovered
  if (!node.discovered) {
    return { 
      valid: false, 
      error: `Host ${ip} is not reachable (not discovered yet)`,
      suggestion: 'Scan connected nodes first'
    }
  }
  
  return { valid: true, node }
}

function validatePort(ip, port) {
  const ipValidation = validateIP(ip)
  if (!ipValidation.valid) return ipValidation
  
  const node = ipValidation.node
  const portNum = parseInt(port)
  
  if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
    return { 
      valid: false, 
      error: `Invalid port number: ${port}`,
      suggestion: 'Port must be between 1-65535'
    }
  }
  
  if (!node.openPorts.includes(portNum)) {
    return { 
      valid: false, 
      error: `Port ${port} is closed on ${ip}`,
      suggestion: `Open ports: ${node.openPorts.join(', ')}`
    }
  }
  
  return { valid: true, node, port: portNum }
}

function validateDomain(domain) {
  // Simple domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
  if (!domainRegex.test(domain)) {
    return { 
      valid: false, 
      error: `Invalid domain format: ${domain}`,
      suggestion: 'Use format: example.com'
    }
  }
  return { valid: true }
}

function validateURL(url) {
  try {
    const urlObj = new URL(url)
    const ip = urlObj.hostname
    
    // Check if it's an IP or domain
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      const ipValidation = validateIP(ip)
      if (!ipValidation.valid) return ipValidation
      
      // Check if HTTP/HTTPS ports are open
      const port = urlObj.port ? parseInt(urlObj.port) : (urlObj.protocol === 'https:' ? 443 : 80)
      return validatePort(ip, port)
    } else {
      return validateDomain(ip)
    }
  } catch (e) {
    return { 
      valid: false, 
      error: `Invalid URL format: ${url}`,
      suggestion: 'Use format: http://192.168.1.1 or https://example.com'
    }
  }
}

function isConnectedToCurrentNode(targetNodeId, currentNode) {
  if (!currentNetwork || !currentNode) return false
  
  const currentNodeData = currentNetwork.nodes.find(n => n.id === currentNode.id)
  if (!currentNodeData) return false
  
  return currentNodeData.connections.includes(targetNodeId)
}

function getAvailableTargets(currentNode) {
  if (!currentNetwork || !currentNode) return []
  
  const currentNodeData = currentNetwork.nodes.find(n => n.id === currentNode.id)
  if (!currentNodeData) return []
  
  return currentNodeData.connections
    .map(connId => currentNetwork.nodes.find(n => n.id === connId))
    .filter(node => node && node.discovered)
    .map(node => node.ip)
}

// NMAP - Port Scanning
function handleNmap(args, currentNode) {
  if (args.length === 0) {
    const availableTargets = getAvailableTargets(currentNode)
    return {
      output: [
        { type: 'error', text: 'Usage: nmap [options] <target>' },
        { type: 'info', text: 'Examples:' },
        { type: 'info', text: '  nmap 192.168.1.1          Basic scan' },
        { type: 'info', text: '  nmap -sV 192.168.1.1      Version detection' },
        { type: 'info', text: '  nmap -sS 192.168.1.1      Stealth scan' },
        { type: 'info', text: '' },
        { type: 'warning', text: availableTargets.length > 0 ? 
          `💡 Available targets: ${availableTargets.join(', ')}` : 
          '💡 No targets available from current node'
        },
      ]
    }
  }

  // Parse flags and target
  const hasStealthFlag = args.includes('-sS')
  const hasVersionFlag = args.includes('-sV')
  const hasAllPortsFlag = args.includes('-p-')
  
  // Find target (last argument that's not a flag)
  let target = null
  for (let i = args.length - 1; i >= 0; i--) {
    if (!args[i].startsWith('-')) {
      target = args[i]
      break
    }
  }
  
  if (!target) {
    return {
      output: [
        { type: 'error', text: 'Error: No target specified' },
        { type: 'info', text: 'Usage: nmap [options] <target>' },
      ]
    }
  }

  // Validate target IP
  const validation = validateIP(target)
  if (!validation.valid) {
    return {
      output: [
        { type: 'error', text: `nmap: ${validation.error}` },
        { type: 'warning', text: validation.suggestion || '' },
      ]
    }
  }

  const targetNode = validation.node
  
  // Check if target is reachable from current node
  if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
    return {
      output: [
        { type: 'error', text: `nmap: No route to host ${target}` },
        { type: 'warning', text: 'Target must be directly connected to current node' },
        { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
      ]
    }
  }

  const visibility = hasStealthFlag ? 5 : 15
  const timeCost = hasStealthFlag ? 20 : 30

  // Generate realistic port scan results based on actual node data
  const portResults = []
  const serviceMap = {
    22: 'ssh',
    80: 'http', 
    443: 'https',
    445: 'microsoft-ds',
    3389: 'ms-wbt-server',
    1433: 'ms-sql-s',
    3306: 'mysql',
    139: 'netbios-ssn',
    5985: 'wsman'
  }

  const versionMap = {
    22: 'OpenSSH 8.2p1',
    80: 'Apache httpd 2.4.41',
    443: 'Apache httpd 2.4.41',
    445: 'Microsoft Windows SMB',
    3389: 'Microsoft Terminal Services',
    1433: 'Microsoft SQL Server 2019',
    3306: 'MySQL 5.7.33',
    139: 'Microsoft Windows netbios-ssn',
    5985: 'Microsoft HTTPAPI httpd 2.0'
  }

  targetNode.openPorts.forEach(port => {
    const service = serviceMap[port] || 'unknown'
    const version = hasVersionFlag ? (versionMap[port] || 'version unknown') : ''
    portResults.push({
      port,
      service,
      version
    })
  })

  const output = [
    { type: 'system', text: `Starting Nmap 7.94 ( https://nmap.org )` },
    { type: 'system', text: `Nmap scan report for ${target}` },
    { type: 'system', text: `Host is up (0.00043s latency)` },
    { type: 'success', text: `\nPORT     STATE SERVICE${hasVersionFlag ? '     VERSION' : ''}` },
  ]

  // Add port results
  portResults.forEach(({ port, service, version }) => {
    const portStr = `${port}/tcp`.padEnd(9)
    const serviceStr = service.padEnd(10)
    const versionStr = hasVersionFlag ? version : ''
    output.push({
      type: 'success',
      text: `${portStr}open  ${serviceStr}${versionStr}`
    })
  })

  output.push(
    { type: 'system', text: `\nNmap done: 1 IP address (1 host up) scanned in ${timeCost/10}s` }
  )

  if (hasStealthFlag) {
    output.push({ type: 'success', text: '✅ Stealth mode reduced visibility!' })
  }

  // Show vulnerabilities if version detection is used
  if (hasVersionFlag && targetNode.vulnerabilities.length > 0) {
    output.push({ type: 'warning', text: '\n🔍 Potential vulnerabilities detected:' })
    targetNode.vulnerabilities.forEach(vuln => {
      output.push({ type: 'warning', text: `  • ${vuln}` })
    })
  }

  return {
    output,
    action: 'passive_scan',
    params: { 
      visibility, 
      timeCost,
      bonus: hasStealthFlag ? 'stealth' : null,
      targetNode: targetNode.id
    }
  }
}

// PING
function handlePing(args, currentNode) {
  if (args.length === 0) {
    const availableTargets = getAvailableTargets(currentNode)
    return {
      output: [
        { type: 'error', text: 'Usage: ping <target>' },
        { type: 'info', text: 'Example: ping 192.168.1.1' },
        { type: 'warning', text: availableTargets.length > 0 ? 
          `💡 Available targets: ${availableTargets.join(', ')}` : 
          '💡 No targets available from current node'
        },
      ]
    }
  }

  const target = args[0]

  // Validate target IP
  const validation = validateIP(target)
  if (!validation.valid) {
    return {
      output: [
        { type: 'error', text: `ping: ${validation.error}` },
        { type: 'warning', text: validation.suggestion || '' },
      ]
    }
  }

  const targetNode = validation.node

  // Check if target is reachable from current node
  if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
    return {
      output: [
        { type: 'error', text: `ping: Network is unreachable` },
        { type: 'warning', text: 'Target must be directly connected to current node' },
        { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
      ]
    }
  }

  // Generate realistic ping times based on node type
  const baseTime = targetNode.type === 'router' ? 1 : targetNode.type === 'server' ? 5 : 3
  const times = [
    (baseTime + Math.random() * 2).toFixed(3),
    (baseTime + Math.random() * 2).toFixed(3),
    (baseTime + Math.random() * 2).toFixed(3)
  ]

  return {
    output: [
      { type: 'system', text: `PING ${target} (${target}): 56 data bytes` },
      { type: 'success', text: `64 bytes from ${target}: icmp_seq=0 ttl=64 time=${times[0]} ms` },
      { type: 'success', text: `64 bytes from ${target}: icmp_seq=1 ttl=64 time=${times[1]} ms` },
      { type: 'success', text: `64 bytes from ${target}: icmp_seq=2 ttl=64 time=${times[2]} ms` },
      { type: 'system', text: `\n--- ${target} ping statistics ---` },
      { type: 'success', text: `3 packets transmitted, 3 received, 0% packet loss` },
      { type: 'success', text: `✅ Host ${targetNode.name} (${targetNode.os}) is alive!` },
    ],
    action: 'passive_scan',
    params: { visibility: 3, timeCost: 10, targetNode: targetNode.id }
  }
}

// WHOIS
function handleWhois(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: whois <domain>' },
        { type: 'info', text: 'Example: whois example.com' },
      ]
    }
  }

  const domain = args[0]

  // Validate domain format
  const validation = validateDomain(domain)
  if (!validation.valid) {
    return {
      output: [
        { type: 'error', text: `whois: ${validation.error}` },
        { type: 'warning', text: validation.suggestion || '' },
      ]
    }
  }

  // Generate realistic whois data
  const creationYear = 2018 + Math.floor(Math.random() * 5)
  const expirationYear = 2025 + Math.floor(Math.random() * 3)

  return {
    output: [
      { type: 'system', text: `   Domain Name: ${domain.toUpperCase()}` },
      { type: 'system', text: `   Registry Domain ID: D${Math.floor(Math.random() * 1000000000)}_DOMAIN_COM-VRSN` },
      { type: 'system', text: `   Registrar WHOIS Server: whois.registrar.com` },
      { type: 'system', text: `   Registrar URL: http://www.registrar.com` },
      { type: 'system', text: `   Updated Date: 2024-01-15T10:30:00Z` },
      { type: 'system', text: `   Creation Date: ${creationYear}-03-20T14:22:00Z` },
      { type: 'system', text: `   Registry Expiry Date: ${expirationYear}-03-20T14:22:00Z` },
      { type: 'system', text: `   Registrar: Example Registrar LLC` },
      { type: 'system', text: `   Registrar IANA ID: 146` },
      { type: 'system', text: `   Registrar Abuse Contact Email: abuse@registrar.com` },
      { type: 'system', text: `   Registrar Abuse Contact Phone: +1.2025551234` },
      { type: 'system', text: `   Domain Status: clientTransferProhibited` },
      { type: 'success', text: `   Name Server: NS1.${domain.split('.')[0].toUpperCase()}.COM` },
      { type: 'success', text: `   Name Server: NS2.${domain.split('.')[0].toUpperCase()}.COM` },
      { type: 'system', text: `   DNSSEC: unsigned` },
      { type: 'info', text: '' },
      { type: 'success', text: '✅ Domain information retrieved successfully' },
    ],
    action: 'passive_scan',
    params: { visibility: 2, timeCost: 15 }
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
    const availableTargets = getAvailableTargets(currentNode)
    return {
      output: [
        { type: 'error', text: 'Usage: exploit <target>' },
        { type: 'info', text: 'Example: exploit 192.168.1.1' },
        { type: 'warning', text: availableTargets.length > 0 ? 
          `💡 Available targets: ${availableTargets.join(', ')}` : 
          '💡 No targets available from current node'
        },
      ]
    }
  }

  const target = args[0]

  // Validate target IP
  const validation = validateIP(target)
  if (!validation.valid) {
    return {
      output: [
        { type: 'error', text: `exploit: ${validation.error}` },
        { type: 'warning', text: validation.suggestion || '' },
      ]
    }
  }

  const targetNode = validation.node

  // Check if target is reachable from current node
  if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
    return {
      output: [
        { type: 'error', text: `exploit: No route to host ${target}` },
        { type: 'warning', text: 'Target must be directly connected to current node' },
        { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
      ]
    }
  }

  // Check if target is already compromised
  if (targetNode.compromised) {
    return {
      output: [
        { type: 'warning', text: `[!] Target ${target} is already compromised` },
        { type: 'info', text: '✅ You already have access to this system' },
      ]
    }
  }

  // Check if target has vulnerabilities
  if (!targetNode.vulnerabilities || targetNode.vulnerabilities.length === 0) {
    return {
      output: [
        { type: 'error', text: `[!] No exploitable vulnerabilities found on ${target}` },
        { type: 'warning', text: 'Try scanning with nmap -sV first to identify vulnerabilities' },
        { type: 'info', text: 'Or use other attack vectors like brute force or social engineering' },
      ]
    }
  }

  // Success - show specific vulnerability being exploited
  const vuln = targetNode.vulnerabilities[0]
  const output = [
    { type: 'system', text: `[*] Exploiting ${target} (${targetNode.name})...` },
    { type: 'system', text: `[*] Using vulnerability: ${vuln}` },
    { type: 'system', text: '[*] Generating payload...' },
    { type: 'system', text: '[*] Sending exploit...' },
    { type: 'system', text: '[*] Waiting for response...' },
  ]

  // Simulate different exploit outcomes based on vulnerability type
  if (vuln.includes('Password') || vuln.includes('password')) {
    output.push(
      { type: 'success', text: '[+] Weak credentials exploited!' },
      { type: 'success', text: '[+] Authentication bypassed!' }
    )
  } else if (vuln.includes('SMB')) {
    output.push(
      { type: 'success', text: '[+] SMB vulnerability exploited!' },
      { type: 'success', text: '[+] Remote code execution achieved!' }
    )
  } else if (vuln.includes('CVE')) {
    output.push(
      { type: 'success', text: '[+] CVE exploit successful!' },
      { type: 'success', text: '[+] System shell obtained!' }
    )
  } else {
    output.push(
      { type: 'success', text: '[+] Exploit successful!' },
      { type: 'success', text: '[+] System compromised!' }
    )
  }

  output.push(
    { type: 'success', text: `🎯 ${targetNode.name} compromised!` },
    { type: 'info', text: `✅ You now have access to ${target}` }
  )

  return {
    output,
    action: 'exploit',
    params: { 
      visibility: 25, 
      timeCost: 40,
      targetNode: targetNode.id,
      vulnerability: vuln
    }
  }
}

// SQL INJECTION
function handleSQLMap(args, currentNode) {
  const urlIndex = args.indexOf('-u')
  
  if (urlIndex === -1 || urlIndex + 1 >= args.length) {
    const availableTargets = getAvailableTargets(currentNode)
    return {
      output: [
        { type: 'error', text: 'Usage: sqlmap -u <URL>' },
        { type: 'info', text: 'Example: sqlmap -u "http://192.168.1.1/login.php"' },
        { type: 'info', text: 'Options: --dbs (list databases), --dump (extract data)' },
        { type: 'warning', text: availableTargets.length > 0 ? 
          `💡 Available targets: ${availableTargets.map(ip => `http://${ip}`).join(', ')}` : 
          '💡 No targets available from current node'
        },
      ]
    }
  }

  const url = args[urlIndex + 1]
  
  // Remove quotes if present
  const cleanUrl = url.replace(/['"]/g, '')
  
  // Validate URL format and target
  const urlValidation = validateURL(cleanUrl)
  if (!urlValidation.valid) {
    return {
      output: [
        { type: 'error', text: `sqlmap: ${urlValidation.error}` },
        { type: 'warning', text: urlValidation.suggestion || '' },
      ]
    }
  }

  const urlObj = new URL(cleanUrl)
  const targetIP = urlObj.hostname
  const targetNode = currentNetwork.nodes.find(n => n.ip === targetIP)

  // Check if target is reachable from current node
  if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
    return {
      output: [
        { type: 'error', text: `sqlmap: No route to host ${targetIP}` },
        { type: 'warning', text: 'Target must be directly connected to current node' },
        { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
      ]
    }
  }

  // Check if target has web services (ports 80/443)
  const hasWebService = targetNode.openPorts.includes(80) || targetNode.openPorts.includes(443)
  if (!hasWebService) {
    return {
      output: [
        { type: 'error', text: `sqlmap: [CRITICAL] unable to connect to the target URL` },
        { type: 'warning', text: 'No web service found on target' },
        { type: 'info', text: `💡 Open ports: ${targetNode.openPorts.join(', ')}` },
      ]
    }
  }

  // Check for SQL injection vulnerabilities
  const hasSQLVuln = targetNode.vulnerabilities.some(v => 
    v.toLowerCase().includes('sql') || 
    v.toLowerCase().includes('injection') ||
    v.toLowerCase().includes('database')
  )

  if (!hasSQLVuln) {
    return {
      output: [
        { type: 'system', text: '[*] starting @ ' + new Date().toLocaleTimeString() },
        { type: 'system', text: `[*] testing connection to the target URL '${cleanUrl}'` },
        { type: 'system', text: '[*] checking if the target is protected by some kind of WAF/IPS' },
        { type: 'system', text: '[*] testing if the target URL content is stable' },
        { type: 'warning', text: '[*] testing for SQL injection on GET parameters' },
        { type: 'warning', text: '[*] testing for SQL injection on POST parameters' },
        { type: 'error', text: '[!] no parameter(s) found for testing in the given data' },
        { type: 'error', text: '[!] target does not seem to be injectable' },
        { type: 'warning', text: '💡 Try scanning for vulnerabilities first with nmap -sV' },
      ]
    }
  }

  // Success - SQL injection found
  const hasDumpFlag = args.includes('--dump')
  const hasDbsFlag = args.includes('--dbs')

  const output = [
    { type: 'system', text: '[*] starting @ ' + new Date().toLocaleTimeString() },
    { type: 'system', text: `[*] testing connection to the target URL '${cleanUrl}'` },
    { type: 'system', text: '[*] checking if the target is protected by some kind of WAF/IPS' },
    { type: 'success', text: '[*] target URL appears to be injectable' },
    { type: 'warning', text: '[*] testing for SQL injection vulnerabilities' },
    { type: 'success', text: '[+] parameter "id" is vulnerable to SQL injection' },
    { type: 'success', text: '[+] payload: id=1\' AND 1=1-- -' },
  ]

  if (hasDbsFlag) {
    output.push(
      { type: 'success', text: '[+] available databases [3]:' },
      { type: 'success', text: '[*] information_schema' },
      { type: 'success', text: '[*] company_db' },
      { type: 'success', text: '[*] mysql' }
    )
  }

  if (hasDumpFlag) {
    output.push(
      { type: 'success', text: '[+] dumping entries from table "users"' },
      { type: 'success', text: '+----+----------+------------------+' },
      { type: 'success', text: '| id | username | password         |' },
      { type: 'success', text: '+----+----------+------------------+' },
      { type: 'success', text: '| 1  | admin    | admin123         |' },
      { type: 'success', text: '| 2  | user     | password123      |' },
      { type: 'success', text: '+----+----------+------------------+' }
    )
  }

  output.push({ type: 'success', text: '💉 SQL Injection attack successful!' })

  return {
    output,
    action: 'exploit',
    params: { 
      visibility: 30, 
      timeCost: 50,
      targetNode: targetNode.id,
      url: cleanUrl,
      dataExtracted: hasDumpFlag
    }
  }
}

// BRUTE FORCE
function handleHydra(args, currentNode) {
  if (args.length < 6) {
    const availableTargets = getAvailableTargets(currentNode)
    return {
      output: [
        { type: 'error', text: 'Usage: hydra -l <user> -P <wordlist> <target> <service>' },
        { type: 'info', text: 'Example: hydra -l admin -P rockyou.txt 192.168.1.1 ssh' },
        { type: 'info', text: 'Services: ssh, ftp, http, https, smb' },
        { type: 'warning', text: availableTargets.length > 0 ? 
          `💡 Available targets: ${availableTargets.join(', ')}` : 
          '💡 No targets available from current node'
        },
      ]
    }
  }

  // Parse arguments
  const userIndex = args.indexOf('-l')
  const passIndex = args.indexOf('-P')
  
  if (userIndex === -1 || userIndex + 1 >= args.length) {
    return {
      output: [
        { type: 'error', text: 'hydra: missing username (-l option)' },
        { type: 'info', text: 'Usage: hydra -l <user> -P <wordlist> <target> <service>' },
      ]
    }
  }

  if (passIndex === -1 || passIndex + 1 >= args.length) {
    return {
      output: [
        { type: 'error', text: 'hydra: missing password list (-P option)' },
        { type: 'info', text: 'Usage: hydra -l <user> -P <wordlist> <target> <service>' },
      ]
    }
  }

  const username = args[userIndex + 1]
  const wordlist = args[passIndex + 1]
  
  // Find target and service (last two non-flag arguments)
  const nonFlagArgs = args.filter((arg, i) => 
    !arg.startsWith('-') && 
    i !== userIndex + 1 && 
    i !== passIndex + 1
  )

  if (nonFlagArgs.length < 2) {
    return {
      output: [
        { type: 'error', text: 'hydra: missing target or service' },
        { type: 'info', text: 'Usage: hydra -l <user> -P <wordlist> <target> <service>' },
      ]
    }
  }

  const target = nonFlagArgs[0]
  const service = nonFlagArgs[1].toLowerCase()

  // Validate target IP
  const validation = validateIP(target)
  if (!validation.valid) {
    return {
      output: [
        { type: 'error', text: `hydra: ${validation.error}` },
        { type: 'warning', text: validation.suggestion || '' },
      ]
    }
  }

  const targetNode = validation.node

  // Check if target is reachable from current node
  if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
    return {
      output: [
        { type: 'error', text: `hydra: No route to host ${target}` },
        { type: 'warning', text: 'Target must be directly connected to current node' },
        { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
      ]
    }
  }

  // Validate service and check if port is open
  const servicePortMap = {
    'ssh': 22,
    'ftp': 21,
    'http': 80,
    'https': 443,
    'smb': 445,
    'rdp': 3389,
    'mysql': 3306
  }

  const servicePort = servicePortMap[service]
  if (!servicePort) {
    return {
      output: [
        { type: 'error', text: `hydra: unsupported service '${service}'` },
        { type: 'info', text: 'Supported services: ssh, ftp, http, https, smb, rdp, mysql' },
      ]
    }
  }

  // Check if service port is open
  if (!targetNode.openPorts.includes(servicePort)) {
    return {
      output: [
        { type: 'error', text: `hydra: ${service} service not available on ${target}:${servicePort}` },
        { type: 'warning', text: `Port ${servicePort} is closed` },
        { type: 'info', text: `💡 Open ports: ${targetNode.openPorts.join(', ')}` },
      ]
    }
  }

  // Check if target has weak password vulnerability
  const hasWeakPassword = targetNode.vulnerabilities.some(v => 
    v.toLowerCase().includes('password') || 
    v.toLowerCase().includes('weak') ||
    v.toLowerCase().includes('default')
  )

  const output = [
    { type: 'system', text: 'Hydra v9.5 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes.' },
    { type: 'system', text: '' },
    { type: 'system', text: `[DATA] max 16 tasks per 1 server, overall 16 tasks, ${wordlist} login tries (l:1/p:${wordlist === 'rockyou.txt' ? '14344391' : '1000'}), ~${Math.ceil(1000/16)} tries per task` },
    { type: 'system', text: `[DATA] attacking ${service}://${target}:${servicePort}/` },
  ]

  // Simulate brute force attempts
  const commonPasswords = ['password', '123456', 'admin', 'root', 'admin123', 'password123']
  const attempts = hasWeakPassword ? 3 : 8

  for (let i = 0; i < attempts; i++) {
    const password = commonPasswords[i] || `pass${i}`
    output.push({
      type: 'system',
      text: `[ATTEMPT] target ${target} - login "${username}" - pass "${password}" - ${i + 1} of ${attempts}`
    })
  }

  if (hasWeakPassword) {
    const crackedPassword = username === 'admin' ? 'admin123' : 'password123'
    output.push(
      { type: 'success', text: `[${servicePort}][${service}] host: ${target}   login: ${username}   password: ${crackedPassword}` },
      { type: 'success', text: '1 of 1 target successfully completed, 1 valid password found' },
      { type: 'success', text: `🔓 Password cracked: ${username}:${crackedPassword}` }
    )
  } else {
    output.push(
      { type: 'error', text: `[ERROR] all ${attempts} attempts failed for ${username}` },
      { type: 'warning', text: '0 of 1 target completed, 0 valid passwords found' },
      { type: 'warning', text: '💡 Target may have strong passwords or account lockout enabled' }
    )
  }

  return {
    output,
    action: hasWeakPassword ? 'brute_force' : null,
    params: { 
      visibility: 40, 
      timeCost: 60,
      targetNode: targetNode.id,
      service,
      username,
      success: hasWeakPassword
    }
  }
}

// NETCAT - Reverse Shell
function handleNetcat(args, currentNode) {
  if (args.length === 0) {
    return {
      output: [
        { type: 'error', text: 'Usage: nc [options] <host> <port>' },
        { type: 'info', text: 'Listen mode: nc -lvp <port>' },
        { type: 'info', text: 'Connect mode: nc <host> <port>' },
        { type: 'info', text: 'Examples:' },
        { type: 'info', text: '  nc -lvp 4444              Listen on port 4444' },
        { type: 'info', text: '  nc 192.168.1.1 4444       Connect to host:port' },
      ]
    }
  }

  // Listen mode: nc -lvp <port>
  if (args.includes('-l') && args.includes('-v') && args.includes('-p')) {
    const portIndex = args.indexOf('-p') + 1
    if (portIndex >= args.length) {
      return {
        output: [
          { type: 'error', text: 'nc: option requires an argument -- p' },
          { type: 'info', text: 'Usage: nc -lvp <port>' },
        ]
      }
    }

    const port = args[portIndex]
    const portNum = parseInt(port)
    
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return {
        output: [
          { type: 'error', text: `nc: invalid port number: ${port}` },
          { type: 'info', text: 'Port must be between 1-65535' },
        ]
      }
    }

    // Check if port is commonly used (might be detected)
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995]
    const isCommonPort = commonPorts.includes(portNum)

    return {
      output: [
        { type: 'success', text: `Listening on 0.0.0.0 ${port}` },
        { type: 'warning', text: 'Waiting for reverse shell connection...' },
        { type: 'system', text: isCommonPort ? 
          '⚠️  Warning: Using common port - may be detected by IDS' : 
          '✅ Using non-standard port - lower detection risk'
        },
        { type: 'success', text: `Connection received from compromised host` },
        { type: 'success', text: '🎯 REVERSE SHELL ESTABLISHED!' },
        { type: 'success', text: 'You now have remote command execution!' },
      ],
      action: 'lateral_movement',
      params: { 
        visibility: isCommonPort ? 35 : 25, 
        timeCost: 30, 
        highValue: true,
        port: portNum
      }
    }
  }

  // Connect mode: nc <host> <port>
  if (args.length >= 2 && !args.includes('-l')) {
    const host = args[0]
    const port = args[1]

    // Validate target IP
    const validation = validateIP(host)
    if (!validation.valid) {
      return {
        output: [
          { type: 'error', text: `nc: ${validation.error}` },
          { type: 'warning', text: validation.suggestion || '' },
        ]
      }
    }

    // Validate port
    const portValidation = validatePort(host, port)
    if (!portValidation.valid) {
      return {
        output: [
          { type: 'error', text: `nc: ${portValidation.error}` },
          { type: 'warning', text: portValidation.suggestion || '' },
        ]
      }
    }

    const targetNode = validation.node

    // Check if target is reachable from current node
    if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
      return {
        output: [
          { type: 'error', text: `nc: No route to host ${host}` },
          { type: 'warning', text: 'Target must be directly connected to current node' },
          { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
        ]
      }
    }

    return {
      output: [
        { type: 'system', text: `Connecting to ${host}:${port}...` },
        { type: 'success', text: 'Connection established!' },
        { type: 'success', text: `🔗 Connected to ${targetNode.name}` },
        { type: 'info', text: 'Type messages to send data through the connection' },
      ],
      action: 'lateral_movement',
      params: { 
        visibility: 15, 
        timeCost: 20,
        targetNode: targetNode.id,
        port: parseInt(port)
      }
    }
  }

  // Invalid usage
  return {
    output: [
      { type: 'error', text: 'nc: invalid arguments' },
      { type: 'info', text: 'Usage: nc [options] <host> <port>' },
      { type: 'info', text: 'Listen: nc -lvp <port>' },
      { type: 'info', text: 'Connect: nc <host> <port>' },
    ]
  }
}

// SSH
function handleSSH(args, currentNode) {
  if (args.length === 0) {
    const availableTargets = getAvailableTargets(currentNode)
    return {
      output: [
        { type: 'error', text: 'Usage: ssh user@host' },
        { type: 'info', text: 'Example: ssh admin@192.168.1.1' },
        { type: 'warning', text: availableTargets.length > 0 ? 
          `💡 Available targets: ${availableTargets.join(', ')}` : 
          '💡 No targets available from current node'
        },
      ]
    }
  }

  const sshTarget = args[0]
  
  // Parse user@host format
  if (!sshTarget.includes('@')) {
    return {
      output: [
        { type: 'error', text: 'ssh: Invalid format' },
        { type: 'info', text: 'Usage: ssh user@host' },
        { type: 'info', text: 'Example: ssh admin@192.168.1.1' },
      ]
    }
  }

  const [username, host] = sshTarget.split('@')
  
  if (!username || !host) {
    return {
      output: [
        { type: 'error', text: 'ssh: Invalid username or host' },
        { type: 'info', text: 'Usage: ssh user@host' },
      ]
    }
  }

  // Validate target IP
  const validation = validateIP(host)
  if (!validation.valid) {
    return {
      output: [
        { type: 'error', text: `ssh: ${validation.error}` },
        { type: 'warning', text: validation.suggestion || '' },
      ]
    }
  }

  const targetNode = validation.node

  // Check if target is reachable from current node
  if (!isConnectedToCurrentNode(targetNode.id, currentNode)) {
    return {
      output: [
        { type: 'error', text: `ssh: No route to host ${host}` },
        { type: 'warning', text: 'Target must be directly connected to current node' },
        { type: 'info', text: `💡 Available targets: ${getAvailableTargets(currentNode).join(', ')}` },
      ]
    }
  }

  // Check if SSH port (22) is open
  const portValidation = validatePort(host, '22')
  if (!portValidation.valid) {
    return {
      output: [
        { type: 'error', text: `ssh: connect to host ${host} port 22: Connection refused` },
        { type: 'warning', text: 'SSH service is not running on this host' },
        { type: 'info', text: `💡 Open ports: ${targetNode.openPorts.join(', ')}` },
      ]
    }
  }

  // Check if target is compromised (needed for SSH access)
  if (!targetNode.compromised) {
    return {
      output: [
        { type: 'error', text: `ssh: Permission denied (publickey,password)` },
        { type: 'warning', text: 'Authentication failed - you need valid credentials' },
        { type: 'info', text: '💡 Try exploiting the target first or use brute force attacks' },
      ]
    }
  }

  // Success
  return {
    output: [
      { type: 'system', text: `Connecting to ${host}...` },
      { type: 'system', text: `The authenticity of host '${host}' can't be established.` },
      { type: 'system', text: 'ECDSA key fingerprint is SHA256:abc123...' },
      { type: 'warning', text: 'Are you sure you want to continue connecting (yes/no)? yes' },
      { type: 'system', text: `Warning: Permanently added '${host}' (ECDSA) to the list of known hosts.` },
      { type: 'success', text: `${username}@${host}'s password: [using compromised credentials]` },
      { type: 'success', text: `Welcome to ${targetNode.os}` },
      { type: 'success', text: `Last login: ${new Date().toLocaleString()}` },
      { type: 'success', text: `🔐 SSH access to ${targetNode.name} established!` },
    ],
    action: 'lateral_movement',
    params: { 
      visibility: 20, 
      timeCost: 30,
      targetNode: targetNode.id,
      username
    }
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
    params: { visibility: 10, timeCost: 20 }  // Use same format as actions.js
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
  const availableTargets = getAvailableTargets(currentNode)
  const currentNodeData = currentNetwork?.nodes.find(n => n.id === currentNode?.id)
  
  const output = [
    { type: 'system', text: '╔═══════════════════════════════════════════════════════════╗' },
    { type: 'system', text: '║              NETWORK NINJA TERMINAL HELP                 ║' },
    { type: 'system', text: '╚═══════════════════════════════════════════════════════════╝' },
    { type: 'info', text: '' },
  ]

  // Show current context
  if (currentNodeData) {
    output.push(
      { type: 'warning', text: `📍 CURRENT LOCATION: ${currentNodeData.name} (${currentNodeData.ip})` },
      { type: 'info', text: `   OS: ${currentNodeData.os}` },
      { type: 'info', text: `   Type: ${currentNodeData.type}` },
      { type: 'info', text: '' }
    )
  }

  // Show available targets
  if (availableTargets.length > 0) {
    output.push(
      { type: 'success', text: `🎯 AVAILABLE TARGETS: ${availableTargets.join(', ')}` },
      { type: 'info', text: '' }
    )
  } else {
    output.push(
      { type: 'warning', text: '⚠️  NO TARGETS AVAILABLE - Move to a different node first' },
      { type: 'info', text: '' }
    )
  }

  output.push(
    { type: 'info', text: '📡 RECONNAISSANCE (Low visibility):' },
    { type: 'success', text: '  ping <target>              Check if host is alive' },
    { type: 'success', text: '  nmap <target>              Basic port scan' },
    { type: 'success', text: '  nmap -sV <target>          Scan with version detection' },
    { type: 'success', text: '  nmap -sS <target>          Stealth scan (less visible)' },
    { type: 'success', text: '  whois <domain>             Domain information' },
    { type: 'info', text: '' },
    { type: 'info', text: '💥 EXPLOITATION (Medium visibility):' },
    { type: 'success', text: '  exploit <target>           Exploit vulnerabilities' },
    { type: 'success', text: '  sqlmap -u <url>            SQL injection attack' },
    { type: 'success', text: '  hydra -l user -P pass <target> <service>  Brute force' },
    { type: 'info', text: '' },
    { type: 'info', text: '🎯 POST-EXPLOITATION (High visibility):' },
    { type: 'success', text: '  nc -lvp <port>             Reverse shell listener' },
    { type: 'success', text: '  nc <host> <port>           Connect to host' },
    { type: 'success', text: '  ssh user@host              SSH connection' },
    { type: 'info', text: '' },
    { type: 'info', text: '📦 DATA EXFILTRATION:' },
    { type: 'success', text: '  cat <file>                 Read file contents' },
    { type: 'success', text: '  grep <pattern> <file>      Search in files' },
    { type: 'success', text: '  find / -name "*.txt"       Search filesystem' },
    { type: 'info', text: '' },
    { type: 'info', text: '🧹 COVERING TRACKS (Reduces visibility):' },
    { type: 'success', text: '  rm <file>                  Delete files' },
    { type: 'success', text: '  history -c                 Clear command history' },
    { type: 'info', text: '' },
    { type: 'info', text: '🛠️ UTILITIES:' },
    { type: 'success', text: '  hint                       Show objective-based hints' },
    { type: 'success', text: '  man <command>              Show command manual' },
    { type: 'success', text: '  ls                         List files' },
    { type: 'success', text: '  clear                      Clear terminal' },
    { type: 'info', text: '' },
    { type: 'info', text: '💡 IMPORTANT RULES:' },
    { type: 'warning', text: '  • Commands require EXACT syntax and valid targets' },
    { type: 'warning', text: '  • IP addresses must exist in the current network' },
    { type: 'warning', text: '  • Ports must be open on the target system' },
    { type: 'warning', text: '  • Targets must be directly connected to current node' },
    { type: 'info', text: '' },
    { type: 'info', text: '🎮 EXAMPLES:' }
  )

  // Add contextual examples based on available targets
  if (availableTargets.length > 0) {
    const exampleTarget = availableTargets[0]
    output.push(
      { type: 'success', text: `  ping ${exampleTarget}` },
      { type: 'success', text: `  nmap -sV ${exampleTarget}` },
      { type: 'success', text: `  exploit ${exampleTarget}` },
      { type: 'success', text: `  ssh admin@${exampleTarget}` }
    )
  } else {
    output.push(
      { type: 'warning', text: '  (No examples available - no targets reachable)' }
    )
  }

  return { output }
}

// HINT - Show objective-based hints
function handleHint(args, currentNode) {
  const availableTargets = getAvailableTargets(currentNode)
  const currentNodeData = currentNetwork?.nodes.find(n => n.id === currentNode?.id)
  
  const output = [
    { type: 'system', text: '💡 CONTEXTUAL HINTS FOR CURRENT SITUATION:' },
    { type: 'info', text: '' },
  ]

  if (!currentNodeData) {
    output.push({ type: 'error', text: '❌ No current node context available' })
    return { output }
  }

  // Current location info
  output.push(
    { type: 'warning', text: `📍 You are on: ${currentNodeData.name} (${currentNodeData.ip})` },
    { type: 'info', text: '' }
  )

  if (availableTargets.length === 0) {
    output.push(
      { type: 'warning', text: '⚠️  NO TARGETS AVAILABLE FROM CURRENT NODE' },
      { type: 'info', text: '💡 Move to a different compromised node to find targets' },
      { type: 'info', text: '💡 Look for nodes marked with ✓ on the network map' }
    )
    return { output }
  }

  // Show available targets with specific hints
  output.push({ type: 'success', text: `🎯 AVAILABLE TARGETS (${availableTargets.length}):` })
  
  availableTargets.forEach(targetIP => {
    const targetNode = currentNetwork.nodes.find(n => n.ip === targetIP)
    if (targetNode) {
      output.push({ type: 'success', text: `   ${targetIP} - ${targetNode.name} (${targetNode.type})` })
      
      // Show specific hints based on target properties
      if (targetNode.compromised) {
        output.push({ type: 'info', text: `     ✅ Already compromised - try SSH: ssh admin@${targetIP}` })
      } else if (targetNode.vulnerabilities.length > 0) {
        output.push({ type: 'warning', text: `     🔍 Has vulnerabilities - try: exploit ${targetIP}` })
      } else {
        output.push({ type: 'info', text: `     🔒 Scan first: nmap -sV ${targetIP}` })
      }
      
      // Port-specific hints
      if (targetNode.openPorts.includes(80) || targetNode.openPorts.includes(443)) {
        output.push({ type: 'info', text: `     🌐 Web service - try: sqlmap -u "http://${targetIP}"` })
      }
      if (targetNode.openPorts.includes(22)) {
        output.push({ type: 'info', text: `     🔐 SSH available - try brute force if compromised` })
      }
    }
  })

  output.push(
    { type: 'info', text: '' },
    { type: 'info', text: '🎯 GENERAL STRATEGY:' },
    { type: 'success', text: '1. Scan targets: nmap -sV <target>' },
    { type: 'success', text: '2. Exploit vulnerabilities: exploit <target>' },
    { type: 'success', text: '3. Establish access: ssh user@<target>' },
    { type: 'success', text: '4. Find data: cat, grep, find commands' },
    { type: 'success', text: '5. Cover tracks: rm, history -c' },
    { type: 'info', text: '' },
    { type: 'warning', text: '💡 Remember: All commands require exact syntax!' },
    { type: 'warning', text: '💡 Use "help" to see command examples' }
  )

  return { output }
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

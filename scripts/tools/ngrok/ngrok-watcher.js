const { updateApiBaseUrl, getNgrokUrl } = require('./update-ngrok-url.js');

// Configuration
const WATCHER_CONFIG = {
  CHECK_INTERVAL: 5000, // Check every 5 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
};

let currentUrl = null;
let isRunning = false;
let retryCount = 0;
let lastUpdateTime = null;

// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const emoji = {
    debug: '🔍',
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  if (WATCHER_CONFIG.LOG_LEVEL === 'debug' || type !== 'debug') {
    console.log(`${emoji[type]} [${timestamp}] ${message}`);
  }
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'never';
  const now = new Date();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`;
  return `${seconds}s ago`;
};

const checkNgrokStatus = async () => {
  try {
    const url = await getNgrokUrl();
    
    if (url !== currentUrl) {
      log(`🌐 Ngrok URL changed: ${currentUrl || 'none'} → ${url}`, 'info');
      currentUrl = url;
      
      // Update files with new URL
      log('🔄 Updating configuration files...', 'info');
      const result = await updateApiBaseUrl();
      
      if (result.success) {
        lastUpdateTime = new Date();
        retryCount = 0;
        log(`✅ Files updated successfully! Last update: ${formatTimeAgo(lastUpdateTime)}`, 'success');
      } else {
        log(`❌ Failed to update files: ${result.error}`, 'error');
      }
    } else {
      log(`🔍 Ngrok URL unchanged: ${url} (last update: ${formatTimeAgo(lastUpdateTime)})`, 'debug');
    }
    
    return true;
  } catch (error) {
    retryCount++;
    log(`⚠️ Check attempt ${retryCount} failed: ${error.message}`, 'warning');
    
    if (retryCount >= WATCHER_CONFIG.MAX_RETRIES) {
      log(`❌ Max retries reached (${WATCHER_CONFIG.MAX_RETRIES}). Stopping watcher.`, 'error');
      return false;
    }
    
    // Wait before retry
    await sleep(WATCHER_CONFIG.RETRY_DELAY);
    return true;
  }
};

const startWatcher = async () => {
  if (isRunning) {
    log('⚠️ Watcher is already running', 'warning');
    return;
  }
  
  isRunning = true;
  log('🚀 Starting ngrok URL watcher...', 'info');
  log(`⏱️  Check interval: ${WATCHER_CONFIG.CHECK_INTERVAL / 1000}s`, 'info');
  log(`🔄 Max retries: ${WATCHER_CONFIG.MAX_RETRIES}`, 'info');
  log('💡 Press Ctrl+C to stop the watcher', 'info');
  log('─'.repeat(50), 'info');
  
  // Initial check
  await checkNgrokStatus();
  
  // Set up interval
  const intervalId = setInterval(async () => {
    if (!isRunning) {
      clearInterval(intervalId);
      return;
    }
    
    const shouldContinue = await checkNgrokStatus();
    if (!shouldContinue) {
      stopWatcher();
    }
  }, WATCHER_CONFIG.CHECK_INTERVAL);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\n🛑 Received SIGINT, shutting down gracefully...', 'info');
    stopWatcher();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\n🛑 Received SIGTERM, shutting down gracefully...', 'info');
    stopWatcher();
    process.exit(0);
  });
  
  return intervalId;
};

const stopWatcher = () => {
  if (!isRunning) {
    log('⚠️ Watcher is not running', 'warning');
    return;
  }
  
  isRunning = false;
  log('🛑 Stopping ngrok URL watcher...', 'info');
  
  if (lastUpdateTime) {
    log(`📊 Final stats:`, 'info');
    log(`   • Last update: ${formatTimeAgo(lastUpdateTime)}`, 'info');
    log(`   • Current URL: ${currentUrl || 'none'}`, 'info');
    log(`   • Total retries: ${retryCount}`, 'info');
  }
  
  log('👋 Watcher stopped', 'info');
};

const showStatus = () => {
  log('📊 Ngrok Watcher Status:', 'info');
  log(`   • Running: ${isRunning ? 'Yes' : 'No'}`, 'info');
  log(`   • Current URL: ${currentUrl || 'None'}`, 'info');
  log(`   • Last Update: ${formatTimeAgo(lastUpdateTime)}`, 'info');
  log(`   • Retry Count: ${retryCount}`, 'info');
  log(`   • Check Interval: ${WATCHER_CONFIG.CHECK_INTERVAL / 1000}s`, 'info');
};

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔄 Ngrok URL Watcher

Automatically monitors ngrok for URL changes and updates configuration files.

Usage:
  node ngrok-watcher.js [options]

Options:
  --help, -h          Show this help message
  --status            Show current watcher status
  --interval <ms>     Set check interval in milliseconds (default: 5000)
  --debug             Enable debug logging
  --once              Run once and exit (don't watch continuously)

Examples:
  node ngrok-watcher.js                    # Start continuous watching
  node ngrok-watcher.js --once             # Check once and exit
  node ngrok-watcher.js --interval 10000   # Check every 10 seconds
  node ngrok-watcher.js --debug            # Enable debug logging
  node ngrok-watcher.js --status           # Show current status

Configuration:
  Check Interval: ${WATCHER_CONFIG.CHECK_INTERVAL}ms
  Max Retries: ${WATCHER_CONFIG.MAX_RETRIES}
  Retry Delay: ${WATCHER_CONFIG.RETRY_DELAY}ms
`);
    process.exit(0);
  }
  
  if (args.includes('--status')) {
    showStatus();
    process.exit(0);
  }
  
  if (args.includes('--interval')) {
    const intervalIndex = args.indexOf('--interval');
    const interval = parseInt(args[intervalIndex + 1]);
    if (isNaN(interval) || interval < 1000) {
      log('❌ Invalid interval. Must be at least 1000ms', 'error');
      process.exit(1);
    }
    WATCHER_CONFIG.CHECK_INTERVAL = interval;
    log(`⏱️  Check interval set to ${interval}ms`, 'info');
  }
  
  if (args.includes('--debug')) {
    WATCHER_CONFIG.LOG_LEVEL = 'debug';
    log('🔍 Debug logging enabled', 'info');
  }
  
  if (args.includes('--once')) {
    log('🔄 Running single check...', 'info');
    checkNgrokStatus()
      .then(() => {
        log('✅ Single check completed', 'success');
        process.exit(0);
      })
      .catch(error => {
        log(`❌ Single check failed: ${error.message}`, 'error');
        process.exit(1);
      });
  } else {
    // Start continuous watching
    startWatcher().catch(error => {
      log(`❌ Failed to start watcher: ${error.message}`, 'error');
      process.exit(1);
    });
  }
}

// Export for use in other modules
module.exports = {
  startWatcher,
  stopWatcher,
  showStatus,
  checkNgrokStatus,
  WATCHER_CONFIG
};

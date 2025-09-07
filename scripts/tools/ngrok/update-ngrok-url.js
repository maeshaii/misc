const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const CONFIG = {
  NGROK_API_URL: 'http://127.0.0.1:4040/api/tunnels',
  FILES_TO_UPDATE: [
    {
      path: path.join(__dirname, '..', '..', '..', '..', 'mobile', 'app.json'),
      type: 'json',
      key: 'expo.extra.API_BASE_URL'
    },
    {
      path: path.join(__dirname, '..', '..', '..', '..', 'mobile', 'services', 'api.ts'),
      type: 'typescript',
      pattern: /(export\s+const\s+API_BASE_URL\s*=\s*normalizeBaseUrl\()([^)]+)(\))/,
      replacement: (url) => `$1'${url}'$3`
    },
    {
      path: path.join(__dirname, '..', '..', '..', '..', 'frontend', 'src', 'services', 'api.ts'),
      type: 'typescript',
      pattern: /(const\s+API_BASE\s*=\s*process\.env\.REACT_APP_API_URL\s*\|\|\s*['"`])([^'"`]+)(['"`])/,
      replacement: (url) => `$1${url}$3`
    }
  ],
  FALLBACK_URL: 'http://localhost:8000',
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Utility functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
};

const updateJsonFile = (filePath, keyPath, newValue) => {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = keyPath.split('.');
    let current = content;
    
    // Navigate to the nested key
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    current[lastKey] = newValue;
    
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    return true;
  } catch (error) {
    log(`Failed to update JSON file ${filePath}: ${error.message}`, 'error');
    return false;
  }
};

const updateTypeScriptFile = (filePath, pattern, replacement) => {
  try {
    if (!fs.existsSync(filePath)) {
      log(`File not found: ${filePath}`, 'warning');
      return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      fs.writeFileSync(filePath, content);
      return true;
    } else {
      log(`Pattern not found in ${filePath}`, 'warning');
      return false;
    }
  } catch (error) {
    log(`Failed to update TypeScript file ${filePath}: ${error.message}`, 'error');
    return false;
  }
};

const getNgrokUrl = async (retryCount = 0) => {
  try {
    const response = await axios.get(CONFIG.NGROK_API_URL, {
      timeout: 5000
    });
    
    const tunnel = response.data.tunnels.find(t => t.proto === 'https');
    if (!tunnel) {
      throw new Error('No HTTPS tunnel found');
    }
    
    return tunnel.public_url;
  } catch (error) {
    if (retryCount < CONFIG.RETRY_ATTEMPTS) {
      log(`Attempt ${retryCount + 1} failed, retrying in ${CONFIG.RETRY_DELAY}ms...`, 'warning');
      await sleep(CONFIG.RETRY_DELAY);
      return getNgrokUrl(retryCount + 1);
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ngrok is not running. Please start ngrok first.');
    }
    
    throw error;
  }
};

const updateFiles = async (ngrokUrl) => {
  let successCount = 0;
  let totalCount = CONFIG.FILES_TO_UPDATE.length;
  
  for (const fileConfig of CONFIG.FILES_TO_UPDATE) {
    try {
      let success = false;
      
      if (fileConfig.type === 'json') {
        success = updateJsonFile(fileConfig.path, fileConfig.key, ngrokUrl);
      } else if (fileConfig.type === 'typescript') {
        success = updateTypeScriptFile(
          fileConfig.path, 
          fileConfig.pattern, 
          fileConfig.replacement(ngrokUrl)
        );
      }
      
      if (success) {
        successCount++;
        log(`Updated ${path.relative(__dirname, fileConfig.path)}`, 'success');
      }
    } catch (error) {
      log(`Failed to update ${path.relative(__dirname, fileConfig.path)}: ${error.message}`, 'error');
    }
  }
  
  return { successCount, totalCount };
};

const createBackup = () => {
  const backupDir = path.join(__dirname, '.ngrok-backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
  
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      files: CONFIG.FILES_TO_UPDATE.map(f => ({
        path: f.path,
        exists: fs.existsSync(f.path),
        content: fs.existsSync(f.path) ? fs.readFileSync(f.path, 'utf8') : null
      }))
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    log(`Backup created: ${backupFile}`, 'info');
    return backupFile;
  } catch (error) {
    log(`Failed to create backup: ${error.message}`, 'warning');
    return null;
  }
};

// Main function
async function updateApiBaseUrl() {
  try {
    log('Starting ngrok URL update process...', 'info');
    
    // Create backup before making changes
    const backupFile = createBackup();
    
    // Get current ngrok URL
    log('Fetching ngrok tunnel information...', 'info');
    const ngrokUrl = await getNgrokUrl();
    log(`Found ngrok URL: ${ngrokUrl}`, 'success');
    
    // Update all configured files
    log('Updating configuration files...', 'info');
    const { successCount, totalCount } = await updateFiles(ngrokUrl);
    
    if (successCount === totalCount) {
      log(`✅ Successfully updated ${successCount}/${totalCount} files`, 'success');
      log(`🌐 API Base URL set to: ${ngrokUrl}`, 'success');
      
      if (backupFile) {
        log(`💾 Backup saved to: ${backupFile}`, 'info');
      }
    } else {
      log(`⚠️ Partially updated ${successCount}/${totalCount} files`, 'warning');
    }
    
    return {
      success: true,
      ngrokUrl,
      updatedFiles: successCount,
      totalFiles: totalCount,
      backupFile
    };
    
  } catch (error) {
    log(`Failed to update API Base URL: ${error.message}`, 'error');
    
    if (error.message.includes('Ngrok is not running')) {
      log('💡 To start ngrok, run: ngrok http 8000', 'info');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌐 Ngrok URL Updater

Usage:
  node update-ngrok-url.js [options]

Options:
  --help, -h          Show this help message
  --current           Show current ngrok URL without updating files
  --backup            Create backup only
  --restore <file>    Restore from backup file

Examples:
  node update-ngrok-url.js                    # Update all files with current ngrok URL
  node update-ngrok-url.js --current          # Show current ngrok URL
  node update-ngrok-url.js --backup           # Create backup only
  node update-ngrok-url.js --restore backup-2024-01-15T10-30-00-000Z.json
`);
    process.exit(0);
  }
  
  if (args.includes('--current')) {
    getNgrokUrl()
      .then(url => {
        log(`Current ngrok URL: ${url}`, 'info');
        process.exit(0);
      })
      .catch(error => {
        log(`Error: ${error.message}`, 'error');
        process.exit(1);
      });
  } else if (args.includes('--backup')) {
    createBackup();
    process.exit(0);
  } else if (args.includes('--restore')) {
    const restoreFile = args[args.indexOf('--restore') + 1];
    if (!restoreFile) {
      log('Please specify a backup file to restore from', 'error');
      process.exit(1);
    }
    // TODO: Implement restore functionality
    log('Restore functionality coming soon...', 'info');
    process.exit(0);
  } else {
    updateApiBaseUrl()
      .then(result => {
        process.exit(result.success ? 0 : 1);
      })
      .catch(error => {
        log(`Unexpected error: ${error.message}`, 'error');
        process.exit(1);
      });
  }
}

// Export for use in other modules
module.exports = { 
  updateApiBaseUrl, 
  getNgrokUrl, 
  createBackup,
  CONFIG 
}; 
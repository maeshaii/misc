# 🌐 Ngrok Automation System - WNY Capstone

A professional-grade automation system that automatically updates your API configuration files whenever your ngrok URL changes. Built with senior-level engineering practices including error handling, backup management, and multiple deployment options.

## 🚀 Features

- **🔄 Automatic Updates**: Automatically detects ngrok URL changes and updates all configuration files
- **📁 Multi-File Support**: Updates `app.json`, `services/api.ts`, and other TypeScript files
- **💾 Backup System**: Creates automatic backups before making changes
- **🛡️ Error Handling**: Robust error handling with retry mechanisms
- **📊 Monitoring**: Real-time status monitoring and logging
- **🖥️ Cross-Platform**: Works on Windows, macOS, and Linux
- **⚡ Multiple Modes**: One-time updates, continuous watching, and debug modes

## 📋 Prerequisites

- Node.js 18+ installed
- ngrok installed and running
- Your backend server running on port 8000

## 🛠️ Installation

### 1. Install Dependencies

```bash
# From the root directory
npm install

# Or use the automated setup
npm run setup
```

### 2. Verify ngrok is Running

```bash
# Start ngrok (if not already running)
ngrok http 8000
```

## 🎯 Usage

### Quick Start

#### Option 1: Update Once
```bash
npm run ngrok:update
# or
node update-ngrok-url.js
```

#### Option 2: Continuous Watching
```bash
npm run ngrok:watch
# or
node ngrok-watcher.js
```

### Advanced Usage

#### Check Current Status
```bash
npm run ngrok:status
# or
node update-ngrok-url.js --current
```

#### Create Backup
```bash
npm run ngrok:backup
# or
node update-ngrok-url.js --backup
```

#### Debug Mode
```bash
npm run ngrok:debug
# or
node ngrok-watcher.js --debug
```

#### Custom Check Interval
```bash
node ngrok-watcher.js --interval 10000  # Check every 10 seconds
```

## 🖥️ Windows Automation

### Batch File (Easy)
Double-click `start-ngrok-automation.bat` for an interactive menu.

### PowerShell (Advanced)
```powershell
# Run with execution policy bypass
powershell -ExecutionPolicy Bypass -File start-ngrok-automation.ps1

# Or with specific parameters
.\start-ngrok-automation.ps1 -Watch
.\start-ngrok-automation.ps1 -Update
.\start-ngrok-automation.ps1 -Status
```

## 📁 Files Updated

The system automatically updates these files:

1. **`mobile-wny/app.json`** - Expo configuration
2. **`mobile-wny/services/api.ts`** - Mobile API configuration
3. **`frontend-wny/src/services/api.ts`** - Web frontend API configuration

## 🔧 Configuration

### Customizing File Updates

Edit `update-ngrok-url.js` and modify the `CONFIG.FILES_TO_UPDATE` array:

```javascript
const CONFIG = {
  FILES_TO_UPDATE: [
    {
      path: path.join(__dirname, 'mobile-wny', 'app.json'),
      type: 'json',
      key: 'expo.extra.API_BASE_URL'
    },
    // Add more files here...
  ]
};
```

### Watcher Settings

Edit `ngrok-watcher.js` and modify `WATCHER_CONFIG`:

```javascript
const WATCHER_CONFIG = {
  CHECK_INTERVAL: 5000,    // Check every 5 seconds
  MAX_RETRIES: 3,          // Max retry attempts
  RETRY_DELAY: 2000,       // Delay between retries
  LOG_LEVEL: 'info'        // 'debug', 'info', 'warn', 'error'
};
```

## 📊 Monitoring & Logs

### Log Levels
- **🔍 Debug**: Detailed information for troubleshooting
- **ℹ️ Info**: General information about operations
- **⚠️ Warning**: Non-critical issues
- **❌ Error**: Critical errors that need attention

### Status Information
```bash
npm run ngrok:status
```

Shows:
- Current ngrok URL
- Last update time
- File update status
- Error information (if any)

## 🚨 Troubleshooting

### Common Issues

#### 1. "Ngrok is not running"
```bash
# Start ngrok
ngrok http 8000
```

#### 2. "Permission denied" on Windows
```powershell
# Run PowerShell as Administrator
# Or use the batch file instead
start-ngrok-automation.bat
```

#### 3. Files not updating
- Check if ngrok is running on port 4040
- Verify file paths in configuration
- Check file permissions

#### 4. Backup restoration
```bash
# Manual restoration from backup files
# Backups are stored in .ngrok-backup/ directory
```

### Debug Mode
```bash
node ngrok-watcher.js --debug
```

This provides detailed logging for troubleshooting.

## 🔄 Workflow Integration

### Development Workflow
1. Start your backend server (`python manage.py runserver`)
2. Start ngrok (`ngrok http 8000`)
3. Run the automation (`npm run ngrok:watch`)
4. Develop with automatic URL updates

### CI/CD Integration
```bash
# In your deployment scripts
npm run ngrok:update
```

### Team Development
- Share the automation scripts with your team
- Use the same ngrok setup for consistent testing
- Backup configurations before major changes

## 📚 API Reference

### update-ngrok-url.js

#### Functions
- `updateApiBaseUrl()` - Main update function
- `getNgrokUrl()` - Fetch current ngrok URL
- `createBackup()` - Create configuration backup

#### CLI Options
- `--help` - Show help
- `--current` - Show current URL only
- `--backup` - Create backup only

### ngrok-watcher.js

#### Functions
- `startWatcher()` - Start continuous monitoring
- `stopWatcher()` - Stop monitoring
- `checkNgrokStatus()` - Check and update if needed

#### CLI Options
- `--help` - Show help
- `--once` - Run once and exit
- `--debug` - Enable debug logging
- `--interval <ms>` - Set check interval
- `--status` - Show current status

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ngrok tunnel  │───▶│  update-ngrok-   │───▶│  Configuration  │
│   (port 4040)   │    │  url.js          │    │     Files       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ ngrok-watcher.js │
                       │ (continuous)     │
                       └──────────────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Run in debug mode: `npm run ngrok:debug`
3. Check the logs for error messages
4. Verify ngrok is running correctly
5. Check file permissions and paths

## 🔮 Future Enhancements

- [ ] Restore functionality from backups
- [ ] Web interface for monitoring
- [ ] Email/Slack notifications
- [ ] Multiple ngrok tunnel support
- [ ] Configuration file validation
- [ ] Integration with other tunneling services

---

**Built with ❤️ by the WNY Capstone Team**

*For questions or support, please refer to the troubleshooting section or create an issue in the repository.*

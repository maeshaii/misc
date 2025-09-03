# 🛠️ WNY Tools

Shared tools and scripts for the WNY Capstone Project.

## 📁 Structure

```
tools/
├── ngrok/                    # Ngrok automation scripts
│   ├── ngrok-watcher.js     # Continuous ngrok URL monitoring
│   ├── update-ngrok-url.js  # Update ngrok URLs in config files
│   ├── start-ngrok-automation.bat    # Windows batch automation
│   └── start-ngrok-automation.ps1    # PowerShell automation
└── package.json              # Dependencies and scripts
```

## 🚀 Quick Start

### Installation
```bash
cd tools
npm install
```

### Available Scripts
```bash
# Update ngrok URL once
npm run ngrok:update

# Start continuous monitoring
npm run ngrok:watch

# Check current status
npm run ngrok:status

# Create backup
npm run ngrok:backup

# Run with debug logging
npm run ngrok:debug
```

## 🔧 Usage in Projects

### As a Submodule
This repository is designed to be used as a Git submodule in your main projects:

```bash
# Add as submodule
git submodule add <tools-repo-url> tools

# Update submodule
git submodule update --remote tools

# Initialize submodule (after cloning)
git submodule init
git submodule update
```

### Direct Usage
You can also use the scripts directly:

```bash
# From the tools directory
node ngrok/update-ngrok-url.js

# From parent directory
node tools/ngrok/update-ngrok-url.js
```

## 📱 Integration

### Backend (Django)
- Add as submodule to `backend-wny/tools/`
- Use scripts for API endpoint management

### Mobile (React Native)
- Add as submodule to `mobile-wny/tools/`
- Use scripts for mobile API configuration updates

### Frontend (React)
- Add as submodule to `frontend-wny/tools/`
- Use scripts for frontend API configuration

## 🔄 Ngrok Automation

The ngrok scripts automatically:
1. **Detect ngrok URL changes**
2. **Update configuration files** in all projects
3. **Create backups** before making changes
4. **Provide monitoring** and debugging options

## 📋 Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0
- ngrok installed and running

## 🤝 Contributing

1. Make changes to the tools
2. Commit and push to the tools repository
3. Update submodules in all projects
4. Test the changes across all environments

---

**WNY Team** - Capstone Project 2025

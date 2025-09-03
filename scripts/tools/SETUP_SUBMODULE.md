# 🔧 Setting Up Tools as Submodule

This guide explains how to add the `wny-tools` repository as a submodule to your existing projects.

## 📋 Prerequisites

1. **Create the tools repository** on GitHub/GitLab
2. **Push the tools code** to the remote repository
3. **Have access** to your existing repositories

## 🚀 Step-by-Step Setup

### 1. Create Tools Repository

First, create a new repository on GitHub/GitLab:
- **Name**: `wny-tools`
- **Description**: Shared tools and scripts for WNY Capstone Project
- **Visibility**: Private (recommended for team projects)

### 2. Push Tools to Remote

```bash
cd tools
git init
git add .
git commit -m "Initial commit: WNY Tools repository"
git branch -M main
git remote add origin <your-tools-repo-url>
git push -u origin main
```

### 3. Add as Submodule to Backend

```bash
cd backend-wny
git submodule add <your-tools-repo-url> tools
git add .gitmodules tools/
git commit -m "Add wny-tools as submodule"
git push
```

### 4. Add as Submodule to Mobile

```bash
cd mobile-wny
git submodule add <your-tools-repo-url> tools
git add .gitmodules tools/
git commit -m "Add wny-tools as submodule"
git push
```

### 5. Add as Submodule to Frontend

```bash
cd frontend-wny
git submodule add <your-tools-repo-url> tools
git add .gitmodules tools/
git commit -m "Add wny-tools as submodule"
git push
```

## 🔄 Updating Submodules

### Update All Submodules
```bash
# From any project directory
git submodule update --remote

# Or update specific submodule
git submodule update --remote tools
```

### After Cloning Projects
```bash
# Clone with submodules
git clone --recurse-submodules <project-url>

# Or initialize after cloning
git clone <project-url>
cd <project-name>
git submodule init
git submodule update
```

## 📱 Postinstall Hooks

### Backend (Django)
Add to `backend-wny/package.json`:
```json
{
  "scripts": {
    "postinstall": "cd tools && npm install"
  }
}
```

### Mobile (React Native)
Add to `mobile-wny/package.json`:
```json
{
  "scripts": {
    "postinstall": "cd tools && npm install && node tools/ngrok/update-ngrok-url.js"
  }
}
```

### Frontend (React)
Add to `frontend-wny/package.json`:
```json
{
  "scripts": {
    "postinstall": "cd tools && npm install"
  }
}
```

## 🎯 Usage Examples

### From Backend
```bash
cd backend-wny
npm run ngrok:update    # Uses tools submodule
```

### From Mobile
```bash
cd mobile-wny
npm run ngrok:update    # Uses tools submodule
```

### Direct Script Usage
```bash
# From any project directory
node tools/ngrok/update-ngrok-url.js
node tools/ngrok/ngrok-watcher.js
```

## 🔍 Troubleshooting

### Submodule Not Found
```bash
git submodule init
git submodule update
```

### Submodule Out of Date
```bash
git submodule update --remote
```

### Submodule Changes Not Committed
```bash
cd tools
git add .
git commit -m "Update tools"
cd ..
git add tools
git commit -m "Update tools submodule"
```

## 📚 Benefits of This Approach

1. **Single Source of Truth**: Tools maintained in one place
2. **Easy Updates**: Update once, propagate to all projects
3. **Version Control**: Each project can pin to specific tool versions
4. **Team Collaboration**: Everyone uses the same tools
5. **Clean History**: No duplicate code in repositories

---

**WNY Team** - Capstone Project 2025

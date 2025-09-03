@echo off
chcp 65001 >nul
title Ngrok Automation - WNY Capstone

echo.
echo 🌐 WNY Capstone - Ngrok Automation
echo ======================================
echo.

:menu
echo Choose an option:
echo.
echo 1. Update ngrok URL once
echo 2. Start continuous watching
echo 3. Show current ngrok status
echo 4. Create backup
echo 5. Run with debug logging
echo 6. Install dependencies
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto update-once
if "%choice%"=="2" goto start-watching
if "%choice%"=="3" goto show-status
if "%choice%"=="4" goto create-backup
if "%choice%"=="5" goto debug-mode
if "%choice%"=="6" goto install-deps
if "%choice%"=="7" goto exit
echo Invalid choice. Please try again.
goto menu

:update-once
echo.
echo 🔄 Updating ngrok URL once...
node update-ngrok-url.js
echo.
pause
goto menu

:start-watching
echo.
echo 🚀 Starting continuous ngrok URL watching...
echo Press Ctrl+C to stop the watcher
echo.
node ngrok-watcher.js
echo.
pause
goto menu

:show-status
echo.
echo 📊 Checking current ngrok status...
node update-ngrok-url.js --current
echo.
pause
goto menu

:create-backup
echo.
echo 💾 Creating backup of current configuration...
node update-ngrok-url.js --backup
echo.
pause
goto menu

:debug-mode
echo.
echo 🔍 Starting ngrok watcher with debug logging...
echo Press Ctrl+C to stop the watcher
echo.
node ngrok-watcher.js --debug
echo.
pause
goto menu

:install-deps
echo.
echo 📦 Installing dependencies...
npm install
echo.
echo ✅ Dependencies installed successfully!
echo.
pause
goto menu

:exit
echo.
echo 👋 Goodbye!
echo.
pause
exit

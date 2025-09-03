# PowerShell script for Ngrok Automation - WNY Capstone
# Run with: powershell -ExecutionPolicy Bypass -File start-ngrok-automation.ps1

param(
    [switch]$Update,
    [switch]$Watch,
    [switch]$Status,
    [switch]$Backup,
    [switch]$Debug,
    [switch]$Install,
    [switch]$Help
)

# Set console encoding for emoji support
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Function to display colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to display header
function Show-Header {
    Clear-Host
    Write-ColorOutput "🌐 WNY Capstone - Ngrok Automation" "Cyan"
    Write-ColorOutput "======================================" "Cyan"
    Write-Host ""
}

# Function to show menu
function Show-Menu {
    Show-Header
    Write-ColorOutput "Choose an option:" "Yellow"
    Write-Host ""
    Write-ColorOutput "1. Update ngrok URL once" "White"
    Write-ColorOutput "2. Start continuous watching" "White"
    Write-ColorOutput "3. Show current ngrok status" "White"
    Write-ColorOutput "4. Create backup" "White"
    Write-ColorOutput "5. Run with debug logging" "White"
    Write-ColorOutput "6. Install dependencies" "White"
    Write-ColorOutput "7. Exit" "White"
    Write-Host ""
}

# Function to update ngrok URL once
function Update-NgrokOnce {
    Write-ColorOutput "🔄 Updating ngrok URL once..." "Yellow"
    try {
        node update-ngrok-url.js
        Write-ColorOutput "✅ Update completed successfully!" "Green"
    } catch {
        Write-ColorOutput "❌ Update failed: $($_.Exception.Message)" "Red"
    }
    Read-Host "Press Enter to continue..."
}

# Function to start continuous watching
function Start-NgrokWatching {
    Write-ColorOutput "🚀 Starting continuous ngrok URL watching..." "Yellow"
    Write-ColorOutput "Press Ctrl+C to stop the watcher" "Cyan"
    Write-Host ""
    try {
        node ngrok-watcher.js
    } catch {
        Write-ColorOutput "❌ Watcher failed: $($_.Exception.Message)" "Red"
    }
    Read-Host "Press Enter to continue..."
}

# Function to show status
function Show-NgrokStatus {
    Write-ColorOutput "📊 Checking current ngrok status..." "Yellow"
    try {
        node update-ngrok-url.js --current
    } catch {
        Write-ColorOutput "❌ Status check failed: $($_.Exception.Message)" "Red"
    }
    Read-Host "Press Enter to continue..."
}

# Function to create backup
function Create-NgrokBackup {
    Write-ColorOutput "💾 Creating backup of current configuration..." "Yellow"
    try {
        node update-ngrok-url.js --backup
        Write-ColorOutput "✅ Backup created successfully!" "Green"
    } catch {
        Write-ColorOutput "❌ Backup failed: $($_.Exception.Message)" "Red"
    }
    Read-Host "Press Enter to continue..."
}

# Function to run debug mode
function Start-NgrokDebug {
    Write-ColorOutput "🔍 Starting ngrok watcher with debug logging..." "Yellow"
    Write-ColorOutput "Press Ctrl+C to stop the watcher" "Cyan"
    Write-Host ""
    try {
        node ngrok-watcher.js --debug
    } catch {
        Write-ColorOutput "❌ Debug watcher failed: $($_.Exception.Message)" "Red"
    }
    Read-Host "Press Enter to continue..."
}

# Function to install dependencies
function Install-Dependencies {
    Write-ColorOutput "📦 Installing dependencies..." "Yellow"
    try {
        npm install
        Write-ColorOutput "✅ Dependencies installed successfully!" "Green"
    } catch {
        Write-ColorOutput "❌ Installation failed: $($_.Exception.Message)" "Red"
    }
    Read-Host "Press Enter to continue..."
}

# Function to show help
function Show-Help {
    Show-Header
    Write-ColorOutput "Usage:" "Yellow"
    Write-Host ""
    Write-ColorOutput "PowerShell script:" "White"
    Write-ColorOutput "  .\start-ngrok-automation.ps1" "Cyan"
    Write-Host ""
    Write-ColorOutput "With parameters:" "White"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Update" "Cyan"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Watch" "Cyan"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Status" "Cyan"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Backup" "Cyan"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Debug" "Cyan"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Install" "Cyan"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Help" "Cyan"
    Write-Host ""
    Write-ColorOutput "Examples:" "Yellow"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Watch    # Start continuous watching" "White"
    Write-ColorOutput "  .\start-ngrok-automation.ps1 -Update   # Update once and exit" "White"
    Write-Host ""
    Read-Host "Press Enter to continue..."
}

# Main execution logic
if ($Help) {
    Show-Help
    exit 0
}

if ($Update) {
    Update-NgrokOnce
    exit 0
}

if ($Watch) {
    Start-NgrokWatching
    exit 0
}

if ($Status) {
    Show-NgrokStatus
    exit 0
}

if ($Backup) {
    Create-NgrokBackup
    exit 0
}

if ($Debug) {
    Start-NgrokDebug
    exit 0
}

if ($Install) {
    Install-Dependencies
    exit 0
}

# Interactive menu mode
do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-7)"
    
    switch ($choice) {
        "1" { Update-NgrokOnce }
        "2" { Start-NgrokWatching }
        "3" { Show-NgrokStatus }
        "4" { Create-NgrokBackup }
        "5" { Start-NgrokDebug }
        "6" { Install-Dependencies }
        "7" { 
            Write-ColorOutput "👋 Goodbye!" "Green"
            exit 0 
        }
        default { 
            Write-ColorOutput "Invalid choice. Please try again." "Red"
            Start-Sleep -Seconds 1
        }
    }
} while ($true)

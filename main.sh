#!/bin/bash

# Function to install Node.js and npm for Linux
install_node_linux() {
    echo "Installing Node.js and npm for Linux..."
    sudo apt-get update
    sudo apt-get install -y nodejs npm
}

# Function to install Node.js and npm for macOS
install_node_macos() {
    echo "Installing Node.js and npm for macOS..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    brew install node
}

# Check if Node.js and npm are installed
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "Node.js and npm not found. Attempting to install..."
    
    # Detect the operating system
    OS="$(uname -s)"
    case "${OS}" in
        Linux*)     install_node_linux;;
        Darwin*)    install_node_macos;;
        *)          echo "Unsupported operating system: ${OS}"; exit 1;;
    esac
fi

# Check if zx is installed
if ! command -v zx >/dev/null 2>&1; then
    echo "Installing zx..."
    npm install -g zx
fi


chmod +x ./script.mjs
zx ./script.mjs
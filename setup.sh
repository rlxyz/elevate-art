#!/usr/bin/env bash

# First check OS.
OS="$(uname)"
if [[ "${OS}" == "Darwin" ]]; then
    HOMEBREW_ON_MACOS=1
else
    abort "Development environment is only supported on macOS"
fi

# If MacOS, check for Homebrew.
if [[ -n "${HOMEBREW_ON_MACOS-}" ]]; then
    # Install Homebrew if not installed.
    if ! command -v brew &>/dev/null; then
        echo "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo "Homebrew already installed. Skipping..."
    fi

    HOMEBREW_INSTALLED=1
fi

# If Homebrew is installed, check for dependencies.
# - doppler; secret key management
if [[ -n "${HOMEBREW_INSTALLED-}" ]]; then
    # Check if gnupg installed
    if ! command -v gpg &>/dev/null; then
        echo "Installing gnupg..."
        brew install gnupg
    else
        echo "gnupg already installed. Skipping..."
    fi

    # Check if Doppler Exists
    if ! command -v doppler &>/dev/null; then
        echo "Installing Doppler..."
        brew install dopplerhq/cli/doppler
    else
        echo "Doppler already installed. Skipping..."
    fi
fi

# If Doppler Exists
if command -v doppler &>/dev/null; then
    doppler login
fi

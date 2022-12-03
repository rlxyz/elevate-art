#!/usr/bin/env bash

# string formatters
if [ -t 1 ]; then
    tty_escape() { printf "\033[%sm" "$1"; }
else
    tty_escape() { :; }
fi
tty_mkbold() { tty_escape "1;$1"; }
tty_blue="$(tty_mkbold 34)"
tty_bold="$(tty_mkbold 39)"
tty_reset="$(tty_escape 0)"

logger() {
    printf "${tty_blue}==>${tty_bold} %s${tty_reset}\n" "$1"
}

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
        logger "Homebrew already installed. Skipping..."
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
        logger "gnupg already installed. Skipping..."
    fi

    # Check if Doppler Exists
    if ! command -v doppler &>/dev/null; then
        echo "Installing Doppler..."
        brew install dopplerhq/cli/doppler
    else
        logger "Doppler already installed. Skipping..."
    fi
fi

# If Doppler Exists
if command -v doppler &>/dev/null; then
    doppler login
fi

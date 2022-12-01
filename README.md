# rlxyz-compiler-client

## Installation

### Automatic Installation (recommended)

1. Run the `setup.sh` script which automatically installs Doppler CLI and sets up your environment variables

```zsh
yarn setup
```

### Manual Installation

1. Install Doppler CLI - our localhost environment variable manager (see [Doppler CLI](https://docs.doppler.com/docs/install-cli))

```zsh
# Prerequisite. gnupg is required for binary signature verification
brew install gnupg

# Next, install using brew (use `doppler update` for subsequent updates)
brew install dopplerhq/cli/doppler

# Login to Doppler
doppler login
```

## Architecture

1. tRPC

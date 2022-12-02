# rlxyz-compiler-client

## Installation

1. Install [pnpm](https://pnpm.io/) to manage dependencies. Why? When using npm, if you have 100 projects using a dependency, you will have 100 copies of that dependency saved on disk. With pnpm, the dependency will be stored in a content-addressable store.

2. Install Doppler CLI - our localhost environment variable manager (see [Doppler CLI](https://docs.doppler.com/docs/install-cli))

Run the `setup.sh` script which automatically installs Doppler CLI and sets up your environment variables

```zsh
pnpm run setup
```

Alternatively, run...

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

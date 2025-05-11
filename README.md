# rlxyz-compiler-client

A client for the Elevate.Art platform - the leading art generator for NFT collections.

## Features

- Generate 10k+ NFT collections in milliseconds
- Adjust rarity and create rules for your traits
- Preview and regenerate collections instantly
- Export to IPFS and mint your NFTs
- No coding required

## Installation

### Automatic Installation (recommended)

Run the setup script which automatically installs Doppler CLI and sets up your environment variables:

```bash
yarn setup
```

### Manual Installation

1. Install Doppler CLI - our localhost environment variable manager ([Doppler CLI docs](https://docs.doppler.com/docs/install-cli))

```bash
# Prerequisite: gnupg is required for binary signature verification
brew install gnupg

# Install using brew (use `doppler update` for subsequent updates)
brew install dopplerhq/cli/doppler

# Login to Doppler
doppler login
```

2. Set up your environment variables following the instructions in the `.env.example` file

## Development

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

## Architecture

The application is built with:

1. tRPC - Type-safe API layer
2. Cloudinary - Image management
3. Google Cloud Storage - Asset storage
4. Doppler - Environment variable management
5. Inngest - Background job processing
6. Vercel - Deployment platform

## Documentation

For more detailed documentation, visit our [docs site](https://docs.elevate.art).

## Routes

### Creation Flow

- `/sekured/roboghost/create/preview` - Preview your collection
- `/sekured/roboghost/create/rules` - Set up trait rules
- `/sekured/roboghost/create/rarity/{traitType}` - Adjust rarity for specific traits

### Deployment Flow

- `/sekured/roboghost/create/deployments` - View all deployments
- `/sekured/roboghost/create/deployments/{id}` - View specific deployment
- `/sekured/roboghost/create/deployments/{id}/contract` - View contract details
- `/sekured/roboghost/create/deployments/{id}/contract/new` - Create new contract

### User Flow

- `/sekured/roboghost` - Dashboard
- `/sekured/roboghost/mint` - Mint NFTs
- `/sekured/roboghost/market` - Marketplace

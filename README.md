<!-- # HashCompanion

Your Companion into web3 of hedera, Everything- One app.

currently integrated dapp3


# SimpleNotes

Web3 Notes Application built on Hedera Hashgraph.

# HashMessages

Your way into the freedom of communication fully private and fully ownable

# HCScanner

find Infomation regarding your operation within the scope of the hedera network and search for other interactions...

---

## Overview

SimpleNotes is a decentralized notes application that leverages blockchain technology for secure authentication and account management.

The application removes reliance on centralized authentication servers and gives users ownership of their blockchain identity through Hedera-based account creation and wallet connection. -->


# HashCompanion Suite 

Welcome to **HashCompanion**, your gateway into the Web3 ecosystem on **Hedera Hashgraph**.  
Everything you need — from notes and messaging to blockchain exploration — is now available in **one unified platform**.

---

## Features

| Feature | Description |
|---------|-------------|
| **Unified Wallet** | Connect and manage your Hedera wallet across all apps. |
| **Secure Notes** | Create and store notes with full ownership on the blockchain. |
| **Private Messaging** | End-to-end encrypted messaging with full user control. |
| **Blockchain Explorer** | Track your transactions and account activity on Hedera. |
| **Decentralized & Private** | No central servers — your data is fully yours. |

---

## Apps Overview

### **HashCompanion**
Your gateway to Web3 on Hedera — everything in one app.  
Currently integrated with DApp3.

**Overview:**  
HashCompanion acts as a central hub for managing all your Hedera-based applications. Connect wallets, explore decentralized apps, and track your activity in one unified platform.

---

### **SimpleNotes**
A decentralized notes application built on Hedera Hashgraph.  
Secure, private, and fully owned by you.

**Overview:**  
SimpleNotes allows you to create, store, and manage notes directly on the blockchain. By removing centralized authentication, you maintain full control over your data and identity through Hedera wallet integration.

---

### **HashMessages**
A private, fully ownable messaging platform — freedom of communication on the blockchain.

**Overview:**  
HashMessages enables secure, end-to-end encrypted messaging without reliance on central servers. All messages are tied to your Hedera account, giving you full ownership and privacy.

---

### **HCScanner**
Explore and track your Hedera operations.  
Search account activity and interactions across the network.

**Overview:**  
HCScanner is a blockchain explorer for your Hedera operations. Track transactions, inspect account activity, and explore interactions across the network — all from one application.

---

---

## Architecture

```mermaid
graph TD
    A[Main Application] --> B[HashRouter]
    B --> C[App.tsx - Route Handler]
    C --> D[DappStructure.tsx - Landing Page]
    C --> E[CreateAccount.tsx - Account Creation]
    C --> F[ConnectWallet.tsx - Wallet Connection]
    D --> G[DappLanding.css - Styling]
    E --> H[Hedera SDK]
    H --> I[Hedera Network]
    C --> J[react-toastify - Notifications]
```

---

## Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS v4
* react-router-dom
* react-toastify

### Blockchain

* @hashgraph/sdk v2.80.0
* ethers v6.16.0 (commented for future Ethereum support)

### Tooling

* Node.js
* npm
* ESLint
* TypeScript

---

## Core Features

### Decentralized Account Management

* Hedera account creation
* Wallet-based authentication
* No centralized user database

### Wallet Integration

* Connect using Account ID and Private Key
* Create new Hedera accounts
* Retrieve EVM-compatible address
* Query account balance (HBAR)
* Secure disconnect functionality

### Application Behavior

* State persistence using localStorage
* Multi-tab synchronization
* Hot reload support during development
* Toast-based notifications for errors and actions

---

## Project Structure

```
src/
├── Components/
│   ├── DappStructure.tsx
│   ├── CreateAccount.tsx
│   └── ConnectWallet.tsx
├── Styles/
│   └── DappLanding.css
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_OPERATOR_ID=your_operator_id
VITE_OPERATOR_KEY=your_private_key
VITE_NETWORK=testnet
```

Important: Never commit real private keys to version control.

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server for browser mode

```bash
npm run dev
```

### Build for Production browser mode

```bash
npm run build
```
### Build for Production extension mode

```bash
npm run build:ext
```


---

## Usage Flow

1. Open the landing page.
2. Create a new Hedera account or connect an existing one.
3. View account balance.
4. Retrieve associated EVM address.
5. Disconnect securely when finished.

---

## Key Components

### DappStructure.tsx

Landing page containing:

* Application branding
* Navigation buttons
* Feature overview
* Footer section

### CreateAccount.tsx

Handles:

* ED25519 key generation
* Hedera account creation
* Display of Account ID and Private Key
* Initial balance setup
* Connection logic

### ConnectWallet.tsx

Handles:

* Existing account connection
* Balance retrieval
* EVM address lookup
* Disconnect logic
* localStorage persistence
* Error handling via toast notifications

---

## Styling Approach

* Gradient background
* Glassmorphism effects
* Responsive grid layout
* Tailwind utility-first styling
* Custom CSS enhancements

---

## Future Enhancements

* Ethereum wallet integration
* Note creation and management interface
* Encryption and decryption of notes
* Multi-chain support
* Mobile optimization
* Enhanced authentication mechanisms

---

## Security Considerations

* Private keys must never be shared.
* Private keys are stored only in memory.
* Users are responsible for securely backing up credentials.
* Environment variables must not be exposed publicly.

---

## License

MIT License

You are free to use, modify, and distribute this project in accordance with the license terms.

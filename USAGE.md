# 🚀 Integrating Column Wallet SDK (Movement Network)

This guide walks you through setting up the **Column Wallet SDK** from scratch using React + Vite. Column uses a secure Deep Link architecture, allowing your dApp to interact with the Column Mobile App without requiring a browser extension.

## 🛠️ Phase 1: Local Setup

### 1. Create your Project
```bash
npm create vite@latest my-movement-dapp -- --template react-ts
cd my-movement-dapp
npm install
```

### 2. Install Dependencies
You will need the Column SDK and the Aptos/Movement TS SDK.
```bash
npm install @column-org/wallet-sdk @aptos-labs/ts-sdk
```

---

## 🏗️ Phase 2: Configuration (The Singleton Pattern)

Create a single file at `src/config/column.ts`. You initialize it here **once** and use it everywhere.

```typescript
// src/config/column.ts
import { ColumnWalletSDK } from '@column-org/wallet-sdk';

export const column = new ColumnWalletSDK({
    // Optional: Auto-detected from your index.html if omitted
    appName: "My Movement dApp", 
    appUrl: window.location.origin,
    redirectLink: window.location.origin + '/',
    walletScheme: "column", // Production Column Wallet Scheme
});
```

### 2. Network Configuration
Create a `networks.ts` file to manage Movement Network details.

```typescript
// src/config/networks.ts
export const NETWORKS = {
    mainnet: {
        name: 'Movement Mainnet',
        chainId: 126,
        nodeUrl: 'https://mainnet.movementnetwork.xyz/v1',
        explorerUrl: 'https://explorer.movementlabs.xyz',
        decimals: 8,
    },
    testnet: {
        name: 'Movement Testnet',
        chainId: 30732,
        nodeUrl: 'https://testnet.movementnetwork.xyz/v1',
        explorerUrl: 'https://explorer.movementlabs.xyz',
        decimals: 8,
        faucetUrl: 'https://faucet.testnet.movementnetwork.xyz/',
    },
    devnet: {
        name: 'Movement Devnet',
        chainId: 30731,
        nodeUrl: 'https://devnet.movementnetwork.xyz/v1',
        explorerUrl: 'https://explorer.movementlabs.xyz',
        decimals: 8,
        faucetUrl: 'https://faucet.devnet.movementnetwork.xyz/',
    },
};

export const DEFAULT_NETWORK = 'mainnet';
```

---

## ⚡ Phase 3: Implementation

### 1. The "Connect" Flow
Use the `column` instance you just created.

```tsx
// src/components/ConnectButton.tsx
import { column } from '../config/column';

export const ConnectButton = () => {
  const handleConnect = () => {
    // This generates and triggers the deep link handshake
    window.location.href = column.connect();
  };

  return <button onClick={handleConnect}>Connect Column</button>;
};
```

### 2. Capturing the Callback (The Brains)
When the wallet sends the user back, it attaches the address and encryption key to the URL. Use this snippet in your main `App.tsx` or a hook to "save" the connection.

```tsx
// src/App.tsx (or a custom hook)
import { column } from './config/column';

useEffect(() => {
    // Standard response handling
    const response = column.handleResponse(window.location.href);

    if (response.address && response.column_encryption_public_key) {
        // The SDK handles key storage internally when using handleResponse,
        // but it's good practice to save the address for your UI.
        setAddress(response.address);
        
        console.log("Success! Connected to:", response.address);
        
        // Clean the URL so the parameters disappear
        window.history.replaceState({}, '', window.location.pathname);
    }
}, []);
```

### 3. Sending a Transaction
Column handles the decimal math and network syncing automatically if you use the standard payload.

```tsx
// src/components/TransferForm.tsx
import { column } from '../config/column';

const handleTransfer = async () => {
    const payload = {
        function: "0x1::aptos_account::transfer",
        functionArguments: [recipient, "500000000"], // 5 MOVE (8 decimals)
    };

    // This redirects the user to the Mobile App for Approval
    window.location.href = column.signAndSubmitTransaction(payload);
};
```

### 🎯 Universal Feedback Logs
The Column SDK automatically transmits status updates from the Mobile Wallet back to your dApp. This allows you to show Informative Toasts/Alerts easily.

The redirect URL will contain:
*   `status`: Either `success` or `error`
*   `log`: A user-friendly message (e.g., "Wallet Connected Successfully", "Transaction Submitted to Movement", or detailed error reasons).

**Example Usage in Hook:**
```typescript
const { log } = useColumnWallet();

useEffect(() => {
    if (log) {
        if (log.type === 'success') {
            showToast.success(log.message);
        } else {
            showToast.error(log.message);
        }
    }
}, [log]);
```

---

## 🛡️ Security & Cross-App Compatibility
*   **Unique Session Identities**: Every app instance generates a unique cryptographic key. If you have 3 different dApps open, they each have their own secure "conversation" with the wallet.
*   **Redirect Precision**: The wallet returns users to the exact `redirect_link` provided in the request.
*   **Network Guard**: The SDK automatically prompts the user to switch networks if your dApp is on Testnet but the wallet is on Mainnet.
*   **Fungible Asset Ready**: Supports both legacy Coins and the modern Movement Fungible Asset standard (`0xa`).

## 📜 Example Implementation
For a full working example including CSS and advanced hooks, check our [Example Repository](https://github.com/Column-org/Satoshi/tree/main/example).

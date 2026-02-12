# Column Wallet SDK - Example App

This is a demo application showcasing the **[@column-org/wallet-sdk](https://www.npmjs.com/package/@column-org/wallet-sdk)** integration with React + TypeScript + Vite.

## 🚀 Features

- **Wallet Connection**: Connect to Column Wallet via deep-linking
- **Transaction Signing**: Sign and submit transactions on Movement/Aptos
- **Premium UI**: Glassmorphic modal with smooth animations
- **Multi-Tab Sync**: BroadcastChannel API for cross-tab state synchronization
- **Network Detection**: Automatic network identification (Movement, Aptos)

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Example

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## 🔧 Configuration

The SDK is configured in `src/hooks/useColumnWallet.ts`:

```typescript
import { ColumnWalletSDK } from '@column-org/wallet-sdk';

const SDK_CONFIG = {
    appUrl: window.location.origin,
    redirectLink: window.location.origin + '/',
    walletScheme: "column", // Use "column" for production
};

export const sdk = new ColumnWalletSDK(SDK_CONFIG);
```

### Development Mode

For testing with Expo Go during development, update the `walletScheme`:

```typescript
walletScheme: "exp://YOUR_IP:8081"
```

### Production Mode

For production builds, use the standard Column Wallet scheme:

```typescript
walletScheme: "column"
```

## 📱 Testing the Integration

1. **Start the dev server**: `npm run dev`
2. **Open the app** in your browser
3. **Click "Connect Wallet"** to trigger the deep-link
4. **Approve the connection** in Column Wallet mobile app
5. **You'll be redirected back** with your wallet address

## 🏗️ Project Structure

```
example/
├── src/
│   ├── components/       # UI components (ConnectModal, TransferForm, etc.)
│   ├── hooks/           # useColumnWallet hook
│   ├── services/        # Movement blockchain service
│   ├── config/          # Network configurations
│   └── App.tsx          # Main application
├── public/              # Static assets
└── package.json
```

## 📚 Key Files

- **`src/hooks/useColumnWallet.ts`**: Main SDK integration hook
- **`src/components/ConnectModal.tsx`**: Premium connection modal
- **`src/components/TransferForm.tsx`**: Transaction signing demo
- **`src/App.tsx`**: Main application component

## 🔐 Security

The SDK uses **X25519 + TweetNaCl** for end-to-end encryption of transaction payloads. All sensitive data is encrypted before being sent via deep-link.

## 📖 Documentation

For full SDK documentation, visit:
- [SDK GitHub Repository](https://github.com/column-org/wallet-sdk)
- [npm Package](https://www.npmjs.com/package/@column-org/wallet-sdk)

## 🛠️ Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 📄 License

MIT

# 📱 Professional Column Wallet SDK (React Native / Expo)

This guide walks you through a professional, modular integration of Column Wallet.

## 📦 Phase 0: Installation

You'll need the SDK, the Aptos SDK (for payloads), and a Buffer polyfill for encryption.

```bash
npx expo install @column-org/wallet-sdk @aptos-labs/ts-sdk buffer
```
*Note: Ensure `global.Buffer = Buffer` is set in your `index.js` entry file.*

---

## 🏗️ Phase 1: Configuration (The Config Page)

Professional apps keep configuration in a dedicated module. Create `src/config/column.ts`.

```typescript
// src/config/column.ts
import { ColumnWalletSDK } from '@column-org/wallet-sdk';

// Step 1: Define your app identity
const CONFIG = {
    appName: "Satoshi Yield",
    appDescription: "The Premium Entry to Movement",
    appIcon: "https://your-dapp.com/icon.png",
    appUrl: "https://your-dapp.com",
    redirectLink: "myapp://callback", 
    walletScheme: "column",
};

// Step 2: Initialize Core SDK (Logic Only)
export const column = new ColumnWalletSDK(CONFIG);
```

## ⚡ Phase 2: Implementation

### 1. Dedicated Native Button Import
Instead of mixing code, use a clean component for your connection.

```tsx
// src/components/ColumnButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { column } from '../config/column';

interface ColumnButtonProps {
    title?: string;
    style?: any;
}

export const ColumnConnectButton: React.FC<ColumnButtonProps> = ({ 
    title = "Connect Column Wallet", 
    style 
}) => {
    const handlePress = async () => {
        const url = column.connect();
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            console.error("Column Wallet App not found.");
            // Optional: Redirect to App Store
        }
    };

    return (
        <TouchableOpacity style={[styles.btn, style]} onPress={handlePress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#ffda34',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    text: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
```

### 2. Standardized Response Handling
Capture the callback using a standard hook or in your root navigation.

```tsx
// App.tsx
import * as Linking from 'expo-linking';
import { column } from './src/config/column';

export default function App() {
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      // Professional unified parsing
      try {
          const response = column.handleResponse(url);
          if (response.address) {
              console.log("Verified Connection:", response.address);
          }
      } catch (e) {
          console.error("Column Callback Error:", e.message);
      }
    }
  }, [url]);

  return <ColumnConnectButton />;
}
```

---

## 💎 Why this is professional:
1. **Separation of Concerns**: Your UI (Button) doesn't know about Encryption. Your SDK doesn't know about StyleSheets.
2. **Modular Initialization**: Changes to your App Name or Icon are made in one single "Config Page."
3. **Environment Safety**: The Core SDK can be imported anywhere (Web, Native, Node) without crashing.

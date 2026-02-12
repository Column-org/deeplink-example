# 📱 Column Wallet SDK Integration (React Native / Expo)

This guide provides all the necessary files to integrate Column Wallet into your React Native application professionally.

## 📦 Phase 0: Installation

You'll need the SDK, the Aptos SDK (for payloads), and a Buffer polyfill (required for encryption).

```bash
npx expo install @column-org/wallet-sdk @aptos-labs/ts-sdk buffer
```

### 1. Polyfill Buffer (CRITICAL)
Add this to the very top of your `index.js` or `App.tsx` file to prevent crashes.

**File:** `index.js` (or `App.tsx`)
```javascript
import { Buffer } from 'buffer';
global.Buffer = Buffer; // Required for Column SDK encryption

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

---

## 🏗️ Phase 1: Configuration Module

Create a dedicated configuration file to manage your app's identity and Initialize the SDK instance.

**File:** `src/config/column.ts`
```typescript
import { ColumnWalletSDK } from '@column-org/wallet-sdk';

/**
 * 1. Define your App's Metadata
 * This is what users will see in the wallet when connecting.
 */
const SDK_CONFIG = {
    appName: "My Cool dApp",
    appDescription: "The best dApp on Movement Network",
    appIcon: "https://myapp.com/logo.png", // Must be a valid HTTPS URL
    appUrl: "https://myapp.com",
    // mobile native schemes do not need https://
    redirectLink: "myapp://callback", 
    walletScheme: "column", // Production standard
};

/**
 * 2. Export the initialized SDK instance
 * Import this 'column' object whenever you need to connect or sign.
 */
export const column = new ColumnWalletSDK(SDK_CONFIG);
```

---

## ⚡ Phase 2: Create the "Connect Button"

Create a reusable component that handles the deep-link logic gracefully.

**File:** `src/components/ColumnConnectButton.tsx`
```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Alert } from 'react-native';
import { column } from '../config/column';

interface Props {
    title?: string;
    style?: any;
    onConnect?: () => void;
}

export const ColumnConnectButton: React.FC<Props> = ({ 
    title = "Connect Column Wallet", 
    style,
    onConnect 
}) => {
    const handlePress = async () => {
        try {
            // 1. Generate the connection URL
            const url = column.connect();
            
            // 2. Check if Column Wallet is installed
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                // 3. Open the wallet
                await Linking.openURL(url);
                if (onConnect) onConnect();
            } else {
                Alert.alert(
                    "Wallet Not Found",
                    "Please install Column Wallet to continue.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Download", onPress: () => Linking.openURL('https://columnwallet.com/download') }
                    ]
                );
            }
        } catch (error) {
            console.error("Deep link error:", error);
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
        backgroundColor: '#ffda34', // Column Yellow
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    text: {
        color: '#121315',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
```

---

## 🔄 Phase 3: Handle The Callback (Main App)

Capture the response when the user is redirected back to your app.

**File:** `App.tsx`
```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { Buffer } from 'buffer';

// Polyfill Buffer for Native Environment
global.Buffer = Buffer;

import { column } from './src/config/column';
import { ColumnConnectButton } from './src/components/ColumnConnectButton';

export default function App() {
  const url = Linking.useURL(); // Expo's hook to capture deep links
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      handleDeepLink(url);
    }
  }, [url]);

  const handleDeepLink = (deepLinkUrl: string) => {
    try {
        // Only process links meant for our app
        if (!deepLinkUrl.includes("myapp://")) return;

        // 1. Let the SDK parse the response
        const response = column.handleResponse(deepLinkUrl);

        // 2. If successful, we get the address
        if (response.address) {
            console.log("Wallet Connected:", response.address);
            setAddress(response.address);
            
            // Pro Tip: Save the public key for future sessions!
            // AsyncStorage.setItem('wallet_pk', response.column_encryption_public_key);
        }
    } catch (e: any) {
        console.error("Connection Failed:", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {address ? (
        <Text style={styles.success}>Connected: {address.slice(0,6)}...{address.slice(-4)}</Text>
      ) : (
        <ColumnConnectButton />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121315',
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
```

---

## ✍️ Phase 4: Sign & Submit Transaction

Signing a transaction works exactly like connecting: You generate a link, open it, and wait for the callback.

**File:** `src/actions/transfer.ts`
```tsx
import { Linking, Alert } from 'react-native';
import { column } from '../config/column';

export const sendMoveToken = async (recipient: string, amount: string) => {
    try {
        // 1. Construct the Aptos Payload
        const payload = {
            function: "0x1::aptos_account::transfer",
            functionArguments: [recipient, amount], // e.g. "100000000" for 1 MOVE
        };

        // 2. Generate the encrypted deep link
        const url = column.signAndSubmitTransaction(payload);

        // 3. Prompt user to sign in Wallet
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("Column Wallet not found");
        }
    } catch (e: any) {
        console.error("Signing Failed:", e.message);
        Alert.alert("Error", e.message);
    }
};

/**
 * Handle the Transaction Hash response in your App.tsx similar to connection
 * (You can reuse the same handleDeepLink function)
 */
// In App.tsx:
// if (response.data && response.data.hash) {
//    Alert.alert("Transaction Success!", `Hash: ${response.data.hash}`);
// }
```

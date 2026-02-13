# 📱 Column Wallet SDK Integration (React Native / Expo)

This guide provides all the necessary files to integrate Column Wallet into your React Native application professionally.

## 📦 Phase 0: Installation

The SDK now automatically handles all polyfills for React Native environments.

```bash
npx expo install @column-org/wallet-sdk @aptos-labs/ts-sdk
```

> **Note:** The SDK automatically polyfills `Buffer` and `crypto.getRandomValues` for React Native. No manual setup required!

---

## 🏗️ Phase 1: Configuration Module

Create a dedicated configuration file to manage your app's identity and Initialize the SDK instance.

**File:** `constants/column.ts`
```typescript
import { ColumnWalletSDK } from '@column-org/wallet-sdk';
import * as Linking from 'expo-linking';

/**
 * 1. Define your App's Metadata
 * This is what users will see in the wallet when connecting.
 */
const SDK_CONFIG = {
    appName: "My Cool dApp",
    appDescription: "The best dApp on Movement Network",
    appIcon: "https://myapp.com/logo.png", // Must be a valid HTTPS URL
    appUrl: "https://myapp.com",
    redirectLink: Linking.createURL(''), // Dynamic scheme for Expo
    walletScheme: "column", // Production standard
};

/**
 * 2. Export the initialized SDK instance
 * Import this 'column' object whenever you need to connect or sign.
 */
export const column = new ColumnWalletSDK(SDK_CONFIG);
```

---

## ⚡ Phase 2: Use the Built-in Connect Modal

The SDK now includes a native `ColumnWalletModal` component that handles the connection UI for you.

**No custom component needed!** Simply import and use the modal from the SDK:

```tsx
import { ColumnWalletModal } from '@column-org/wallet-sdk';
```

See Phase 3 below for the complete implementation example.

---

## 🔄 Phase 3: Handle The Callback (Main App)

Capture the response when the user is redirected back to your app.

**File:** `app/(tabs)/index.tsx` (or your main screen)
```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ExpoLinking from 'expo-linking';
import { column } from '@/constants/column';
import { ColumnWalletModal } from '@column-org/wallet-sdk';

export default function HomeScreen() {
  const [address, setAddress] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Use addEventListener for more reliable deep link handling
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      handleDeepLink(url);
    };
    
    const sub = ExpoLinking.addEventListener('url', handleUrl);
    
    // Handle initial link if app was closed
    ExpoLinking.getInitialURL().then((startUrl) => {
      if (startUrl) handleDeepLink(startUrl);
    });

    return () => sub.remove();
  }, []);

  const handleDeepLink = (url: string) => {
    try {
      const response = column.handleResponse(url);
      
      if (response.address) {
        console.log("Wallet Connected:", response.address);
        setAddress(response.address);
        Alert.alert("Success", "Wallet connected successfully!");
      } else if (response.data?.hash) {
        Alert.alert("Transaction Submitted", `Hash: ${response.data.hash}`);
      } else if (response.error) {
        Alert.alert("Error", response.error);
      }
    } catch (e: any) {
      console.log("Deep link error:", e.message);
    }
  };

  const handleSignTransaction = async () => {
    if (!address) return;

    try {
      const payload = {
        function: "0x1::aptos_account::transfer",
        functionArguments: [address, "1000000"], // 0.01 MOVE
      };

      const url = column.signAndSubmitTransaction(payload);
      await ExpoLinking.openURL(url);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.container}>
      {address ? (
        <View style={styles.connectedContainer}>
          <Text style={styles.title}>Connected</Text>
          <Text style={styles.address}>{address}</Text>
          
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={handleSignTransaction}
          >
            <Text style={styles.btnText}>Sign Test Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, styles.disconnectBtn]} 
            onPress={() => setAddress(null)}
          >
            <Text style={styles.btnText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.connectBtn} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.connectBtnText}>Connect Column</Text>
        </TouchableOpacity>
      )}

      <ColumnWalletModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConnect={() => setModalVisible(false)}
        sdk={column}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  connectBtn: {
    backgroundColor: '#ffda34',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  connectBtnText: {
    color: '#121315',
    fontWeight: 'bold',
    fontSize: 16,
  },
  connectedContainer: {
    width: '100%',
    gap: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  address: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disconnectBtn: {
    backgroundColor: '#FF3B30',
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
  },
});
```

---

## ✅ Done!

Your app is now fully integrated with Column Wallet. Users can:
- ✅ Connect their wallet via the built-in modal
- ✅ Sign and submit transactions
- ✅ Receive callbacks with transaction hashes

## 🔐 Pro Tips

1. **Persist Session Keys**: Save `column.getSessionSecretKey()` to avoid re-encryption setup
2. **Network Switching**: The SDK automatically handles network mismatch prompts
3. **Error Handling**: Always wrap SDK calls in try-catch blocks
4. **Deep Link Scheme**: Register your custom scheme in `app.json`:
   ```json
   {
     "expo": {
       "scheme": "myapp"
     }
   }
   ```

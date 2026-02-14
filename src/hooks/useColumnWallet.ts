import { useState, useEffect } from 'react';
import { ColumnWalletWeb } from '@column-org/wallet-sdk';

const SDK_CONFIG = {
    // appName, appDescription, appIcon will be auto-detected from index.html!
    appUrl: window.location.origin,
    redirectLink: window.location.origin + '/',
    walletScheme: "column",
};

export const sdk = new ColumnWalletWeb(SDK_CONFIG);

export const useColumnWallet = () => {
    const [address, setAddress] = useState<string | null>(localStorage.getItem('col_wallet_address'));
    const [network, setNetwork] = useState<string | null>(localStorage.getItem('col_wallet_network'));
    const [lastTx, setLastTx] = useState<string | null>(null);
    const [log, setLog] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        // Hydrate SDK
        const storedKey = localStorage.getItem('col_wallet_enc_key');
        if (storedKey) {
            sdk.importWalletKey(storedKey);
        }

        // Parse params from both Search (?) and Hash (#) for better tab-reuse support
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        // Combine them (Hash takes priority for responses)
        const params = new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            ...Object.fromEntries(hashParams.entries())
        });

        const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window
            ? new BroadcastChannel('column_wallet_channel')
            : null;

        // 1. Capture Universal Status Logs
        const status = params.get('status');
        const logMsg = params.get('log');

        if (status && logMsg) {
            const logData = { message: logMsg, type: status as 'success' | 'error' };
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLog(logData);
            console.log(`[Column SDK Log]: ${logMsg}`);

            // Broadcast to other tabs
            channel?.postMessage({ type: 'LOG', data: logData });
        }

        // 2. Handle Connection
        const addr = params.get('address');
        const encKey = params.get('column_encryption_public_key');
        const net = params.get('network');

        // 3. Handle Transaction Callback
        const txHash = params.get('transaction_hash');

        if (addr && encKey) {
            sdk.importWalletKey(encKey);
            setAddress(addr);
            localStorage.setItem('col_wallet_address', addr);
            localStorage.setItem('col_wallet_enc_key', encKey); // Use consistent key name
            if (net) {
                setNetwork(net);
                localStorage.setItem('col_wallet_network', net);
            }

            // Broadcast connection to other tabs
            channel?.postMessage({
                type: 'CONNECT',
                data: { address: addr, network: net, encryptionKey: encKey }
            });
        }

        if (txHash) {
            setLastTx(txHash);
            channel?.postMessage({ type: 'TX_SUCCESS', data: { txHash } });
        }

        // Handle incoming messages from other tabs
        if (channel) {
            channel.onmessage = (event) => {
                const { type, data } = event.data;
                console.log(`[Column SDK Channel]: Received ${type}`, data);
                if (type === 'CONNECT') {
                    setAddress(data.address);
                    localStorage.setItem('col_wallet_address', data.address);
                    setNetwork(data.network);
                    if (data.network) localStorage.setItem('col_wallet_network', data.network);

                    sdk.importWalletKey(data.encryptionKey);
                    localStorage.setItem('col_wallet_enc_key', data.encryptionKey);
                } else if (type === 'LOG') {
                    setLog(data);
                } else if (type === 'TX_SUCCESS') {
                    setLastTx(data.txHash);
                }
            };
        }

        // 4. Tab Resurrection: If we are a callback tab, and we just synced, try to close
        if (params.toString() && (addr || txHash || status)) {
            // We just updated localStorage. If there's another tab, it might have received our broadcast.
            // After a short delay, if we can close ourselves, do it to avoid duplicates.
            setTimeout(() => {
                window.history.replaceState({}, '', window.location.pathname);
                // Attempt to close if it's likely a duplicate tab opened by a deep link
                if (window.opener || window.history.length <= 1) {
                    // window.close(); // Browser might block, but worth a try on mobile
                }
            }, 500);
        }

        return () => channel?.close();
    }, []);

    const connect = () => {
        window.location.href = sdk.connect();
    };

    const logout = () => {
        localStorage.clear();
        setAddress(null);
        setNetwork(null);
        setLog(null);
    };

    return {
        address,
        network,
        lastTx,
        log,
        connect,
        logout,
        sdk
    };
};

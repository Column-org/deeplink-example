import React, { useState } from 'react';
import { useColumnWallet } from '../hooks/useColumnWallet';

export const TransferForm: React.FC<{ recipient?: string }> = ({ recipient: initialRecipient }) => {
    const { sdk } = useColumnWallet();
    const [recipient, setRecipient] = useState(initialRecipient || '');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTransfer = async () => {
        if (!recipient || !amount) return alert('Enter recipient and amount');

        setIsSubmitting(true);
        try {
            // MOVE is strictly 8 decimals on Movement
            const decimals = 8;
            const amountInOctas = Math.floor(parseFloat(amount) * Math.pow(10, decimals));

            const payload = {
                function: "0x1::aptos_account::transfer",
                functionArguments: [recipient, amountInOctas.toString()],
            };

            // This triggers the deep link to the Column App
            window.location.href = sdk.signAndSubmitTransaction(payload);

            // Reset UI state for when the user returns
            setTimeout(() => {
                setIsSubmitting(false);
                setRecipient('');
                setAmount('');
            }, 1000);
        } catch (error: any) {
            alert('Transfer failed: ' + error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div style={STYLES.card}>
            <h3 style={STYLES.title}>Send MOVE</h3>
            <div style={STYLES.inputGroup}>
                <label style={STYLES.label}>Recipient Address</label>
                <input
                    style={STYLES.input}
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
            </div>
            <div style={STYLES.inputGroup}>
                <label style={STYLES.label}>Amount (MOVE)</label>
                <input
                    style={STYLES.input}
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button
                onClick={handleTransfer}
                disabled={isSubmitting}
                style={{
                    ...STYLES.button,
                    opacity: isSubmitting ? 0.5 : 1
                }}
            >
                {isSubmitting ? 'Approving in Wallet...' : 'Send Transaction'}
            </button>
        </div>
    );
};

const STYLES = {
    card: {
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '24px',
        padding: '32px',
    },
    title: { margin: '0 0 24px 0', fontSize: '20px', fontWeight: '700' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', color: '#666', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' as const },
    input: {
        width: '100%',
        backgroundColor: '#000',
        border: '1px solid #333',
        borderRadius: '12px',
        padding: '12px 16px',
        color: 'white',
        fontSize: '14px',
        boxSizing: 'border-box' as const,
    },
    button: {
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        backgroundColor: '#ffda34',
        border: 'none',
        color: 'black',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s ease',
    }
};

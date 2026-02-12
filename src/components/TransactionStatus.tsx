import React from 'react';

interface TransactionStatusProps {
    hash: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ hash }) => {
    return (
        <div style={{
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: '16px',
            padding: '16px',
            marginTop: '16px',
            textAlign: 'left'
        }}>
            <div style={{ color: '#4CAF50', fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
                ✓ Transaction Sent
            </div>
            <div style={{ color: '#8B98A5', fontSize: '12px', wordBreak: 'break-all' }}>
                {hash.slice(0, 24)}...
            </div>
            <a
                href={`https://explorer.movementlabs.xyz/txn/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffda34', fontSize: '12px', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginTop: '8px' }}
            >
                View on Explorer →
            </a>
        </div>
    );
};

import React from 'react';

export const WalletInfo: React.FC<{ address: string }> = ({ address }) => {
    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <div style={STYLES.card}>
            <div style={STYLES.glow} />
            <div style={STYLES.content}>
                <span style={STYLES.label}>CONNECTED WALLET</span>
                <div style={STYLES.row}>
                    <div style={STYLES.avatar}>{address.slice(2, 4).toUpperCase()}</div>
                    <h2 style={STYLES.address}>{truncated}</h2>
                </div>
            </div>
            <button
                onClick={() => navigator.clipboard.writeText(address)}
                style={STYLES.copyBtn}
            >
                Copy Address
            </button>
        </div>
    );
};

const STYLES = {
    card: {
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative' as const,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    glow: {
        position: 'absolute' as const,
        top: '-100px',
        left: '-100px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255, 218, 52, 0.05) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 0,
    },
    content: { position: 'relative' as const, zIndex: 1 },
    label: { color: '#666', fontSize: '10px', fontWeight: '900', letterSpacing: '1px' },
    row: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#1A1A1A',
        color: '#ffda34',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        border: '1px solid #333',
    },
    address: { margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' },
    copyBtn: {
        padding: '8px 16px',
        borderRadius: '10px',
        backgroundColor: '#1A1A1A',
        border: '1px solid #333',
        color: '#888',
        fontSize: '12px',
        cursor: 'pointer',
    }
};

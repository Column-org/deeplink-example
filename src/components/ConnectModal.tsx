import React from 'react';
import columnIcon from '../assets/Column.png';

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
    if (!isOpen) return null;

    return (
        <div style={STYLES.overlay}>
            <div style={STYLES.modal}>
                <div style={STYLES.header}>
                    <h2 style={STYLES.title}>Connect Wallet</h2>
                    <button onClick={onClose} style={STYLES.closeBtn}>&times;</button>
                </div>

                <p style={STYLES.subtitle}>Choose your gateway to the Movement Network</p>

                <button onClick={onConnect} style={STYLES.walletOption}>
                    <div style={STYLES.walletIcon}>
                        <img
                            src={columnIcon}
                            style={{ width: 32, height: 32, borderRadius: '8px' }}
                            alt="Column"
                        />
                    </div>
                    <div style={STYLES.walletInfo}>
                        <span style={STYLES.walletName}>Column Wallet</span>
                        <span style={STYLES.walletStatus}>Mobile • Recommended</span>
                    </div>
                </button>

                <div style={STYLES.footer}>
                    New to Column? <a href="#" style={STYLES.link}>Download App</a>
                </div>
            </div>
        </div>
    );
};

const STYLES = {
    overlay: {
        position: 'fixed' as const,
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#111',
        border: '1px solid #333',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    title: {
        color: 'white',
        fontSize: '24px',
        fontWeight: '700',
        margin: 0,
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#666',
        fontSize: '28px',
        cursor: 'pointer',
    },
    subtitle: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '32px',
    },
    walletOption: {
        width: '100%',
        backgroundColor: '#1A1A1A',
        border: '1px solid #333',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    walletIcon: {
        width: '48px',
        height: '48px',
        backgroundColor: '#000',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #222',
    },
    walletInfo: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
    },
    walletName: {
        color: 'white',
        fontWeight: '600',
        fontSize: '16px',
    },
    walletStatus: {
        color: '#ffda34',
        fontSize: '12px',
        fontWeight: '500',
    },
    footer: {
        marginTop: '32px',
        textAlign: 'center' as const,
        color: '#666',
        fontSize: '13px',
    },
    link: {
        color: '#ffda34',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

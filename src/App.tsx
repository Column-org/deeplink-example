import { useState } from 'react';
import { useColumnWallet } from './hooks/useColumnWallet';
import { ConnectModal } from './components/ConnectModal';
import { TransferForm } from './components/TransferForm';
import { WalletInfo } from './components/WalletInfo';

export default function App() {
  const { address, network, lastTx, log, connect, logout } = useColumnWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={STYLES.container}>
      <header style={STYLES.header}>
        <div style={STYLES.logo}>EXAMPLE <span style={{ color: '#ffda34' }}>APP</span></div>
        <div style={STYLES.nav}>
          {address ? (
            <div style={STYLES.userSection}>
              <span style={STYLES.netBadge}>{network?.toUpperCase()}</span>
              <button onClick={logout} style={STYLES.logoutBtn}>Disconnect</button>
            </div>
          ) : (
            <button onClick={() => setIsModalOpen(true)} style={STYLES.connectTrigger}>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main style={STYLES.main}>
        {!address ? (
          <div style={STYLES.hero}>
            <h1 style={STYLES.heroTitle}>Connect to Column.</h1>
            <p style={STYLES.heroText}>Connect your Column Wallet to test deep linking, transaction signing, and message authorization.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => setIsModalOpen(true)} style={STYLES.ctaBtn}>Connect Wallet</button>
            </div>
          </div>
        ) : (
          <div style={STYLES.dashboard}>
            {log && (
              <div style={{
                ...STYLES.logToast,
                borderColor: log.type === 'error' ? '#ef4444' : '#22c55e',
                backgroundColor: log.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: log.type === 'error' ? '#ef4444' : '#22c55e',
              }}>
                {log.type === 'error' ? '❌' : '✅'} {log.message}
              </div>
            )}

            <WalletInfo address={address} />
            <TransferForm recipient="" />

            {lastTx && (
              <div style={STYLES.success}>
                🎉 Transaction Successful!
                <a href={`https://explorer.movementlabs.xyz/txn/${lastTx}`} target="_blank" style={STYLES.link}>View on Explorer</a>
              </div>
            )}
          </div>
        )}
      </main>

      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={() => {
          setIsModalOpen(false);
          connect();
        }}
      />
    </div>
  );
}

const STYLES = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: 'white',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '24px 40px',
    borderBottom: '1px solid #111',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '900',
    letterSpacing: '2px',
  },
  nav: { display: 'flex', gap: '20px', alignItems: 'center' },
  main: {
    padding: '20px',
    minHeight: 'calc(100vh - 80px)', // Account for header
  },
  connectTrigger: {
    padding: '10px 24px',
    borderRadius: '12px',
    border: '1px solid #ffda34',
    background: 'transparent',
    color: '#ffda34',
    fontWeight: '600',
    cursor: 'pointer',
  },
  ctaBtn: {
    padding: '16px 40px',
    borderRadius: '16px',
    backgroundColor: '#ffda34',
    border: 'none',
    color: 'black',
    fontWeight: '700',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '24px',
  },
  hero: {
    padding: '120px 40px',
    textAlign: 'center' as const,
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '64px',
    fontWeight: '800',
    marginBottom: '16px',
    background: 'linear-gradient(to bottom, #fff, #666)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroText: { color: '#888', fontSize: '20px' },
  dashboard: {
    maxWidth: '500px',
    margin: '40px auto',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  success: {
    padding: '20px',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid #22c55e',
    borderRadius: '16px',
    textAlign: 'center' as const,
    color: '#22c55e',
  },
  link: { color: '#22c55e', marginLeft: '10px', fontWeight: 'bold' },
  userSection: { display: 'flex', gap: '12px', alignItems: 'center' },
  netBadge: {
    backgroundColor: '#111',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#ffda34',
    border: '1px solid #222',
  },
  logToast: {
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center' as const,
    marginBottom: '8px',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '14px',
  }
};

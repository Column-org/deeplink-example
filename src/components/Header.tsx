import React from 'react';
import { STYLES } from '../styles';

export const Header: React.FC = () => {
    return (
        <>
            <h1 style={STYLES.title}>Satoshi Yield</h1>
            <p style={STYLES.subtitle}>
                Premium liquidity protocol for the Movement Network. Connect your Column wallet to start earning.
            </p>
        </>
    );
};

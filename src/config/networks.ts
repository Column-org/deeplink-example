export const NetworkType = {
    MAINNET: 'mainnet',
    TESTNET: 'testnet',
    DEVNET: 'devnet',
} as const;

export type NetworkType = (typeof NetworkType)[keyof typeof NetworkType];

export interface NetworkConfig {
    name: string;
    chainId: number;
    nodeUrl: string;
    explorerUrl: string;
    decimals: number;
    faucetUrl?: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
    [NetworkType.MAINNET]: {
        name: 'Movement Mainnet',
        chainId: 126,
        nodeUrl: 'https://mainnet.movementnetwork.xyz/v1',
        explorerUrl: 'https://explorer.movementlabs.xyz',
        decimals: 8,
    },
    [NetworkType.TESTNET]: {
        name: 'Movement Testnet',
        chainId: 30732,
        nodeUrl: 'https://testnet.movementnetwork.xyz/v1',
        explorerUrl: 'https://explorer.movementlabs.xyz',
        decimals: 8,
        faucetUrl: 'https://faucet.testnet.movementnetwork.xyz/',
    },
    [NetworkType.DEVNET]: {
        name: 'Movement Devnet',
        chainId: 30731,
        nodeUrl: 'https://devnet.movementnetwork.xyz/v1',
        explorerUrl: 'https://explorer.movementlabs.xyz',
        decimals: 8,
        faucetUrl: 'https://faucet.devnet.movementnetwork.xyz/',
    },
};

export const DEFAULT_NETWORK = NetworkType.MAINNET;

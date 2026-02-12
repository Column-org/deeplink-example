import type { NetworkConfig } from '../config/networks';

/**
 * Service to interact with the Movement blockchain directly via RPC
 */
export const MovementService = {
    /**
     * Fetches decimals for a given token (Fungible Asset or Coin)
     * @param tokenAddress The address of the token (e.g., '0x1::aptos_coin::AptosCoin' or an FA address)
     * @param networkConfig The configuration for the target network
     */
    async getDecimals(tokenAddress: string, networkConfig: NetworkConfig): Promise<number> {
        // Mapping: Native MOVE standard type to the target metadata object at 0xa
        const targetAddress = tokenAddress === '0x1::aptos_coin::AptosCoin' ? '0xa' : tokenAddress;

        try {
            // 1. Try fetching as a Fungible Asset (Modern Standard)
            const faResponse = await fetch(`${networkConfig.nodeUrl}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    function: '0x1::fungible_asset::decimals',
                    type_arguments: [],
                    arguments: [targetAddress]
                })
            });

            if (faResponse.ok) {
                const result = await faResponse.json();
                if (Array.isArray(result) && typeof result[0] === 'number') {
                    return result[0];
                }
            }

            // 2. Fallback to Legacy Coin standard if FA fails
            const coinResponse = await fetch(`${networkConfig.nodeUrl}/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    function: '0x1::coin::decimals',
                    type_arguments: [tokenAddress],
                    arguments: []
                })
            });

            if (coinResponse.ok) {
                const result = await coinResponse.json();
                if (Array.isArray(result) && typeof result[0] === 'number') {
                    return result[0];
                }
            }

            // 3. Ultimate fallback (standard Aptos/Movement token)
            return networkConfig.decimals || 8;
        } catch (error) {
            console.warn('MovementService: Failed to detect decimals, using fallback from config:', error);
            return networkConfig.decimals || 8;
        }
    }
};

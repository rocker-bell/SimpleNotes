export type HederaAccount = {
    accountId: string;
    privateKey: string;
    evmAddress: string;
};
export declare const saveAccounts: (accounts: HederaAccount[]) => void;
export declare const loadAccounts: () => Promise<HederaAccount[]>;
export declare const saveActiveAccount: (index: number) => void;
export declare const loadActiveAccount: () => Promise<number | null>;

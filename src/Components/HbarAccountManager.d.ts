import "../Styles/HbarAccountManager.css";
type HederaAccount = {
    accountId: string;
    privateKey: string;
    evmAddress: string;
};
type Props = {
    accounts: HederaAccount[];
    setAccounts: React.Dispatch<React.SetStateAction<HederaAccount[]>>;
    activeAccount: number | null;
    setActiveAccount: React.Dispatch<React.SetStateAction<number | null>>;
    clearAccount: () => void;
    connectAccount: (account: HederaAccount) => void;
    onUseWallet: (index: number) => void;
};
declare const HbarAccountManager: ({ accounts, setAccounts, activeAccount, onUseWallet }: Props) => import("react/jsx-runtime").JSX.Element;
export default HbarAccountManager;

import "../Styles/DexScan.css";
interface DexScanProps {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
}
declare const DexScan: ({ accountId, evmAddress }: DexScanProps) => import("react/jsx-runtime").JSX.Element;
export default DexScan;

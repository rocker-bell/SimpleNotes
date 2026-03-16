import "../Styles/HCAIHelper.css";
type HCAIHelperProps = {
    evmAddress: string | null;
    privateKey: string | null;
    accountId: string | null;
};
declare const HCAIhelper: ({ evmAddress, privateKey, accountId }: HCAIHelperProps) => import("react/jsx-runtime").JSX.Element;
export default HCAIhelper;

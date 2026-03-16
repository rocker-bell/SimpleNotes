import "../Styles/Chatbox.css";
interface ChatboxProps {
    accountId: string | null;
    privateKey: string | null;
    evmAddress: string | null;
}
declare const Chatbox: ({ accountId, privateKey, evmAddress }: ChatboxProps) => import("react/jsx-runtime").JSX.Element;
export default Chatbox;

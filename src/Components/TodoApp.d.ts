import "../Styles/TodoApp.css";
interface TodoAppProps {
    accountId: string | null;
    privateKey: string | null;
}
declare const TodoApp: ({ accountId, privateKey }: TodoAppProps) => import("react/jsx-runtime").JSX.Element;
export default TodoApp;

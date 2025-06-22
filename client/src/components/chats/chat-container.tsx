import type { User } from "../../assets/assets";

interface ChatContainerProps {
   selectedUser?: User;
   setSelectedUser: (value: User | undefined) => void;
}

const ChatContainer = ({
   selectedUser,
   setSelectedUser,
}: ChatContainerProps) => {
   return <div>ChatContainer</div>;
};

export { ChatContainer };

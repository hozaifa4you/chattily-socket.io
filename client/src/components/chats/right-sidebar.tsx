import type { User } from "../../assets/assets";

interface RightSidebarProps {
   selectedUser?: User;
   setSelectedUser: (value: User | undefined) => void;
}

const RightSidebar = ({ selectedUser, setSelectedUser }: RightSidebarProps) => {
   return <div>RightSidebar</div>;
};

export { RightSidebar };

import { useState } from "react";
import { ChatContainer } from "../components/chats/chat-container";
import { RightSidebar } from "../components/chats/right-sidebar";
import { Sidebar } from "../components/chats/sidebar";
import { cn } from "../lib/utils";
import type { User } from "../assets/assets";

const Homepage = () => {
   const [selectedUser, setSelectedUser] = useState<User>();

   return (
      <div className="h-screen w-full border text-white sm:px-[15%] sm:py-[5px]">
         <div
            className={cn(
               "relative grid h-full grid-cols-1 overflow-hidden rounded-2xl border-2 border-gray-600 backdrop-blur-xl",
               {
                  "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]":
                     selectedUser,
                  "md:grid-cols-2": !selectedUser,
               },
            )}
         >
            <Sidebar
               selectedUser={selectedUser}
               setSelectedUser={setSelectedUser}
            />
            <ChatContainer
               setSelectedUser={setSelectedUser}
               selectedUser={selectedUser}
            />
            {selectedUser && (
               <RightSidebar
                  setSelectedUser={setSelectedUser}
                  selectedUser={selectedUser}
               />
            )}
         </div>
      </div>
   );
};

export { Homepage };

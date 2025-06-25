import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { cn } from "../../lib/utils";
import { AuthContext } from "../../context/auth-context";
import { Link } from "react-router-dom";
import { ChatContext } from "../../context/chat-context";
import debounce from "lodash.debounce";
import type { User } from "../../types/types";
import { axiosInstance } from "../../lib/axios";

const Sidebar = () => {
   const { logout, onlineUsers, token } = useContext(AuthContext);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchUsers, setSearchUsers] = useState<User[]>([]);
   const { users, getUsers, selectedUser, setSelectedUser, unseenMessages } =
      useContext(ChatContext);

   const handleSearch = debounce(async (e) => {
      const searchTerm = e.target.value.toLowerCase();

      const { data } = await axiosInstance.get(`/users?search=${searchTerm}`, {
         headers: { token },
      });

      if (data.length > 0) {
         setSearchUsers(data);
      }
   }, 300);

   useEffect(() => {
      getUsers();
   }, [onlineUsers]);

   return (
      <div
         className={cn(
            "h-full overflow-y-scroll rounded-r-xl bg-[#8185b2]/10 p-5 text-white",
            {
               "max-md:hidden": selectedUser,
            },
         )}
      >
         <div className="mb-5">
            <div className="flex items-center justify-between">
               <img src={assets.logo} alt="Chattily" className="max-w-40" />
               <div className="group relative py-2">
                  <img
                     src={assets.menu_icon}
                     alt="Chattily Menu"
                     className="max-h-5 cursor-pointer"
                  />
                  <div className="absolute top-full right-0 z-20 hidden w-32 rounded-md border border-gray-600 bg-[#282142] p-5 text-gray-100 group-hover:block">
                     <Link className="cursor-pointer text-sm" to="/profile">
                        Edit Profile
                     </Link>
                     <hr className="my-2 border-t border-t-gray-500" />
                     <button
                        onClick={logout}
                        type="button"
                        className="cursor-pointer text-sm"
                     >
                        Logout
                     </button>
                  </div>
               </div>
            </div>

            {/* Search Bar */}
            <div className="relative my-5 flex items-center gap-2 rounded-full bg-[#282142] px-4 py-3">
               <img src={assets.search_icon} alt="Search" className="w-3" />
               <input
                  type="text"
                  className="flex-1 border-none bg-transparent text-xs text-white placeholder-[#8c8c8c] outline-none"
                  placeholder="Search chats"
                  onChange={(e) => {
                     setSearchTerm(e.target.value);
                     handleSearch(e);
                  }}
                  value={searchTerm}
               />

               {searchTerm && (
                  <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-xl bg-[#282142] shadow">
                     <div className="flex flex-col">
                        {searchUsers.length > 0 ? (
                           searchUsers.map((user) => (
                              <div
                                 key={user.id}
                                 className="flex cursor-pointer items-center justify-between gap-2 rounded border-b border-b-[#3f3f3f] p-2 pl-4 last:border-b-0 hover:bg-[#282142]/50 max-sm:text-sm"
                                 onClick={() => setSelectedUser(user)}
                              >
                                 <div className="flex items-center gap-2">
                                    <img
                                       src={
                                          user.profilePic ?? assets.avatar_icon
                                       }
                                       alt={user.fullName}
                                       className="aspect-[1/1] w-[35px] rounded-full"
                                    />
                                    <div className="flex flex-col leading-5">
                                       <p>{user.fullName}</p>
                                       <span className="text-xs text-neutral-400">
                                          {user.email}
                                       </span>
                                    </div>
                                 </div>
                                 <div>
                                    {onlineUsers?.includes(user.id) ? (
                                       <span className="text-xs text-green-400">
                                          Online
                                       </span>
                                    ) : (
                                       <span className="text-xs text-neutral-400">
                                          Offline
                                       </span>
                                    )}
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="p-2 text-center text-sm text-neutral-400">
                              No users found
                           </p>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* Chat List */}
            <div className="flex flex-col">
               {users.map((user, index) => (
                  <div
                     key={user.id}
                     onClick={() => {
                        setSelectedUser(user);
                     }}
                     className={cn(
                        "relative flex cursor-pointer items-center gap-2 rounded p-2 pl-4 max-sm:text-sm",
                        {
                           "bg-[#282142]/50": selectedUser?.id === user.id,
                        },
                     )}
                  >
                     <img
                        src={user.profilePic ?? assets.avatar_icon}
                        alt={user.fullName}
                        className="aspect-[1/1] w-[35px] rounded-full"
                     />
                     <div className="flex flex-col leading-5">
                        <p>{user.fullName}</p>
                        {onlineUsers?.includes(user.id) ? (
                           <span className="text-xs text-green-400">
                              Online
                           </span>
                        ) : (
                           <span className="text-xs text-neutral-400">
                              Offline
                           </span>
                        )}
                     </div>
                     {unseenMessages[user.id] > 0 && (
                        <p className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/50 text-xs">
                           {unseenMessages[user.id]}
                        </p>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export { Sidebar };

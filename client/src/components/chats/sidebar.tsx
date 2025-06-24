import { useContext } from "react";
import assets, { userDummyData, type User } from "../../assets/assets";
import { cn } from "../../lib/utils";
import { AuthContext } from "../../context/auth-context";
import { Link } from "react-router-dom";

interface SidebarProps {
   selectedUser?: User;
   setSelectedUser: (value: User | undefined) => void;
}

const Sidebar = ({ selectedUser, setSelectedUser }: SidebarProps) => {
   const { logout } = useContext(AuthContext);

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
            <div className="my-5 flex items-center gap-2 rounded-full bg-[#282142] px-4 py-3">
               <img src={assets.search_icon} alt="Search" className="w-3" />
               <input
                  type="text"
                  className="flex-1 border-none bg-transparent text-xs text-white placeholder-[#8c8c8c] outline-none"
                  placeholder="Search chats"
               />
            </div>

            {/* Chat List */}
            <div className="flex flex-col">
               {userDummyData.map((user, index) => (
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
                        {index < 3 ? (
                           <span className="text-xs text-green-400">
                              Online
                           </span>
                        ) : (
                           <span className="text-xs text-neutral-400">
                              Offline
                           </span>
                        )}
                     </div>
                     {index > 2 && (
                        <p className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/50 text-xs">
                           {index + 1}
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

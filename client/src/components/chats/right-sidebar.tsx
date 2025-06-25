import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { cn } from "../../lib/utils";
import { AuthContext } from "../../context/auth-context";
import { ChatContext } from "../../context/chat-context";
import { axiosInstance } from "../../lib/axios";

const RightSidebar = () => {
   const { logout, token, onlineUsers } = useContext(AuthContext);
   const { selectedUser, messages } = useContext(ChatContext);
   const [bio, setBio] = useState("");

   const getImages = () => {
      const images = messages
         .filter((msg) => msg.image && msg.image.length > 0)
         .map((msg) => msg.image);

      return images;
   };

   useEffect(() => {
      const getProfile = async () => {
         const { data } = await axiosInstance.get("/profile", {
            headers: { token },
         });

         setBio(data.bio ?? "");
      };

      getProfile();
   }, [token]);

   return (
      <div
         className={cn(
            "relative w-full overflow-y-scroll bg-[#8185b2]/10 text-white",
            {
               "max-md:hidden": selectedUser,
            },
         )}
      >
         <div className="mx-auto flex flex-col items-center gap-2 pt-16 text-xs font-light">
            <img
               src={selectedUser?.profilePic ?? assets.avatar_icon}
               alt={selectedUser?.fullName}
               className="aspect-square w-20 rounded-full"
            />
            <h1 className="px-10 text-center text-xl font-medium">
               <span
                  className={cn("mr-2 inline-block size-2 rounded-full", {
                     "bg-green-500": onlineUsers?.includes(
                        selectedUser?.id as string,
                     ),
                     "bg-red-500": !onlineUsers?.includes(
                        selectedUser?.id as string,
                     ),
                  })}
               ></span>
               {selectedUser?.fullName}
            </h1>

            <p className="mx-auto px-10 text-center">{bio}</p>
         </div>

         <hr className="my-4 border-[#ffffff50]" />

         <div className="px-5 text-xs">
            <p>Medias</p>
            <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-2 overflow-y-scroll">
               {getImages().map((url) => (
                  <div
                     key={url}
                     onClick={() => window.open(url!)}
                     className="opacity-80 transition-all duration-200 hover:opacity-100"
                  >
                     <img
                        src={url!}
                        alt="Media"
                        className="cursor-pointer rounded-md"
                     />
                  </div>
               ))}
            </div>
         </div>

         <button
            onClick={logout}
            type="button"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 transform cursor-pointer rounded-full border-none bg-gradient-to-r from-purple-400 to-violet-600 px-20 py-2 text-sm font-light text-white"
         >
            Logout
         </button>
      </div>
   );
};

export { RightSidebar };

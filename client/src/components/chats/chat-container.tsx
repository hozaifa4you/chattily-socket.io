import { useEffect, useRef } from "react";
import moment from "moment";
import type { User } from "../../assets/assets";
import assets, { messagesDummyData } from "../../assets/assets";
import { cn } from "../../lib/utils";

interface ChatContainerProps {
   selectedUser?: User;
   setSelectedUser: (value: User | undefined) => void;
}

const ChatContainer = ({
   selectedUser,
   setSelectedUser,
}: ChatContainerProps) => {
   const scrollEnd = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (scrollEnd.current) {
         scrollEnd.current.scrollIntoView({
            behavior: "smooth",
         });
      }
   }, []);

   return selectedUser ? (
      <div className="relative h-full overflow-y-scroll backdrop-blur-lg">
         {/* header */}
         <div className="mx-4 flex items-center gap-3 border-b border-b-slate-500 py-3">
            <img
               src={assets.profile_martin}
               alt="Martin Johnson"
               className="w-8 rounded-full"
            />
            <p className="flex flex-1 items-center gap-2 text-lg text-white">
               Martin Johnson{" "}
               <span className="size-2 rounded-full bg-green-500"></span>
            </p>

            <img
               src={assets.arrow_icon}
               alt="Chat"
               className="max-w-7 cursor-pointer md:hidden"
               onClick={() => setSelectedUser(undefined)}
            />
            <img
               src={assets.help_icon}
               alt="Chat"
               className="max-w-5 max-md:hidden"
            />
         </div>

         {/* chat messages */}
         <div className="flex h-[calc(100%-120px)] flex-col overflow-y-scroll p-3 pb-6">
            {messagesDummyData.map((message) => (
               <div
                  key={message._id}
                  className={cn("flex items-end justify-end gap-2", {
                     "flex-row-reverse":
                        message.senderId !== "680f50e4f10f3cd28382ecf9",
                  })}
               >
                  {message.image ? (
                     <img
                        className="mb-8 max-w-[230px] overflow-hidden rounded-lg border border-gray-700"
                        src={message.image}
                        alt={message._id}
                     />
                  ) : (
                     <p
                        className={cn(
                           "mb-8 max-w-[200px] rounded-lg bg-violet-500/30 p-2 font-light break-all text-white md:text-sm",
                           {
                              "rounded-br-none":
                                 message.senderId ===
                                 "680f50e4f10f3cd28382ecf9",
                              "rounded-bl-none":
                                 message.senderId !==
                                 "680f50e4f10f3cd28382ecf9",
                           },
                        )}
                     >
                        {message.text}
                     </p>
                  )}

                  <div
                     className={cn("flex flex-col text-center text-xs", {
                        "items-end":
                           message.senderId === "680f50e4f10f3cd28382ecf9",
                     })}
                  >
                     <img
                        className="w-7 rounded-full"
                        src={
                           message.senderId === "680f50e4f10f3cd28382ecf9"
                              ? assets.avatar_icon
                              : assets.profile_martin
                        }
                        alt="Profile"
                     />
                     <p className="text-[10px] text-gray-500">
                        {moment(message.createdAt).format("LT")}
                     </p>
                  </div>
               </div>
            ))}

            <div ref={scrollEnd}></div>
         </div>

         {/* bottom area */}
         <div className="absolute right-0 bottom-0 left-0 flex items-center gap-3 p-3">
            <div className="flex flex-1 items-center rounded-full bg-gray-100/12 px-3">
               <input
                  type="text"
                  placeholder="Send a message"
                  className="flex-1 rounded-lg border-none p-3 text-sm text-white placeholder-gray-400 outline-none"
               />
               <input
                  type="file"
                  id="image"
                  accept="image/png,image/jpeg"
                  hidden
               />
               <label htmlFor="image">
                  <img
                     src={assets.gallery_icon}
                     alt="Image upload"
                     className="mr-2 w-5 cursor-pointer"
                  />
               </label>
            </div>
            <img
               src={assets.send_button}
               alt="Send"
               className="w-7 cursor-pointer"
            />
         </div>
      </div>
   ) : (
      <div className="flex flex-col items-center justify-center gap-2 bg-white/10 text-gray-500 max-md:hidden">
         <img
            src={assets.logo_icon}
            alt="Chat anytime, anywhere"
            className="max-w-16"
         />
         <p className="text-lg font-medium text-white">
            Chat anytime, anywhere
         </p>
      </div>
   );
};

export { ChatContainer };

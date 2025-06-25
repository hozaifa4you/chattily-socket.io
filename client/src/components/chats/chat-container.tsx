import { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import assets from "../../assets/assets";
import { cn } from "../../lib/utils";
import { ChatContext } from "../../context/chat-context";
import { AuthContext } from "../../context/auth-context";

const ChatContainer = () => {
   const [input, setInput] = useState("");
   const scrollEnd = useRef<HTMLDivElement>(null);
   const { selectedUser, setSelectedUser, sendMessage, getMessages, messages } =
      useContext(ChatContext);
   const { onlineUsers, user } = useContext(AuthContext);

   const handleSendMessage = async () => {
      if (input.trim() === "") return;

      await sendMessage(selectedUser?.id as string, {
         text: input.trim(),
      });

      setInput("");
   };

   const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         await sendMessage(selectedUser?.id as string, { image: file });
         setInput("");
         scrollEnd.current?.scrollIntoView({
            behavior: "smooth",
         });
      }
   };

   useEffect(() => {
      if (selectedUser) {
         getMessages(selectedUser.id);
         scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
      }
   }, [selectedUser]);

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
               src={selectedUser.profilePic ?? assets.avatar_icon}
               alt="Martin Johnson"
               className="w-8 rounded-full"
            />
            <p className="flex flex-1 items-center gap-2 text-lg text-white">
               {selectedUser.fullName}
               <span
                  className={cn("size-2 rounded-full", {
                     "bg-green-500": onlineUsers?.includes(selectedUser.id),
                     "bg-red-500": !onlineUsers?.includes(selectedUser.id),
                  })}
               ></span>
            </p>

            <img
               src={assets.arrow_icon}
               alt="Chat"
               className="max-w-7 cursor-pointer md:hidden"
               onClick={() => setSelectedUser(null)}
            />
            <img
               src={assets.help_icon}
               alt="Chat"
               className="max-w-5 max-md:hidden"
            />
         </div>

         {/* chat messages */}
         <div className="flex h-[calc(100%-120px)] flex-col overflow-y-scroll p-3 pb-6">
            {messages.map((message) => (
               <div
                  key={message.id}
                  className={cn("flex items-end justify-end gap-1", {
                     "flex-row-reverse": message.senderId !== user?.id,
                  })}
               >
                  {message.image ? (
                     <img
                        className="mb-4 max-w-[230px] overflow-hidden rounded-lg border border-gray-700"
                        src={message.image}
                        alt={message.id}
                     />
                  ) : (
                     <p
                        className={cn(
                           "mb-4 max-w-[200px] rounded-lg bg-violet-500/30 p-2 font-light break-all text-white md:text-sm",
                           {
                              "rounded-br-none": message.senderId === user?.id,
                              "rounded-bl-none": message.senderId !== user?.id,
                           },
                        )}
                     >
                        {message.text}
                     </p>
                  )}

                  <div
                     className={cn("flex flex-col text-center text-xs", {
                        "items-end": message.senderId === user?.id,
                     })}
                  >
                     <img
                        className="size-7 rounded-full object-cover object-center"
                        src={
                           message.senderId === user?.id
                              ? (user.profilePic ?? assets.avatar_icon)
                              : (selectedUser.profilePic ?? assets.avatar_icon)
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Enter" && input.trim()) {
                        handleSendMessage();
                     }
                  }}
               />
               <input
                  type="file"
                  id="image"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  hidden
                  onChange={handleSendImage}
               />
               <label htmlFor="image">
                  <img
                     src={assets.gallery_icon}
                     alt="Image upload"
                     className="mr-2 w-5 cursor-pointer"
                  />
               </label>
            </div>
            <button onClick={handleSendMessage} className="cursor-pointer">
               <img src={assets.send_button} alt="Send" className="w-7" />
            </button>
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

import { useState } from "react";
import type { User } from "../types/types";
import { io, Socket } from "socket.io-client";
import { env } from "../config/env";

const useConnectSocket = (userData?: User) => {
   const [socket, setSocket] = useState<Socket>();

   if (!userData || socket?.connected) {
      return;
   }

   const newSocket = io(env.backendUrl, {
      query: {
         userId: userData.id,
      },
   });
   newSocket.connect();
   setSocket(newSocket);

   newSocket.on("getOnlineUsers", (userIds) => {
      return userIds;
   });

   return function connectSocket() {};
};

export { useConnectSocket };

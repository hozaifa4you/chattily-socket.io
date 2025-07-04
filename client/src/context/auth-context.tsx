import {
   createContext,
   useCallback,
   useEffect,
   useState,
   type PropsWithChildren,
} from "react";
import type { User } from "../types/types";
import { authCheck } from "../lib/axios";
import { io, type Socket } from "socket.io-client";
import { env } from "../config/env";
import { toast } from "sonner";

type AuthContextType = {
   user?: User;
   token?: string;
   onlineUsers?: string[];
   socket?: Socket;
   setToken: (token?: string) => void;
   setUser: (user?: User) => void;
   connectSocket: (user: User) => void;
   setOnlineUsers: (userIds: string[]) => void;
   logout: () => void;
};

const initialContext: AuthContextType = {
   setToken: function (): void {
      throw new Error("Function not implemented.");
   },
   setUser: function (): void {
      throw new Error("Function not implemented.");
   },
   connectSocket: function (_user: User): void {
      throw new Error("Function not implemented.");
   },
   setOnlineUsers: function (): void {
      throw new Error("Function not implemented.");
   },
   logout: function (): void {
      throw new Error("Function not implemented.");
   },
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
   const [token, setToken] = useState<string | undefined>(
      localStorage.getItem("token") ?? undefined,
   );
   const [socket, setSocket] = useState<Socket>();
   const [user, setUser] = useState<User>();
   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

   const connectSocket = useCallback((userData: User) => {
      const newSocket = io(env.backendUrl, {
         query: {
            userId: userData.id,
         },
      });

      newSocket.on("connect", () => {
         setSocket(newSocket);
      });

      newSocket.on("getOnlineUsers", (userIds) => {
         setOnlineUsers(userIds);
      });

      return () => {
         newSocket.disconnect();
      };
   }, []);

   const logout = () => {
      setToken(undefined);
      setUser(undefined);
      setOnlineUsers([]);
      socket?.disconnect();
      localStorage.removeItem("token");
      toast.info("Logout Successful", { description: "Successfully logout" });
   };

   const contextValues: AuthContextType = {
      token,
      user,
      socket,
      onlineUsers,
      setToken,
      setUser,
      connectSocket,
      setOnlineUsers,
      logout,
   };

   useEffect(() => {
      if (token) {
         authCheck(token).then((authUser) => {
            if (authUser) {
               setUser(authUser);
               connectSocket(authUser);
            }
         });
      }
   }, [connectSocket, token]);

   useEffect(() => {
      return () => {
         if (socket) {
            socket.disconnect();
         }
      };
   }, [socket]);

   return (
      <AuthContext.Provider value={contextValues}>
         {children}
      </AuthContext.Provider>
   );
};

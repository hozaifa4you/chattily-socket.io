import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
   type PropsWithChildren,
} from "react";
import { AuthContext } from "./auth-context";
import { axiosInstance } from "../lib/axios";
import type { Message, User } from "../types/types";
import { AxiosError } from "axios";
import { toast } from "sonner";

type ChatContextType = {
   messages: Message[];
   users: User[];
   setMessages: (messages: Message[]) => void;
   selectedUser: User | null;
   setSelectedUser: (user: User | null) => void;

   getUsers: () => Promise<void>;
   getMessages: (targetId: string) => Promise<void>;
   sendMessage: (
      targetId: string,
      message: {
         text?: string | undefined;
         image?: File | undefined;
      },
   ) => Promise<void>;
   subscribeToMessage: () => void;
   unsubscribeToMessage: () => void;
   unseenMessages: Record<string, number>;
};

const defaultChatContext: ChatContextType = {
   getUsers: function (): Promise<void> {
      throw new Error("Function not implemented.");
   },
   getMessages: function (targetId: string): Promise<void> {
      throw new Error("Function not implemented.");
   },
   sendMessage: function (
      targetId: string,
      message: {
         text?: string | undefined;
         image?: File | undefined;
      },
   ): Promise<void> {
      throw new Error("Function not implemented.");
   },
   subscribeToMessage: function (): void {
      throw new Error("Function not implemented.");
   },
   unsubscribeToMessage: function (): void {
      throw new Error("Function not implemented.");
   },
   messages: [],
   users: [],
   setMessages: function (message: Message[]): void {
      throw new Error("Function not implemented.");
   },
   selectedUser: null,
   setSelectedUser: function (user: User | null): void {
      throw new Error("Function not implemented.");
   },
   unseenMessages: {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext(defaultChatContext);

export const ChatProvider = ({ children }: PropsWithChildren) => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
      {},
   );

   const { socket, token } = useContext(AuthContext);

   const getUsers = async () => {
      const { data } = await axiosInstance.get("/users/connected-users", {
         headers: { token },
      });
      setUsers(data);
   };

   const getMessages = async (targetId: string) => {
      try {
         const { data } = await axiosInstance.get(`/messages/${targetId}`);

         setMessages(data);
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error("Message Error", {
               description: error.response?.data.message,
            });
         }
      }
   };

   const sendMessage = async (
      targetId: string,
      message: { text?: string; image?: File },
   ) => {
      try {
         const formData = new FormData();
         if (message.image) {
            formData.append("messages", message.image);
         }
         if (message.text) {
            formData.append("text", message.text);
         }

         const { data } = await axiosInstance.post(
            `/messages/${targetId}`,
            formData,
            {
               headers: { token, "Content-Type": "multipart/form-data" },
            },
         );
         setMessages((prev) => [...prev, data]);
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error("Send Message", {
               description: error.response?.data.message,
            });
         }
      }
   };

   const subscribeToMessage = useCallback(() => {
      if (!socket) return;

      socket.on("newMessage", (newMessage: Message) => {
         if (selectedUser && newMessage.senderId === selectedUser.id) {
            newMessage.seen = true;
            setMessages((prev) => [...prev, newMessage]);
            axiosInstance.patch(`/messages/${newMessage.id}`);
         } else {
            setUnseenMessages((prev) => ({
               ...prev,
               [newMessage.senderId]: prev[newMessage.senderId]
                  ? prev[newMessage.senderId] + 1
                  : 1,
            }));
         }
      });
   }, [selectedUser, socket]);

   const unsubscribeToMessage = useCallback(() => {
      if (socket) socket.off("newMessage");
   }, [socket]);

   const values: ChatContextType = {
      getUsers,
      getMessages,
      sendMessage,
      subscribeToMessage,
      unsubscribeToMessage,
      messages,
      selectedUser,
      setMessages,
      setSelectedUser,
      users,
      unseenMessages,
   };

   useEffect(() => {
      subscribeToMessage();

      return () => unsubscribeToMessage();
   }, [subscribeToMessage, unsubscribeToMessage, socket, selectedUser]);

   return (
      <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
   );
};

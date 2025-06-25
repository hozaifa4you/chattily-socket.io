export type User = {
   id: string;
   fullName: string;
   email: string;
   profilePic: string | null;
};

export type Message = {
   id: string;
   senderId: string;
   receiverId: string;
   text: string | null;
   seen: boolean;
   createdAt: string;
   image: string | null;
};

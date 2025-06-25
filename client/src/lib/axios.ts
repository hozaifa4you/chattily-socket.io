import axios from "axios";
import { env } from "../config/env";
import { toast } from "sonner";
import type { User } from "../types/types";

export const axiosInstance = axios.create({
   baseURL: env.backendUrl + "/api/v1",
   headers: {
      "Content-Type": "application/json",
   },
});

export const authCheck = async (token: string) => {
   try {
      const { data } = await axiosInstance.patch(
         "/auth/auth-check",
         {},
         {
            headers: { token },
         },
      );

      if (data.success) {
         return data.user as User;
      } else {
         return null;
      }
   } catch (error) {
      localStorage.removeItem("token");
      toast.error("Authentication Failed", {
         description: (error as unknown as Error).message,
      });
   }
};

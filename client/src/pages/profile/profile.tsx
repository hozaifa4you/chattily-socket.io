import { useContext, useEffect, useState, type ChangeEvent } from "react";
import assets from "../../assets/assets";
import { cn } from "../../lib/utils";
import { AuthContext } from "../../context/auth-context";
import { axiosInstance } from "../../lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

const ProfilePage = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [isUploading, setIsUploading] = useState(false);
   const { token, setUser } = useContext(AuthContext);
   const [name, setName] = useState("");
   const [bio, setBio] = useState("");
   const [profilePic, setProfilePic] = useState<string>("");

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setIsLoading(true);

      try {
         const { data } = await axiosInstance.put(
            "/profile",
            { fullName: name, bio, profilePic },
            { headers: { token } },
         );

         setUser(data);

         toast.success("Profile Updated", {
            description: "Your profile has been updated successfully.",
         });
      } catch (error) {
         console.log(error);

         if (error instanceof AxiosError) {
            toast.error("Profile Update Failed", {
               description:
                  error.response?.data.message ?? "Something went wrong.",
            });
         }
      } finally {
         setIsLoading(false);
      }
   }

   const changeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
      setIsUploading(true);
      if (event.target.files) {
         const file = event.target.files[0];

         try {
            const formData = new FormData();
            formData.append("avatar", file);

            const { data } = await axiosInstance.post(
               "/uploads/avatars",
               formData,
               { headers: { token, "Content-Type": "multipart/form-data" } },
            );

            console.log(data);

            setProfilePic(data.avatarUrl);

            toast.success("Avatar Upload", {
               description: "Avatar successfully uploaded",
            });
         } catch (error) {
            console.log(error);

            if (error instanceof AxiosError) {
               toast.error("Avatar Upload Failed", {
                  description:
                     error.response?.data.message ??
                     "File size not more than 500kb.",
               });
            }
         } finally {
            setIsUploading(false);
         }
      }
   };

   useEffect(() => {
      const getProfile = async () => {
         const { data } = await axiosInstance.get("/profile", {
            headers: { token },
         });

         setName(data.fullName);
         setBio(data.bio ?? "");
         setProfilePic(data.profilePic ?? "");
      };

      getProfile();
   }, [token]);

   return (
      <div className="flex min-h-screen items-center justify-center bg-cover bg-no-repeat">
         <div className="flex w-5/6 max-w-2xl items-center justify-between rounded-lg border-2 border-gray-600 text-gray-300 backdrop-blur-2xl max-sm:flex-col-reverse">
            <form
               onSubmit={handleSubmit}
               className="flex flex-1 flex-col gap-5 p-10"
            >
               <h3 className="text-lg">Profile Details</h3>
               <label
                  htmlFor="avatar"
                  className="flex cursor-pointer items-center gap-3"
               >
                  <input
                     onChange={changeAvatar}
                     type="file"
                     id="avatar"
                     accept="image/*"
                     hidden
                  />
                  <img
                     src={profilePic ? profilePic : assets.avatar_icon}
                     alt="User"
                     className={cn("size-12 object-cover object-center", {
                        "rounded-full": profilePic,
                     })}
                  />
                  Upload Profile Image
               </label>

               <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="rounded-md border border-gray-500 p-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />

               <textarea
                  name="bio"
                  id="bio"
                  rows={4}
                  className="rounded-md border border-gray-500 p-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  placeholder="Your bio"
               ></textarea>

               <button className="btn-primary">
                  {isLoading
                     ? "Saving.."
                     : isUploading
                       ? "Uploading.."
                       : "Save"}
               </button>
            </form>
            <img
               src={profilePic ?? assets.logo_icon}
               alt="Logo"
               className="mx-10 aspect-square max-w-44 rounded-full max-sm:mt-10"
            />
         </div>
      </div>
   );
};

export { ProfilePage };

import { useState } from "react";
import assets from "../../assets/assets";
import { cn } from "../../lib/utils";

const ProfilePage = () => {
   const [selectedImage, setSelectedImage] = useState<File | null>(null);
   const [name, setName] = useState("Martin Johnson");
   const [bio, setBio] = useState("Hello! I'm using Chattily.");

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
   }

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
                     onChange={(e) =>
                        setSelectedImage(
                           e.target.files && e.target.files[0]
                              ? e.target.files[0]
                              : null,
                        )
                     }
                     type="file"
                     id="avatar"
                     accept="image/*"
                     hidden
                  />
                  <img
                     src={
                        selectedImage
                           ? URL.createObjectURL(selectedImage)
                           : assets.avatar_icon
                     }
                     alt="User"
                     className={cn("size-12", {
                        "rounded-full": selectedImage,
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
               ></textarea>

               <button className="btn-primary">Save</button>
            </form>
            <img
               src={assets.logo_icon}
               alt="Logo"
               className="mx-10 aspect-square max-w-44 rounded-full max-sm:mt-10"
            />
         </div>
      </div>
   );
};

export { ProfilePage };

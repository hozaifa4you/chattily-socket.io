import type { User } from "../../assets/assets";
import assets, { imagesDummyData } from "../../assets/assets";
import { cn } from "../../lib/utils";

interface RightSidebarProps {
   selectedUser?: User;
}

const RightSidebar = ({ selectedUser }: RightSidebarProps) => {
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
            <h1 className="mx-auto flex items-center gap-2 px-10 text-xl font-medium">
               <span className="block size-2 rounded-full bg-green-500"></span>
               {selectedUser?.fullName}
            </h1>

            <p className="mx-auto px-10 text-center">{selectedUser?.bio}</p>
         </div>

         <hr className="my-4 border-[#ffffff50]" />

         <div className="px-5 text-xs">
            <p>Medias</p>
            <div className="mt-2 grid max-h-[200px] grid-cols-2 gap-4 overflow-y-scroll opacity-80">
               {imagesDummyData.map((url) => (
                  <div key={url} onClick={() => window.open(url)}>
                     <img
                        src={url}
                        alt="Media"
                        className="cursor-pointer rounded-md"
                     />
                  </div>
               ))}
            </div>
         </div>

         <button
            type="button"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 transform cursor-pointer rounded-full border-none bg-gradient-to-r from-purple-400 to-violet-600 px-20 py-2 text-sm font-light text-white"
         >
            Logout
         </button>
      </div>
   );
};

export { RightSidebar };

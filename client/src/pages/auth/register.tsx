import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

const RegisterPage = () => {
   const [fullName, setFullName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [bio, setBio] = useState("");
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [isChecked, setIsChecked] = useState(false);
   const navigate = useNavigate();
   const auth = useContext(AuthContext);

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!isChecked) {
         toast.warning("Are you agree?", {
            description: "Please read the terms and conditions.",
         });
         return;
      }

      setIsSubmitted(true);

      if (isSubmitted) {
         try {
            const { data } = await axiosInstance.post("/auth/register", {
               fullName,
               email,
               password,
               bio,
            });

            auth.setToken(data.token);
            auth.setUser(data.user);
            localStorage.setItem("token", data.token);
            toast.success("Register Successful", {
               description: "New user register successful",
            });
         } catch (error) {
            if (error instanceof AxiosError) {
               toast.error("Register Failed", {
                  description: error.response?.data.message,
               });
            }
         }
      }
   };

   useEffect(() => {
      if (auth.token && auth.user) {
         navigate("/");
      }
   }, [auth.token, auth.user, navigate]);

   return (
      <div className="flex h-full min-h-screen items-center justify-center gap-8 bg-cover bg-center backdrop-blur-2xl max-sm:flex-col sm:justify-evenly">
         {/* left side */}
         <img
            src={assets.logo_big}
            alt="Chattily"
            className="w-[min(30vw,250px)]"
         />

         {/* right */}
         <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-lg border-2 border-gray-500 bg-white/8 p-6 text-white shadow-lg"
         >
            <h2 className="flex items-center justify-between text-2xl font-medium">
               Sign up
               <button type="button" onClick={() => setIsSubmitted(false)}>
                  <img
                     src={assets.arrow_icon}
                     alt="Arrow"
                     className="w-5 cursor-pointer"
                  />
               </button>
            </h2>

            {!isSubmitted && (
               <>
                  <input
                     className="rounded-md border border-gray-500 p-2 focus:outline-none"
                     type="text"
                     name="fullName"
                     id="fullName"
                     required
                     placeholder="Full Name"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                  />

                  <input
                     className="rounded-md border border-gray-500 p-2 focus:outline-none"
                     type="email"
                     name="email"
                     id="email"
                     required
                     placeholder="Email Address"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                     className="rounded-md border border-gray-500 p-2 focus:outline-none"
                     type="password"
                     name="password"
                     id="password"
                     required
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </>
            )}

            {isSubmitted && (
               <textarea
                  rows={4}
                  className="rounded-md border border-gray-500 p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter your bio here..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
               ></textarea>
            )}

            <button
               className="cursor-pointer rounded-md bg-purple-400 bg-gradient-to-r to-violet-600 py-3 text-white"
               type="submit"
            >
               Create Account
            </button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
               <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
               />
               <label htmlFor="terms">
                  Agree to the terms and privacy policy?
               </label>
            </div>

            <div>
               <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                     to="/login"
                     className="cursor-pointer font-medium text-violet-500"
                  >
                     Login here
                  </Link>
               </p>
            </div>
         </form>
      </div>
   );
};

export { RegisterPage };

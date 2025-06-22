import { useState } from "react";
import assets from "../../assets/assets";
import { Link } from "react-router-dom";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isSubmitted, setIsSubmitted] = useState(false);

   return (
      <div className="flex h-full min-h-screen items-center justify-center gap-8 bg-cover bg-center backdrop-blur-2xl max-sm:flex-col sm:justify-evenly">
         {/* left side */}
         <img
            src={assets.logo_big}
            alt="Chattily"
            className="w-[min(30vw,250px)]"
         />

         {/* right */}
         <form className="flex flex-col gap-6 rounded-lg border-2 border-gray-500 bg-white/8 p-6 text-white shadow-lg">
            <h2 className="flex items-center justify-between text-2xl font-medium">
               Sign in
               {isSubmitted && (
                  <button onClick={() => setIsSubmitted(false)}>
                     <img
                        src={assets.arrow_icon}
                        alt="Arrow"
                        className="w-5 cursor-pointer"
                     />
                  </button>
               )}
            </h2>

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

            <button
               className="cursor-pointer rounded-md bg-purple-400 bg-gradient-to-r to-violet-600 py-3 text-white"
               type="submit"
            >
               Login Now
            </button>

            <div>
               <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                     to="/register"
                     className="cursor-pointer font-medium text-violet-500"
                  >
                     Register here
                  </Link>
               </p>
            </div>
         </form>
      </div>
   );
};

export { LoginPage };

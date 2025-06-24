import { Navigate, Route, Routes } from "react-router-dom";

import { Homepage } from "./pages";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { ProfilePage } from "./pages/profile/profile";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";

const App = () => {
   const { token } = useContext(AuthContext);

   return (
      <div className="bg-[url(./assets/bgImage.svg)] bg-contain">
         <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
               path="/login"
               element={!token ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
               path="/register"
               element={!token ? <RegisterPage /> : <Navigate to="/" />}
            />
            <Route
               path="profile"
               element={token ? <ProfilePage /> : <Navigate to="/login" />}
            />
         </Routes>
      </div>
   );
};

export default App;

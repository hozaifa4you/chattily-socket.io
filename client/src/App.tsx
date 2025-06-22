import { Route, Routes } from "react-router-dom";

import { Homepage } from "./pages";
import { LoginPage } from "./pages/auth/login";
import { RegisterPage } from "./pages/auth/register";
import { ProfilePage } from "./pages/profile/profile";

const App = () => {
   return (
      <div className="bg-[url(./assets/bgImage.svg)] bg-contain">
         <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
         </Routes>
      </div>
   );
};

export default App;

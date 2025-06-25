import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { AuthContextProvider } from "./context/auth-context.tsx";
import { ChatProvider } from "./context/chat-context.tsx";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <AuthContextProvider>
         <ChatProvider>
            <BrowserRouter>
               <Toaster closeButton richColors position="top-right" />
               <App />
            </BrowserRouter>
         </ChatProvider>
      </AuthContextProvider>
   </StrictMode>,
);

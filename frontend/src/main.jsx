  import "./index.css";
  import App from "./App.jsx";
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import UserContext from "./context/userContext.jsx";
  import CaptainProvider from "./context/CaptainProvider";
  import { StrictMode } from "react";


  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <UserContext>
      <BrowserRouter>
      <CaptainProvider>
      <App />
      </CaptainProvider>
    </BrowserRouter>
    </UserContext>
    </StrictMode>
  );


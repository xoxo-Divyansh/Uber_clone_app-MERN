import React from "react";
import{Route, Routes } from "react-router-dom";
import Home from "./pages/home"
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptionLogin from "./pages/CaptianLogin";
import CaptianSignup from "./pages/CaptianSignup";
import { UserDataContext } from "./context/UserDataContext";


const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/user-login" element={<UserLogin />}/>
      <Route path="/user-signup" element={<UserSignup />}/>
      <Route path="/captian-login" element={<CaptionLogin />}/>
      <Route path="/captian-signup" element={<CaptianSignup />}/>
    </Routes>
)};

export default App;

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import  UserLogout  from "./pages/UserLogout";
import UserProtectWrapper from "./components/UserProtectWrapper";
// Cap:
import CaptainHome from "./pages/CaptainHome.jsx";
import CaptainLogin from "./pages/captainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import CaptainProtectWrapper from "./components/CaptainProtectWrapper.jsx"
import CaptainLogout from "./pages/CaptainLogout.jsx";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />

      <Route path="/home" element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        }
      />
      <Route path="user/logout" 
      element={<UserProtectWrapper>
        <UserLogout />
      </UserProtectWrapper>
    } />
      {/* cap: */}
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />

     <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>
        } />
     <Route path='/captain-logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />

    </Routes>
  );
};

export default App;

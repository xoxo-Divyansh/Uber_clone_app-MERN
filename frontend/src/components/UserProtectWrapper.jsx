import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectWrapper = ({ children }) => {
  const token  = localStorage.getItem('token')
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate("/user/login");
    }
  }, [token,navigate]);

  return <> {children} </>; //render the children properly
};

export default UserProtectWrapper;

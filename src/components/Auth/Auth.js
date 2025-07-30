import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUPForm from "./SignUPForm";
import Home from "./Pages/Home";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false); 
  const [showLogin, setShowLogin] = useState(true); 

  const handleLoginStatus = (status) => {
    setIsLogin(status);
  };

  const handleToggle = () => {
    setShowLogin((prev) => !prev);
  };

  if (isLogin) {
    return <Home />;
  }

  return (
    <div>
      {showLogin ? (
        <>
        <div className=' d-flex justify-content-center align-items-center vh-100 bg-success flex-column '>
          <LoginForm onLoginStatus={handleLoginStatus} />
          <div className="text-center mt-3">
            <p className="text-light">
              Don't have an account?{" "}
              <span className="cursor-pointer text-info" onClick={handleToggle}>
                Sign Up
              </span>
            </p>
          </div>
          </div>
        </>
      ) : (
        <>
           <div className=' d-flex justify-content-center align-items-center vh-100 bg-success flex-column '>
          <SignUPForm />
          <div className="text-center mt-3">
            <p className="text-light">
              Already have an account?{" "}
              <span className="cursor-pointer text-info" onClick={handleToggle}>
                Login
              </span>
            </p>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;

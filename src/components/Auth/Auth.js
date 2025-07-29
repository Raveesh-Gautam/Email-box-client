import React, { useState } from 'react'
import LoginForm from './LoginForm';
import SignUPForm from './SignUPForm';
import Home from './Pages/Home';

const Auth = () => {
    const [isLogin,setIsLogin]=useState(false);
    const checkLogin=(loginStatus)=>{
setIsLogin(loginStatus);
    }
  return (
    <div>
        {isLogin===true? <Home/> :<LoginForm  onLoginStatus={checkLogin}/> }
    
    {/* <SignUPForm /> */}

    </div>
  )
}

export default Auth
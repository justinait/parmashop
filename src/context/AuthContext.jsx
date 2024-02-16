import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'

export const AuthContext = createContext();

function AuthContextComponent({children}) {
    
  const [user, setUser] = useState({});
  const [isLogged, setIsLogged] = useState(false);
  
  const handleLogin=( finallyUser)=>{
    setUser(finallyUser);
    setIsLogged(true);
  }
  
  const handleLogOut = () =>{
    setUser({});
    setIsLogged(false);
  }

  let data =[
    handleLogOut,
    handleLogin,
    user,
    isLogged
  ]
  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextComponent
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function ProtectedAdmin() {
  const [user] = useContext(AuthContext);
  const rolAdmin = import.meta.env.VITE_ROLADMIN
  return (
    <>
      {
        user?
        // .rol === import.meta.env.VITE_ROLADMIN ?
        <Outlet /> :
        <Navigate to="/"/>
      }
    </>
  )
}

export default ProtectedAdmin
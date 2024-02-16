import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {db, onSignIn} from '../../firebaseConfig'
import {collection, doc, getDoc} from "firebase/firestore"
import { AuthContext } from "../../context/AuthContext";
import './Login.css'
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
  
  const [handleLogOut, handleLogin, user, isLogged] = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [userCredentials, setUserCredentials] = useState({
    email:'',
    password:''
  })

  const handleChange = (e) => {
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await onSignIn(userCredentials);
      
      if(res.user){
        
        const userCollection = collection(db, "users");
        const userRef = doc(userCollection, res.user.uid)
        const userDoc = await getDoc(userRef);

        let finallyUser = {
          email: res.user.email,
          rol: userDoc.data().rol
        }

        handleLogin(finallyUser);
        navigate('/');
      }  
    } catch (error) {
      console.log(error);  
    }
  }
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <div className="input">
          <input
            type="text"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className="input"
          />
        </div>
        <div className="passwordContainer">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={handleChange}
            placeholder="Contraseña"
            className="input"
          />
          <span
            onClick={handleClickShowPassword}
            className="passwordToggle"
          >
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </span>
        </div>
        <button
          type="submit"
          className="button"
        >
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default Login;
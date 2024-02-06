import React from 'react'
import logo from '/public/logo.png'
import './Navbar.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

function Navbar() {
  return (
    <div className='header'>
      <img src={logo} alt="PARMA" className='logoNavbar'/>
      
      <div className='rightNavbar'>
        <p>SHOP</p>
        <p> <ShoppingCartOutlinedIcon/> </p>
      </div>
    </div>
  )
}

export default Navbar
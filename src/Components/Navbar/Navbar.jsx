import React, { useState } from 'react'
import logo from '/public/logo.png'
import './Navbar.css'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpen = () => {
    return setOpenMenu(true);
  }
  
  const handleClose = () => {
    return setOpenMenu(false);
  }

  return (
    <div className='header'>
      <img src={logo} alt="PARMA" className='logoNavbar'/>
      {
        !openMenu &&
        <div className='rightNavbar'>
          < ShoppingCartOutlinedIcon/>
          < MenuRoundedIcon onClick={handleOpen} />
        </div>
      }
      
      {openMenu &&
        <div className='dropdownHeader'>
          
          <CloseIcon onClick={handleClose} className='closeIconNavbar'/>
          <div className='dropdownItemsContainer'>
            <Link to='/'>INICIO</Link>

            <Link to='/product'>Todos los productos</Link>
            <Link to='/product'>NEW</Link>
            <Link to='/product' onClick={handleClose}>Remeras</Link>
            <Link to='/product' onClick={handleClose}>Camisas</Link>
            <Link to='/product' onClick={handleClose}>Pantalones</Link>
            <Link to='/product' onClick={handleClose}>Bermudas</Link>
            <Link to='/product' onClick={handleClose}>Buzos</Link>
            <Link to='/product' onClick={handleClose}>Hoodies</Link>
            <Link to='/product' onClick={handleClose}>Accesorios</Link>
            
            <p>Guía de talles</p>
            <p>Política de cambios</p>
            <p>MI CARRITO</p>
            
          </div>
        </div>
      }
    </div>
  )
}

export default Navbar
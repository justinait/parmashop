import React, { useState } from 'react'
import logo from '/public/logo.png'
import './Navbar.css'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseIcon from '@mui/icons-material/Close';

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
            <p>INICIO</p>
            
            <p>NEW</p>
            <p>Remeras</p>
            <p>Camisas</p>
            <p>Pantalones</p>
            <p>Bermudas</p>
            <p>Buzos</p>
            <p>Hoodies</p>
            <p>Accesorios</p>
            
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
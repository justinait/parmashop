import React, { useState } from 'react'
import logo from '/public/logo.png'
import './Navbar.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartSharpIcon from '@mui/icons-material/ShoppingCartSharp';
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
      
      <div className='rightNavbar'>
        
        <ShoppingCartOutlinedIcon/>
        < MenuRoundedIcon onClick={handleOpen} />

      </div>
      
      {openMenu &&
          <div>
            <CloseIcon onClick={handleClose}/>
            <div className='dropdownHeader'>
              <p>NEW</p>
              <p>Remeras</p>
              <p>Camisas</p>
              <p>Pantalones</p>
              <p>Bermudas</p>
              <p>Buzos</p>
              <p>Hoodies</p>
              <p>Accesorios</p>
            </div>
          </div>
        }
    </div>
  )
}

export default Navbar
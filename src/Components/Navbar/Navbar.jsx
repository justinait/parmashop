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
      <Link to='/' style={{display: 'flex'}}> <img src={logo} alt="PARMA" className='logoNavbar' onClick={handleClose}/></Link>
      {
        !openMenu &&
        <div className='rightNavbar'>
          < ShoppingCartOutlinedIcon className='iconsNavbar'/>
          < MenuRoundedIcon onClick={handleOpen} className='iconsNavbar'/>
        </div>
      }
      
      {openMenu &&
        <div className='dropdownHeader'>
          
          <CloseIcon onClick={handleClose} className='closeIconNavbar iconsNavbar'/>
          <div className='dropdownItemsContainer'>
            <Link to='/' onClick={handleClose}>INICIO</Link>

            <Link to='/category' onClick={handleClose}>Todos los productos</Link>
            <Link to='/category' onClick={handleClose}>NEW</Link>
            <Link to='/tshirts' onClick={handleClose}>Remeras</Link>
            <Link to='/category' onClick={handleClose}>Camisas</Link>
            <Link to='/category' onClick={handleClose}>Pantalones</Link>
            <Link to='/shorts' onClick={handleClose}>Bermudas</Link>
            <Link to='/category' onClick={handleClose}>Buzos</Link>
            <Link to='/category' onClick={handleClose}>Hoodies</Link>
            <Link to='/category' onClick={handleClose}>Accesorios</Link>
            
            <Link to='/changes' onClick={handleClose}>Política de cambios</Link>
            <Link to='/cart' onClick={handleClose}>Carrito</Link>

            {/* {
            isLogged &&
            <>
              <Link to='/dashboard' onClick={closeDropdown} className='dropdownItem'><Dashboard/></Link>
              <p className="dropdownItem"><LogoutIcon onClick={handleLogOut} /></p>
              
            </> 
            } */}
            
          </div>
        </div>
      }
    </div>
  )
}

export default Navbar
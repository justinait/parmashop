import React, { useContext, useEffect, useState } from 'react'
import logo from '/logo.png'
import './Navbar.css'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { onLogOut } from '../../firebaseConfig';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/AuthContext';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { CartContext } from '../../context/CartContext';
import ViewListIcon from '@mui/icons-material/ViewList';
import CartWidget from './CartWidget';

function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('home')
  const navigate = useNavigate();

  const [handleLogOut, handleLogin, user, isLogged] = useContext(AuthContext);
  const {totalProducts} = useContext(CartContext);
  

  const handleOpen = () => {
    return setOpenMenu(true);
  }
  
  const handleClose = (id) => {
    setOpenMenu(false);
    if(id){
      setSelectedCategory(id);
    }
  }
  const logoutButton = ()=>{
    onLogOut();
    handleLogOut();
    navigate("/login")
  }
  const categorys = [
    { name: 'Todos los productos', id: 'category', className: '' },
    { name: 'NUEVO', id: 'NUEVO', className: ''},
    { name: 'SALE', id: 'sale', className: '' },
    { name: 'Remeras', id: 'Remeras', className: '' },
    { name: 'Camisas', id: 'Camisas', className: ''},
    { name: 'Pantalones', id: 'Pantalones', className: ''},
    { name: 'Abrigos', id: 'Abrigos', className: ''},
    { name: 'Buzos', id: 'Buzos', className: ''},
    { name: 'Accesorios', id: 'Accesorios', className: ''},
    // { name: 'Carrito', id: 'cart', className: ''},
    { name: 'Política de cambios', id: 'changes', className: ''},
  ]

  return (
    <div className='header'>
      <Link to='/' style={{display: 'flex'}}> <img src={logo} alt="PARMA" className='logoNavbar' onClick={handleClose}/></Link>
      {
        !openMenu &&
        <div className='rightNavbar'>
          <div className='cartNavbar'>
            <CartWidget />
            <span className="cartItemCount">{totalProducts}</span>
          </div>
          < MenuRoundedIcon onClick={handleOpen} className='iconsNavbar menuIcon'/>
        </div>
      }
      
      {openMenu &&
        <div className='dropdownHeader'>
          
          <CloseIcon onClick={handleClose} className='closeIconNavbar iconsNavbar menuIcon'/>
          <div className='dropdownItemsContainer'>
            <Link to='/' onClick={()=>handleClose('home')} className={selectedCategory == 'home'? 'activeNavbar': ''}>Inicio</Link>
            {categorys.map((e, i)=> {
              return <Link key={i} to={`/${e.id}`} onClick={()=>handleClose(e.id)} className={selectedCategory == e.id? 'activeNavbar': ''}>{e.name}</Link>
            })}
            
            { 
              user.rol == import.meta.env.VITE_ROLADMIN &&
              <>
                <Link to='/dashboard' onClick={handleClose} className='dropdownItem' ><DashboardCustomizeIcon fontSize='small'/>Administrar</Link>
                <Link to='/orders' onClick={handleClose} className='dropdownItem'><ViewListIcon fontSize='small'/>Pedidos</Link>
                <p className="dropdownItem"><LogoutIcon onClick={logoutButton} fontSize='small'/>Cerrar sesión</p>
              </>
            }
            
          </div>
        </div>
      }
    </div>
  )
}

export default Navbar
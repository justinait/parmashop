import React from 'react'
import logo from '/public/logo.png'
import './Navbar.css'

function Navbar() {
  return (
    <div className='header'>
      <img src={logo} alt="PARMA" className='logoNavbar'/>
      
      <div className='rightNavbar'>
        <p>SHOP</p>
      </div>
    </div>
  )
}

export default Navbar
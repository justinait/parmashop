import React from 'react'
import logoFooter from '/public/logowhite.png'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlaceIcon from '@mui/icons-material/Place';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Link } from 'react-router-dom';

function Footer() {

  return (
    <div className='footerBox'>
      {/* Buscanos en Instagram <br /> */}
      
      <img src={logoFooter} alt="PARMA" className='logoFooter' />
      <p className='location'>  Buenos Aires 60 | Paseo de las Luces. <br /> Paraná, Entre Ríos.</p>
      
      <div className='location'>
        <p>CONTACTANOS</p>
        <strong>Política de Cambio</strong>
      </div>

      <div className='footerLinksContainer'>
        <Link to='https://www.instagram.com/parmashop_' target='blank'> <InstagramIcon className='footerIcons'/> </Link>
        <Link> <WhatsAppIcon className='footerIcons'/> </Link>
        <Link> <MailOutlineIcon className='footerIcons'/> </Link>
      </div>
      <p className='justina'>Desarrollada por Justina Iturraspe</p>
    </div>
  )
}

export default Footer

{/* <ul>
    <h6>Categorías</h6>
    <p className='footerItemLinks'><Link>Remeras</Link></p>
    <p className='footerItemLinks'><Link>Camisas</Link></p>
    <p className='footerItemLinks'><Link>Pantalones</Link></p>
    <p className='footerItemLinks'><Link>Bermudas</Link></p>
    <p className='footerItemLinks'><Link>Accesorios</Link></p>
    <p className='footerItemLinks'><Link>Hoodies</Link></p>
    <p className='footerItemLinks'><Link>Abrigos</Link></p>
</ul> */}
        
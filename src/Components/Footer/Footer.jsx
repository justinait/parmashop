import React from 'react'
import logoFooter from '/public/logowhite.png'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlaceIcon from '@mui/icons-material/Place';
import { Link } from 'react-router-dom';

function Footer() {

  return (
    <div className='footerBox'>

        {/* Buscanos en Instagram <br /> */}
        
        <img src={logoFooter} alt="PARMA" className='logoFooter' />
        <div className='footerLinksContainer'>
          <Link to='https://www.instagram.com/parmashop_' target='blank'> <InstagramIcon className='footerIcons'/> </Link>
          <Link> <WhatsAppIcon className='footerIcons'/> </Link>
        </div>
        <p className='location'>  <strong>Buenos Aires 60</strong> - Paseo de las Luces. <br /> Paraná, Entre Ríos.</p>
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
        
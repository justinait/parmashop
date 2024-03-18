import React from 'react'
import logoFooter from '/logowhite.png'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PlaceIcon from '@mui/icons-material/Place';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Link } from 'react-router-dom';

function Footer() {

  return (
    <div className='footerContainer'>
      <div className='footer'>

        <div className='leftFooter'>

          <img src={logoFooter} alt="PARMA" className='logoFooter' />
          <p className='location'>  Buenos Aires 60 | Paseo de las Luces. <br /> Paraná, Entre Ríos.</p>
          
        </div>

        <div className='rightFooter'>

          <div className='location'>
            <p>CONTACTANOS</p>
            <strong>Política de Cambio</strong>
          </div>
          <div className='footerLinksContainer'>
            <a href='https://www.instagram.com/parmashop_' target='blank'> <InstagramIcon className='footerIcons'/> </a>
            <a href='https://wa.link/jwid11' target='blank'> <WhatsAppIcon className='footerIcons'/> </a>
            <a href="mailto:parmashop1@gmail.com" target='_blank'> <MailOutlineIcon className='footerIcons'/> </a>
          </div>
        </div>
      </div>
      <p className='justina'>Powered by <Link target='_blank' to="https://justinaiturraspe.vercel.app/"><strong > I'mJustWebs</strong></Link></p>
    </div>
  )
}

export default Footer
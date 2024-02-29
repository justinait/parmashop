import React from 'react'
import hero from '/hero/heroeditado3.png'
import './Home.css'
import HomeProducts from './HomeProducts'
import logo from '/logowhite.png'

function Home() {
  return (
    <div>
      <div className='heroContainer'>
        <div style={{zIndex:'1'}}>

          <img src={logo} alt="" className='heroLogo' />
          <p className='sloganHero'>Invest in yourself</p>
        </div>
        <p className='cuotasHero'>3 cuotas sin interés</p>
      </div>
      <HomeProducts/>
    </div>
  )
}

export default Home
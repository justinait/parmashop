import React from 'react'
import hero from '/heroeditado3.png'
import './Home.css'
import HomeProducts from './HomeProducts'

function Home() {
  return (
    <div>
      <img src={hero} alt="" className='heroImage' />
      {/* <p className='parmaHero'>Parmashop</p>
      <p className='sloganHero'>Invest In yourself</p> */}

      <HomeProducts/>
      
    </div>
  )
}

export default Home
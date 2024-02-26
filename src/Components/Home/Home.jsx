import React from 'react'
import hero from '/hero2.jpeg'
import './Home.css'
import HomeProducts from './HomeProducts'

function Home() {
  return (
    <div>
      <img src={hero} alt="" className='heroImage' />
      <p className='sloganHero'>Invest In yourself</p>

      <HomeProducts/>
      
    </div>
  )
}

export default Home
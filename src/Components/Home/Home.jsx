import React from 'react'
import hero from '/public/hero2.jpeg'
import './Home.css'
import HomeProducts from './HomeProducts'

function Home() {
  return (
    <div>
      <img src={hero} alt="" className='heroImage' />

      <HomeProducts/>
      
    </div>
  )
}

export default Home
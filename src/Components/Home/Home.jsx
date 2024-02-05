import React from 'react'
import hero from '/public/heroeditado.png'
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
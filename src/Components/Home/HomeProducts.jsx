import React from 'react'
import './HomeProducts.css'
import tshirts from '/public/remes.png'
import trausers from '/public/pants.png'

function HomeProducts() {
  return (
    <div>
        <div className='productHomeBox'>
            <img src={tshirts} alt="Remeras" className='imageProductHome' />
            
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Remeras</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </div>
        <div className='productHomeBox'>
            <img src={trausers} alt="Remeras" className='imageProductHome' />
            
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Pantalones</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </div>
    </div>
  )
}

export default HomeProducts
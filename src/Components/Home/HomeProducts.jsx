import React from 'react'
import './HomeProducts.css'
import tshirts from '/images/remes.png'
import trausers from '/images/panta3.png'
import buzos from '/images/buzos1.png'
import shorts from '/images/bermu2.png'
import camisas from '/images/camisa.png'
import hoodies from '/images/hoodie.png'
import accesorios from '/images/accesoriosfinal.png'
import { Link } from 'react-router-dom'

function HomeProducts() {
  return (
    <div className='homeProductsContainer'>
        <Link to='/Remeras' className='productHomeBox'>
            <img src={tshirts} alt="Remeras" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Remeras</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/Pantalones' className='productHomeBox'>
            <img src={trausers} alt="Pantalones" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Pantalones</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/Camisas' className='productHomeBox'>
            <img src={camisas} alt="Camisas" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Camisas</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/Bermudas' className='productHomeBox'>
            <img src={shorts} alt="Bermudas" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Bermudas</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/Abrigos' className='productHomeBox'>
            <img src={buzos} alt="Buzos" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Abrigos</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/Buzos' className='productHomeBox'>
            <img src={hoodies} alt="Buzos" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Buzos</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/Accesorios' className='productHomeBox' style={{width:'100%'}}>
            <img src={accesorios} alt="Accesorios" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Accesorios</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
    </div>
  )
}

export default HomeProducts
import React from 'react'
import './HomeProducts.css'
import tshirts from '/images/remes.png'
import trausers from '/images/pants.png'
import buzos from '/images/buzos.png'
import shorts from '/images/shorts.png'
import camisas from '/images/pantalones.jpg'
import hoodies from '/images/hoodie.png'
import accesorios from '/images/accesorios.png'
import { Link } from 'react-router-dom'

function HomeProducts() {
  return (
    <div>
        <Link to='/tshirts' className='productHomeBox'>
            <img src={tshirts} alt="Remeras" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Remeras</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/category' className='productHomeBox'>
            <img src={trausers} alt="Pantalones" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Pantalones</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/category' className='productHomeBox'>
            <img src={camisas} alt="Camisas" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Camisas</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/shorts' className='productHomeBox'>
            <img src={shorts} alt="Bermudas" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Bermudas</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/category' className='productHomeBox'>
            <img src={buzos} alt="Buzos" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Buzos</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/category' className='productHomeBox'>
            <img src={hoodies} alt="Hoodies" className='imageProductHome' />
            <div className='homeProductInfo'>
                <p className='productTitleHome'>Hoodies</p>
                <p className='seeInfoHome'>Ver</p>
            </div>
        </Link>
        <Link to='/category' className='productHomeBox'>
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
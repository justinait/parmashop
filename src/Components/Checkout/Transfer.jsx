import React from 'react'
import './Checkout.css'
import { Link } from 'react-router-dom'

function Transfer() {
  return (
    <div className='transferContainer'>
        <Link to={'/checkout'} className='backTo'>Volver a la compra</Link>
    </div>
  )
}

export default Transfer
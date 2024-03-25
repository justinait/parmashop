import React from 'react'
import { Link } from 'react-router-dom'

function PaymentApproved() {
  return (
    <div className='checkoutContainer'>
        <h2>El pago se realizó con éxito.</h2>
        <p className='approvedText'>Te contactaremos a tu correo.</p>
        <Link to='/category' className='returnButtonCart'>Continuar comprando</Link>
    </div>
  )
}

export default PaymentApproved
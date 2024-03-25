import React from 'react'
import { Link } from 'react-router-dom'

function PaymentApproved() {
  return (
    <div>
        <h2>El pago se realizó con éxito.</h2>
        <p>Te contactaremos a tu mail.</p>
        <Link to='/' className='returnButtonCart'>Regresar al Inicio</Link>
    </div>
  )
}

export default PaymentApproved
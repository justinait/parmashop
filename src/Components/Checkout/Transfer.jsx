import React from 'react'
import { Link } from 'react-router-dom'

function Transfer() {
  return (
    <div className='transferContainer'>
      <p>CBU: 1111111111111</p>
      <p>Alias: 1111111111111111</p>

      <p>Enviar comprobante de pago a parmashop1@gmail.com junto con los nombres de las prendas y el codigo del pedido.</p>

      <p>
      ¡Hola! ¿Cómo estás? <br />

      Podés hacer transferencia o depósito desde cualquier billetera virtual o banco, a la siguiente cuenta:
      <br /><br />
      Banco Santander
      Número de CBU:
      0720000788000064559104
      Alias: las.petunias
      Titular de la cuenta:
      Valor Sol 

      Recordá enviar el comprobante dentro de las 48 horas respondiendo el mail de compra que te llegó para poder confirmarte tu pedido.

      <strong>¡Gracias por tu compra!</strong>
      
      </p>
      {/* //tmb ver el pedido */}

      <Link to={'/'}>Continuar comprando</Link>
    </div>
  )
}

export default Transfer
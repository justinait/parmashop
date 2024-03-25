import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Transfer() {
  const location = useLocation();

  const total = location.state.total;

  const discount = total * 0.10;

  const discountPrice = total - discount;


  return (
    <div className='checkoutContainer'>

      <p>
      ¡Hola! ¿Cómo estás? <br /><br />

      Podés hacer transferencia o depósito desde cualquier billetera virtual o banco, a la siguiente cuenta:
      <br /><br />
      Banco Santander <br />
      Número de CBU:
      --- <br />
      Alias: parmashop <br />
      Titular de la cuenta:
      ---
      <br /> <br />
      Recordá enviar el comprobante dentro de las 48 horas respondiendo el mail de compra que te llegó para poder confirmarte tu pedido.
      <br /><br />
      <strong>¡Gracias por tu compra!</strong>
      <br /><br />

      <p>El valor de tu carrito es ${total}</p>
      <p>Con el descuento del 10%, el valor de tu compra es de: <strong> ${discountPrice}</strong> </p>
      </p>

      <br />
      <Link to={'/'}>Continuar comprando</Link>
    </div>
  )
}

export default Transfer
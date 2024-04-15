import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Transfer() {

  const location = useLocation();
  
  const shipmentCost = location.state.shipment;
  const total = location.state.total;

  const discount = total * 0.10;
  const discountPrice = total - discount;

  const finalPrice = discountPrice + shipmentCost

  return (
    <div className='checkoutContainer transferContainer'>

      <p>
      ¡Hola! ¿Cómo estás? <br /><br />

      Podés hacer transferencia o depósito desde cualquier billetera virtual o banco, a la siguiente cuenta:
      <br /><br />

      Banco Santander <br />
      Número de CBU: 0720192588000004760418
      <br />
      Alias: PARMA.SHOP <br />
      Titular de la cuenta:
      Parma Daniela
      <br /> <br />
      Recordá enviar el comprobante dentro de las 48 horas respondiendo el mail de compra que te llegó para poder confirmarte tu pedido.
      <br /><br />
      <strong>¡Gracias por tu compra!</strong>
      <br /><br />

      Subtotal: ${total} <br />
      Subtotal con descuento(-10%): ${discountPrice} <br />
      Total con envío: <strong>${finalPrice}</strong> <br />
      </p>
      {/* <p>Con el descuento del 10%, el valor de tu compra es de: <strong> ${discountPrice}</strong> </p> */}

      <br />
      <Link to={'/'}>Continuar comprando</Link>
    </div>
  )
}

export default Transfer
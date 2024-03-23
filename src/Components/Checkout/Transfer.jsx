import React from 'react'
import { Link } from 'react-router-dom'

function Transfer() {
  return (
    <div className='transferContainer'>
        <Link to={'/Checkout'}>Volver a la compra</Link>
        <p>CBU: 1111111111111</p>
        <p>Alias: 1111111111111111</p>

        <p>Enviar comprobante de pago a parmashop1@gmail.com junto con los nombres de las prendas y el codigo del pedido.</p>

        <p>¡Hola! ¿Cómo estás?

        Podés hacer transferencia o depósito desde cualquier billetera virtual o banco,  a la siguiente cuenta:

        Banco Santander
        Número de CBU:
        0720000788000064559104
        Alias: las.petunias
        Titular de la cuenta:
        Valor Sol 

        Recordá enviar el comprobante respondiendo el mail de compra que te llegó para poder confirmarte tu pedido. No es automática la confirmación, se hace de manera manual; es por eso que puede demorar unas horas que tu pedido esté confirmado. 
        También podes hacerlo enviando tu numero de orden y comprobante a laspetuniasoficial@gmail.com

        ¡Gracias por tu compra!</p>
        {/* //tmb ver el pedido */}
    </div>
  )
}

export default Transfer
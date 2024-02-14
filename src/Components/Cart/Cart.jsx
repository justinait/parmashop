import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

function Cart() {
    const {cart} = useContext(CartContext);
  return (
    <div>
        <p>Tu carrito</p>
        {
            cart.map((e, i)=>{
                return (
                    <div key={i}>
                        <h5>{e.name}</h5>
                    </div>
                )
            })
        }
    </div>
  )
}

export default Cart
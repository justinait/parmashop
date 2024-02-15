import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'

function Cart() {
    const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);

    let total = getTotalPrice()
    return (
    <div>
        <p>Tu carrito</p>
        <button onClick={clearCart}>Vaciar carrito</button>
        {
            cart.map((e, i)=>{
                return (
                    <div key={i}>
                        {console.log(e)}
                        <h5>{e.color}</h5>
                        <h5>{e.size}</h5>
                        <p>{e.productData.name}</p>
                        <p>{e.id}</p>
                        <button onClick={()=>deleteById(e.id)}>Eliminar</button>
                    </div>
                )
            })
        }
        <p>${total}</p>
    </div>
  )
}

export default Cart
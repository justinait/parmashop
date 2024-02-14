import React, { createContext, useState } from 'react'

export const CartContext = createContext();

function CartContextComponent({children}) {
    
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        let exist = cart.some( e=> e.id === product.id);
        if(exist){
            
            let newArray = cart.map (el => {
                if(el.id === product.id){
                    return {...el, quantity: product.quantity}
                } else {
                    return el
                }
            })
            setCart(newArray)
        } else {
            setCart([...cart, product])
        }
    }
    let data = {
        cart,
        addToCart
    }
  return (
    <CartContext.Provider value={data}>
        {children}
    </CartContext.Provider>
  )
}

export default CartContextComponent
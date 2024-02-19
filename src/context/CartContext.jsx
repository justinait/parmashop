import React, { createContext, useState } from 'react'

export const CartContext = createContext();

function CartContextComponent({children}) {
    
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    
    const currentCount = cart.length + 1;
    const newId = `${product.id}_${currentCount}`;

    product.id = newId;
    setCart([...cart, product]);
    console.log(product);
  }

  const clearCart =()=>{
    setCart([]);
  }
  
  const deleteById = (id) => {
    const newArr = cart.filter(e=> e.id !== id)
    setCart(newArr)
  }
  const getTotalPrice =()=>{
    const total= cart.reduce((acc, el)=>{
      return acc + (el.productData.unit_price)
    }, 0);
    return total;
  }

  let data = {
    cart,
    addToCart,
    clearCart,
    deleteById,
    getTotalPrice
  }
  return (
    <CartContext.Provider value={data}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextComponent
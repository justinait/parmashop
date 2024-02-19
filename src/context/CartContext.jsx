import React, { createContext, useState } from 'react'

export const CartContext = createContext();

function CartContextComponent({children}) {
    
  const [cart, setCart] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const addToCart = (product) => {
    
    const currentCount = cart.length + 1;
    const newId = `${product.id}_${currentCount}`;

    setTotalProducts(totalProducts+1)
    product.id = newId;
    setCart([...cart, product]);
    console.log(product);
  }

  const clearCart =()=>{
    setTotalProducts(0)
    setCart([]);
  }
  
  const deleteById = (id) => {
    const newArr = cart.filter(e=> e.id !== id)
    setCart(newArr)
    setTotalProducts(totalProducts-1)
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
    getTotalPrice,
    totalProducts
  }
  return (
    <CartContext.Provider value={data}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextComponent
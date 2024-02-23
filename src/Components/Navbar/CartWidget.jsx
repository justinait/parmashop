import React, { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import './cartWidget.css'

function CartWidget() {

    const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);
    const [openCartDropdown, setOpenCartDropdown] = useState(false)
    let total = getTotalPrice()

    const handleOpenCart =()=> {
        setOpenCartDropdown(true)
    }
  return (
    <div>
        <ShoppingCartOutlinedIcon className='iconsNavbar' onClick={handleOpenCart} />
        {openCartDropdown &&
            <div className='cartWidgetBox'>
            {
                cart.map((e, i)=>{
                    return (
                        <div key={i} className='cartWidgetItemContainer'>
    
                            <h6>{e.productData.title}</h6>
                            <div className='cartWidgetContainerInfo'>
                                <div className='infoCartItem'>
                                    <img className='cartWidgetImage' src={e.productData.image} alt={e.title} />
                                    <button className='cartWidgetItemDelete' onClick={()=>deleteById(e.id)}> <DeleteOutlinedIcon/> </button>
                                </div>
                                <div className='infoCartItem'>
                                    <p className='cartItemDetail' >Color: <strong> {e.color}</strong></p>
                                    <p className='cartItemDetail' >Talle: <strong>{e.size}</strong> </p>
                                    <p className='cartItemPrice'> <strong> ${e.productData.unit_price}</strong></p>
                                </div>
                            </div>
                            <div className='separatorCart'></div>
                        </div>
                    )
                })
            }
            <p className='subtotalCart'>Subtotal: ${total}</p>
            </div>
        }
        
    </div>
  )
}

export default CartWidget
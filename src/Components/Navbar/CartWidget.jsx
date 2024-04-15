import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context/CartContext';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import './CartWidget.css'
import { Link, useLocation } from 'react-router-dom';

function CartWidget() {

    const { 
        cart,
        addToCart,
        clearCart,
        deleteById,
        getTotalPrice,
        totalProducts } = useContext(CartContext);
    const [openCartDropdown, setOpenCartDropdown] = useState(false)
    const [prevTotal, setPrevTotal] = useState(0);
    let total = Math.trunc(getTotalPrice())
    const location = useLocation();

    const handleOpenCart =()=> {
        if(openCartDropdown == false)
            setOpenCartDropdown(true)
        else
            setOpenCartDropdown(false)
    }
    useEffect(()=> {
        if (total > prevTotal) {
            setOpenCartDropdown(true);
        }
        setPrevTotal(total);
    }, [total])
    
    useEffect(()=> {
        setOpenCartDropdown(false);
    }, [location.pathname]);
  return (
    <div>
        <ShoppingCartOutlinedIcon className='iconsNavbar' onClick={handleOpenCart} />
        {openCartDropdown &&
            <div className='cartWidgetBox'>
            {
                cart.map((e, i)=>{
                    let unitPrice = Math.trunc(e.productData.unit_price);
                    return (
                        <div key={i} className='cartWidgetItemContainer'>
    
                            <h6 className='cartItemTitle'>{e.productData.title}</h6>
                            <div className='cartWidgetContainerInfo'>
                                <div className='infoCartItem'>
                                    <img className='cartWidgetImage' src={e.productData.image} alt={e.title} />
                                    <button className='cartWidgetItemDelete' onClick={()=>deleteById(e.id)}> <DeleteOutlinedIcon/> </button>
                                </div>
                                <div className='infoCartItem'>
                                    <p className='cartItemDetail' >Color: <strong> {e.color}</strong></p>
                                    <p className='cartItemDetail' >Talle: <strong>{e.size}</strong> </p>
                                    <p className='cartItemPrice'> <strong> ${unitPrice}</strong></p>
                                </div>
                            </div>
                            <div className='separatorCart'></div>
                        </div>
                    )
                })
            }
            <p className='subtotalCart'>Subtotal: <strong>${total}</strong> </p>
            <Link className='cartWidgetButton' to='/cart' onClick={handleOpenCart}>Ver carrito</Link>
            </div>
        }
        
    </div>
  )
}

export default CartWidget
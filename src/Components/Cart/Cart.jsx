import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import { Link } from 'react-router-dom';
import './Cart.css'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function Cart() {
    const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);

    let total = Math.trunc(getTotalPrice())
    
    return (
        <div className='cartContainer'>
            {cart.length !== 0 ?
            
            <>
                <h3>Tu carrito</h3>
                <div className='buttonsContainer'>
                    <button className='clearCartButton' onClick={clearCart}>Vaciar carrito</button>
                    <Link to='/checkout' className='goToCheckoutButton'>Finalizar compra</Link>
                </div>
                {
                    cart.map((e, i)=>{
                        let unitPrice = Math.trunc(e.productData.unit_price);
                        return (
                            <div key={i}>

                                <div className='cartItemContainer'>
                                    <img className='cartItemImage' src={e.productData.image} alt={e.title} />
                                    <div className='infoCartItem'>
    
                                        <h6 className='cartItemTitle'>{e.productData.title}</h6>
                                        <p className='cartItemDetail' >Color: <strong> {e.color}</strong></p>
                                        <p className='cartItemDetail' >Talle: <strong>{e.size}</strong> </p>
                                        <button className='cartItemDelete' onClick={()=>deleteById(e.id)}> <DeleteOutlinedIcon/> </button>
                                        <h6 className='cartItemPrice'> <strong> ${unitPrice}</strong></h6>
                                    </div>
                                </div>
                                <div className='separatorCart'></div>
                            </div>
                        )
                    })
                }
                <p className='subtotalCart'>Subtotal: ${total}</p>
                <Link className='' to={'/category'}>Continuar comprando</Link>

            </>
            :
            <div className='emptyContainer'>
                <ShoppingCartOutlinedIcon className='cartEmptyIcon'/>
                <p className='cartEmptyText'>Tu carrito está vacío</p>
                <Link to='/' className='returnButtonCart'>Regresar al Inicio</Link>
            </div>
            }
        </div>
  )
}

export default Cart
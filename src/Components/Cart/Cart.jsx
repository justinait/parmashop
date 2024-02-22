import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import { Link } from 'react-router-dom';
import './Cart.css'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function Cart() {
    const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);

    let total = getTotalPrice()
    return (
        <div className='cartContainer'>
            {cart.length !== 0 ?
            
            <>
                <h3>Tu carrito</h3>
                <button className='' onClick={clearCart}>Vaciar carrito</button>
                <Link to='/checkout' className=''>Finalizar compra</Link>
                {
                    cart.map((e, i)=>{
                        return (
                            <div key={i} className='cartItemContainer'>
                                {console.log(e)}
                                <img className='cartItemImage' src={e.productData.image} alt={e.title} />
                                <div className='infoCartItem'>

                                    <h5 className='cartItemTitle' >{e.title}</h5>
                                    <h5 className='cartItemColor' >{e.color}</h5>
                                    <h5 className='cartItemSize' >{e.size}</h5>
                                    <p>{e.productData.title}</p>
                                    <p>{e.productData.unit_price}</p>
                                    <button className='cartItemDelete' onClick={()=>deleteById(e.id)}> <DeleteOutlinedIcon/> </button>
                                </div>
                            </div>
                        )
                    })
                }
                <p>${total}</p>
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
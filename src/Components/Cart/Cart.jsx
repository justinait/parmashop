import React, { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import { Link } from 'react-router-dom';
import './Cart.css'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

function Cart() {
    const { cart, clearCart, deleteById, getTotalPrice } = useContext(CartContext);

    let total = getTotalPrice()
    return (
        <div className='cartContainer'>
            {!cart ?
            
            <>
                <p>Tu carrito</p>
                <button onClick={clearCart}>Vaciar carrito</button>
                <Link to='/checkout'>Finalizar compra</Link>
                {
                    cart.map((e, i)=>{
                        return (
                            <div key={i}>
                                {console.log(e)}
                                <h5>{e.color}</h5>
                                <h5>{e.size}</h5>
                                <p>{e.productData.title}</p>
                                <p>{e.id}</p>
                                <button onClick={()=>deleteById(e.id)}>Eliminar</button>
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
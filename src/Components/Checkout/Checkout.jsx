import React, { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react'
import './Checkout.css'
import axios from 'axios'

function Checkout() {
   
    const {cart} = useContext(CartContext)
    const [preferenceId, setPreferenceId] = useState(null)
    initMercadoPago(import.meta.env.VITE_PUBLICKEY, {locale: "es-AR"})

    const createPreference = async ()=>{
        const newArr = cart?.map (e =>{
            return {
                title: e.productData.title, 
                unit_price: e.productData.unit_price, 
                quantity: e.quantity
            }
        })
        try {
            console.log(cart);
            console.log('create p ok');
            let response = await axios.post(
            "http://localhost:8080/create_preference", 
            {
                items: newArr,
                shipment_cost: 10
            })
            console.log(response);
            const {id}= response.data
            return id
        } catch (error) {
            console.log(error);
        }
    }
    const handleBuy = async()=> {
        console.log('en buy')
        const id = await createPreference();
        if(id){
            setPreferenceId(id)
        }
    }

  return (
    <div className='checkoutContainer'>
        <button onClick={handleBuy} >Seleccionar método de pago</button>
        
        {
            preferenceId &&
            <Wallet initialization={{preferenceId, redirectMode:"self"}}/>
        }
    </div>
  )
}

export default Checkout
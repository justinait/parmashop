import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react'
import './Checkout.css'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebaseConfig'
import {addDoc, collection, doc, updateDoc, serverTimestamp, getDoc} from "firebase/firestore"

function Checkout() {
   
    const {cart, getTotalPrice, clearCart} = useContext(CartContext)
    initMercadoPago(import.meta.env.VITE_PUBLICKEY, {locale: "es-AR"})
    
    const [preferenceId, setPreferenceId] = useState(null)
    const [userData, setUserData]= useState({
        cp: "",
        phone:""
    })
    const [orderId, setOrderId] = useState(null);
    const [shipmentCost, setShipmentCost] = useState(0);
    
    const location = useLocation()
    const queryParams = new URLSearchParams(location)
    const paramValue = queryParams.get("status")
    let total = getTotalPrice();

    useEffect(()=> {
        let order = JSON.parse(localStorage.getItem("order"))
        if(paramValue === "approved"){
            let ordersCollections = collection(db, "orders")
            addDoc(ordersCollections, {...order, date: serverTimestamp()}).then(res => {
                setOrderId(res.id)
            })   
        }
        localStorage.removeItem("order");
        clearCart();
    }, [paramValue])

    useEffect(()=>{
        let shipmentCollection = collection(db, "shipment")
        let shipmentDoc = doc (shipmentCollection, "9W3lmfPC5YpolvXbmrEL")
        getDoc(shipmentDoc).then(res=> {
            setShipmentCost(res.data().cost)
        })
    }, [])

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
            "https://backend-parmashop.vercel.app/create_preference", 
            {
                items: newArr,
                shipment_cost: shipmentCost
            })
            const {id}= response.data
            return id
        } catch (error) {
            console.log(error);
        }
    }
    const handleBuy = async()=> {
        let order = {
            cp: userData.cp,
            phone: userData.phone,
            items: cart,
            email:userData.email,
            total: total + shipmentCost
        }
        localStorage.setItem("order", JSON.stringify(order))
        const id = await createPreference();
        if(id){
            setPreferenceId(id)
        }
    }
    const handleChange =(e)=>{
        setUserData({...userData, [e.target.name]: e.target.value})
    }

  return (
    <div className='checkoutContainer'>
        {
            !orderId ?
            <>
                <div className="inputModal">
                    <input
                    type="text"
                    name="cp"
                    onChange={handleChange}
                    placeholder="Código Postal"
                    className="input"
                    />
                </div>
                <div className="inputModal">
                    <input
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="input"
                    />
                </div>
                <div className="inputModal">
                    <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email"
                    className="input"
                    />
                </div>
                <button onClick={handleBuy} >Seleccionar método de pago</button>
            </> :
            <>
                <h2>El pago se realizó con éxito!</h2>
                <h2>Este es el ID de tu compra: {orderId}</h2>
            </>
        }
        
        {
            preferenceId &&
            <Wallet initialization={{preferenceId, redirectMode:"self"}}/>
        }
    </div>
  )
}

export default Checkout
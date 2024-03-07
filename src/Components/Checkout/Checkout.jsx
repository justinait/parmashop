import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import './Checkout.css'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { db } from '../../firebaseConfig'
import {addDoc, collection, doc, serverTimestamp, getDoc} from "firebase/firestore"

function Checkout() {
   
    const {cart, getTotalPrice, clearCart} = useContext(CartContext)
    initMercadoPago(import.meta.env.VITE_PUBLICKEY, {locale: "es-AR"})
    
    const [shipmentCost, setShipmentCost] = useState(0);
    const [preferenceId, setPreferenceId] = useState(null)
    const [userData, setUserData]= useState({
        cp: "",
        phone:""
    })
    const [orderId, setOrderId] = useState(null);
    
    const location = useLocation()
    const queryParams = new URLSearchParams(location)
    const paramValue = queryParams.get("status")
    let total = getTotalPrice();

    useEffect(()=> {
        let order = JSON.parse(localStorage.getItem("order"))
        if(paramValue === "approved"){

            let ordersCollections = collection(db, "orders")
            addDoc(ordersCollections, {
                ...order, 
                date: serverTimestamp()
            }).then(res => {
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
        const newArr = cart.map (e =>{
            return {
                title: e.productData.title, 
                unit_price: e.productData.unit_price, 
                quantity: 1
            }
        })
        console.log(newArr);
        try {
            
            let response = await axios.post(
                "https://backend-parmashop-ait94ii7u-justinait.vercel.app/create_preference", 
                {
                    items: newArr,
                    shipment_cost: 10
                })
            console.log('create p ok');
            const {id}= response.data
            return id
        } catch (error) {
            console.log('Error al hacer la solicitud:', error);
            console.log('Respuesta completa:', error.response);
        }
        
    }
    const handleBuy = async()=> {
        let order = {
            cp: userData.cp,
            phone: userData.phone,
            items: cart,
            email:userData.email,
            total: getTotalPrice + shipmentCost
        }
        localStorage.setItem("order", JSON.stringify(order))
        // const id = await createPreference();
        // if(id){
        //     setPreferenceId(id)
        // }
        try {
            const id = await createPreference();
            if (id) {        setPreferenceId(id);      }
        } catch (error) {
            console.error(error);
        }
    }
    const handleChange =(e)=>{
        setUserData({...userData, [e.target.name]: e.target.value})
    }

  return (
    <div className='checkoutContainer'>
        {
            !orderId ?
            <div>
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
            </div> 
            :
            <div>
                <h2>El pago se realizó con éxito!</h2>
                <h2>Este es el ID de tu compra: {orderId}</h2>
            </div>
        }
        {
            preferenceId &&
            <Wallet initialization={{preferenceId, redirectMode:"self"}}/>
        }
        
    </div>
  )
}

export default Checkout
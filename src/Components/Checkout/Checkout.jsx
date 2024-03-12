import React, { useContext, useEffect, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { CartContext } from '../../context/CartContext';
import './Checkout.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';

function Checkout() {
  
  const { cart, addToCartContext, clearCart, deleteById, getTotalPrice, totalProducts   } = useContext(CartContext);
  
  initMercadoPago(import.meta.env.VITE_PUBLICKEY, {locale:"es-AR"})
  
  const [shipmentCost, setShipmentCost] = useState(10);
  const [preferenceId, setPreferenceId]= useState(null);
  const [orderId, setOrderId] = useState(null)
  const [userData, setUserData] = useState({
    email: "",
    cp: "",
    phone: ""
  })
  
  let total = getTotalPrice()
  const [orderDB, setOrderDB] = useState({
    userData: userData,
    items: cart,
    date: new Date().toLocaleString(),
    total: total
  })
  const location = useLocation();
  const queryParams = new URLSearchParams(location)
  const paramValue = queryParams.get("status")


  const pushData = async(order)=>{

    let ordersCollections = collection(db, "orders");
    addDoc(ordersCollections, {
      ...order,
      date: serverTimestamp()
    }).then(res=>{
      setOrderId(res.id)
    })
  }

  useEffect(()=>{
    let order = JSON.parse(localStorage.getItem("order"));
    console.log(order);
    if(paramValue === "approved"){
      
      pushData(orderDB);

      localStorage.removeItem("order");
      clearCart();
    }

  }, [paramValue])

  const createPreference = async()=> {
    const newArray = cart.map ( e=>{
      return {
        title: e.title,
        unit_price: +e.productData.unit_price,
        quantity: e.quantity
      }
    })
    try {
      let response = await axios.post("https://back-parma.vercel.app/create_preference", {
        items: newArray,
        shipment_cost: 100
      })
      const {id} = response.data

      return id;
    } catch (error) {
      console.log(error);
    }
  }

  const handleBuy = async () => {

    let order = {
      userData: userData,
      items: cart,
      total: total + shipmentCost
    }
    // setOrderDB({
    //   userData: userData,
    //   items: cart,
    //   total: total + shipmentCost
    // })

    console.log(order);
    localStorage.setItem("order", JSON.stringify(order))
    
    const id = await createPreference();
    if(id){
      setPreferenceId(id);
    }
  }
  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  return (
    <div className='checkoutContainer'>
      {
        !orderId ?
        <div className="form">
          <div>
            carrito
            <ShoppingCartOutlinedIcon/>
            envio
            <LocalShippingIcon/>
            pagar
            <CreditCardIcon/>
          </div>
          <p>Detalle de la compra</p>
          {cart.map((e, i)=>{
            return(
              <div key={i}>
                {e.productData.title}
                {e.productData.unit_price}
              </div>
            )
          })}
          <p>DATOS DE CONTACTO</p>
          <div className="input">
            <input
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="input"
            />
          </div>
          <div className="input">
            <input
              type="number"
              name="phone"
              onChange={handleChange}
              placeholder="Número de Celular"
              className="input"
            />
          </div>
          <p>DATOS DE ENVÍO</p>
          <div className="input">
            <input
              type="string"
              name="cp"
              onChange={handleChange}
              placeholder="Código Postal"
              className="input"
            />
          </div>
          <div className="input">
            <input
              type="number"
              name="city"
              onChange={handleChange}
              placeholder="Ciudad"
              className="input"
            />
          </div>
          <div className="input">
            <input
              type="string"
              name="adress"
              onChange={handleChange}
              placeholder="Dirección de entrega"
              className="input"
            />
          </div>
          
        </div>
        :
        <h2>El pago se realizó con éxito. {orderId}</h2>
    }
    <button onClick={handleBuy}>Seleccionar método de pago</button>
      {
        preferenceId && <Wallet initialization={{preferenceId, redirectMode:"self"}} />
      }
      
    </div>
  )
}

export default Checkout
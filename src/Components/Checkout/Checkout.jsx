import React, { useContext, useEffect, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { CartContext } from '../../context/CartContext';
import './Checkout.css'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function Checkout() {
  
  const { cart, addToCartContext, clearCart, deleteById, getTotalPrice, totalProducts   } = useContext(CartContext);
  
  initMercadoPago(import.meta.env.VITE_PUBLICKEY, {locale:"es-AR"})
  
  const [shipmentCost, setShipmentCost] = useState(0);
  const [preferenceId, setPreferenceId]= useState(null);
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    cp: "",
    phone: "",
    city: "",
    province: "",
    adress: "",
    depto: "",
  })
  
  const [orderId, setOrderId] = useState(null)
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location)
  const paramValue = queryParams.get("status")

  let total = getTotalPrice()


  useEffect(()=>{
    let order = JSON.parse(localStorage.getItem("order"));
    console.log(paramValue);
    console.log(order);
    if(paramValue === "approved"){
      
      let ordersCollections = collection(db, "orders");
      addDoc(ordersCollections, {
        ...order,
        date: serverTimestamp()
      }).then(res=>{
        setOrderId(res.id)
      })

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
        shipment_cost: 1
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
      total: total
    }

    console.log(order);
    localStorage.setItem("order", JSON.stringify(order))
    try {
      const id = await createPreference();
      if(id){
        setPreferenceId(id);
      }
    } catch (error) {
      console.error(error);
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
          

          <h5>Detalle de la compra</h5>
          <p>Subtotal: $</p>
          {cart.map((e, i)=>{
            return(
              <div key={i} >
                <div className='checkoutDetailContainer'>
                  <img src={e.productData.image} alt="" className='imgCheckout'/>
                  <p>{e.productData.title}</p>
                  <p>${e.productData.unit_price}</p>
                </div>

                <div className='separatorCart'></div>
              </div>
            )
          })}
          <p>Total: $</p>
          
          <h5>DATOS DE CONTACTO</h5>
          <div >
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Nombre y apellido"
              className="input"
            />
          </div>
          <div >
            <input
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="input"
            />
          </div>
          <div >
            <input
              type="string"
              name="phone"
              onChange={handleChange}
              placeholder="Número de Celular"
              className="input"
            />
          </div>

          <h5>DATOS DE ENVÍO</h5>
          <div >
            <input
              type="string"
              name="cp"
              onChange={handleChange}
              placeholder="Código Postal"
              className="input"
            />
          </div>
          <div >
            <input
              type="string"
              name="city"
              onChange={handleChange}
              placeholder="Ciudad"
              className="input"
            />
          </div>
          <div >
            <input
              type="string"
              name="province"
              onChange={handleChange}
              placeholder="Provincia"
              className="input"
            />
          </div>
          <div >
            <input
              type="string"
              name="adress"
              onChange={handleChange}
              placeholder="Dirección de entrega"
              className="input"
            />
          </div>
          
          <div >
            <input
              type="string"
              name="depto"
              onChange={handleChange}
              placeholder="Departamento"
              className="input"
            />
          </div>
          
          <button className='seleccionarMetodoCheckout' onClick={handleBuy}>Seleccionar método de pago</button>
        </div>
        :
        <div>
          <h2>El pago se realizó con éxito. {orderId}</h2>
          <Link to='/' className='returnButtonCart'>Regresar al Inicio</Link>
        </div>
      }
      {/* loading ? 
      <div className='spinner'>
        <Spinner animation="border" role="status" >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div> */}
      {
        preferenceId && <Wallet initialization={{preferenceId, redirectMode:"self"}} />
      }
      
    </div>
  )
}

export default Checkout
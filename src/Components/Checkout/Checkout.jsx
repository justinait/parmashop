import React, { useContext, useEffect, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { CartContext } from '../../context/CartContext';
import './Checkout.css'
import axios from 'axios';
import { Link, redirect, useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import mp from '/mercadopago.png'

function Checkout() {
  const navigate = useNavigate();

  const { cart, addToCartContext, clearCart, deleteById, getTotalPrice, totalProducts   } = useContext(CartContext);
  
  initMercadoPago(import.meta.env.VITE_PUBLICKEY, {locale:"es-AR"})
  
  const [shipmentCost, setShipmentCost] = useState(0);
  const [shipmentCostAux, setShipmentCostAux] = useState(0);
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
  const [pickUp, setPickUp] = useState(false);
  const [methodChange, setMethodChange] = useState(false)
  
  let total = getTotalPrice()


  useEffect(()=>{
    let order = JSON.parse(localStorage.getItem("order"));
    
    if(order?.paymentMethod === 'transfer') {
      let ordersCollections = collection(db, "orders");
      console.log("Order data:", order);
      addDoc(ordersCollections, {
        ...order,
        date: serverTimestamp()
      }).then((res)=>{
        console.log("Document successfully added: ", res);
        setOrderId(res.id)
        
        navigate('/transfer', { state: { total } });
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });

      localStorage.removeItem("order");
      clearCart();
    } else if(order?.paymentMethod === 'card') {
      // if(paramValue === "approved"){
      let ordersCollections = collection(db, "orders");
      console.log("Order data:", order);
      addDoc(ordersCollections, {
        ...order,
        date: serverTimestamp()
      }).then((res)=>{
        console.log("Document successfully added: ", res);
        setOrderId(res.id)
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });

      localStorage.removeItem("order");
      clearCart();
    }
    
  }, [methodChange])
  

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
        shipment_cost: pickUp ? 0 : shipmentCost
      })
      const {id} = response.data

      return id;
    } catch (error) {
      console.log(error);
    }
  }
  
  
  const handleBuy = async (method) => {
    setMethodChange(!methodChange)
    let paymentMethod = method;
    const newArray = cart.map ( e=>{
      return {
        title: e.productData.title,
        unit_price: +e.productData.unit_price,
        oldPrice: +e.productData.oldPrice,
        sale: +e.productData.sale,
        color: e.color,
        size: e.size,
        category: e.productData.category,
        image: e.productData.image
      }
    })
    let order = {
      userData: userData,
      items: newArray,
      total: total,
      paymentMethod,
      pickUp: pickUp
    }
    
    localStorage.setItem("order", JSON.stringify(order))
    if(paymentMethod === 'transfer'){
      
    } else {
      try {
        const id = await createPreference();
        if(id){
          setPreferenceId(id);
        }
      } catch (error) {
        console.error(error);
      }
      return order
    }
  }
  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }
  useEffect(()=>{
    let shipmentCollection = collection(db, "shipment")
    let shipmentDoc = doc(shipmentCollection, "9W3lmfPC5YpolvXbmrEL")
    getDoc(shipmentDoc).then(res=>{
      setShipmentCost(res.data().cost)
      setShipmentCostAux(res.data().cost)
    })
    
  }, [])
  
  const handlePickUp =(e)=> {
    
    setPickUp(e.target.checked);

    if(pickUp == true){
      setShipmentCost(0);   
    } else {
      setShipmentCost(shipmentCostAux);
    }
  }

  return (
    <div className='checkoutContainer'>
      {
        <div className="form">
          
          <h5>Detalle de la compra</h5>
          
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
          <p>Total: ${total}</p>
          
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

          <div className='checkboxContainerLine'>
            <h6>Retiro por el local</h6>
            <input type="checkbox" name='pickUp' checked={pickUp} onChange={(e)=>handlePickUp(e)} />
          </div>
          {(pickUp == false) &&
          <>
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
          </>
          
          }
          <p className='seleccionarMetodoCheckout' onClick={()=>handleBuy('transfer')}> Pagar con transferencia <p className='transferCheckout'>10% OFF</p></p>
          <button className='seleccionarMetodoCheckout' onClick={()=>handleBuy('card')}> <img src={mp} alt="Mercado Pago" className='mercadoPagoLogo' /> Pagar con tarjeta de crédito/débito</button>

        </div>
        
        
      }
      
      {
        preferenceId && <Wallet initialization={{preferenceId, redirectMode:"self"}} />
      }
      
    </div>
  )
}

export default Checkout
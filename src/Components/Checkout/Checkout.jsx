import React, { useContext, useEffect, useRef, useState } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { CartContext } from '../../context/CartContext';
import './Checkout.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import mp from '/mercadopago.png'
import { Alert } from 'react-bootstrap';

import emailjs from 'emailjs-com'; 
// import emailjs from '@emailjs/browser';

function Checkout() {
  const navigate = useNavigate();
  const form = useRef();
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

  const [errorsArray, setErrorsArray] = useState([])
  const [orderId, setOrderId] = useState(null)
  const [pickUp, setPickUp] = useState(false);
  const [methodChange, setMethodChange] = useState(false)
  
  let total = getTotalPrice()
  
  const sendEmail = async () => {
    const user_email =userData.email;
    const user_name =userData.name;
    const total =getTotalPrice();
    const items = cart.map ( e=> `${e.productData.title}: $${e.productData.unit_price}`);

    const templateParams = {
      user_name,
      user_email,
      total,
      shipmentCost,
      items: items.join(', ')
    };
    
    try {
      await emailjs.send('service_kapndfh', 'template_76f9ja7', templateParams, 'eL-fM4UTQmw1_lpi4');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  };

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
        let shipment = pickUp ? 0 :shipmentCost
        navigate('/transfer', { state: { total, shipment } });
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });

      localStorage.removeItem("order");
      clearCart();
      setUserData({
        email: "",
        name: "",
        cp: "",
        phone: "",
        city: "",
        province: "",
        adress: "",
        depto: "",
      })
    } else if(order?.paymentMethod === 'card') {
      let ordersCollections = collection(db, "orders");
      addDoc(ordersCollections, {
        ...order,
        date: serverTimestamp()
      }).then((res)=>{
        setOrderId(res.id)
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });

      localStorage.removeItem("order");
      clearCart();
      setUserData({
        email: "",
        name: "",
        cp: "",
        phone: "",
        city: "",
        province: "",
        adress: "",
        depto: "",
      })
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
        shipment_cost: pickUp ? 0 :shipmentCost 
      })
      const {id} = response.data

      return id;
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleBuy = async (e, method) => {
    e.preventDefault();
    const result = validate(userData);
    
    if(!Object.keys(result).length){
      
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
        pickUp: pickUp,
        sent: false
      }
      
      localStorage.setItem("order", JSON.stringify(order))
      await sendEmail();
      
      if(method === 'card'){
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

  }
  const validate = (values) => {
    const errors = {}
    if(!values.name){
      errors.name = 'Este campo es obligatorio'
    }
    if(!values.email){
      errors.email = 'Este campo es obligatorio'
    }
    if(!values.phone){
      errors.phone = 'Este campo es obligatorio'
    }

    if(!pickUp){
      if(!values.cp){
        errors.cp = 'Este campo es obligatorio'
      }
      if(!values.city){
        errors.city = 'Este campo es obligatorio'
      }
      if(!values.province){
        errors.province = 'Este campo es obligatorio'
      }
      if(!values.adress){
        errors.adress = 'Este campo es obligatorio'
      }
    }
    setErrorsArray(errors)
    return errors;
  }

  return (
    <div className='checkoutContainer'>
      <Link to={'/cart'}>Volver al carrito</Link>
      {
        <form ref={form} className="form">
          <h6>DETALLE DE LA COMPRA</h6>
          <div className='detailCheckout'>

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
            <p className='totalCheckout'>Total: ${total}</p>
          </div>
          
          <h5>DATOS DE CONTACTO</h5>
          <div>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Nombre y apellido"
              className="input"
            />
            {errorsArray.name && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.name}           </Alert> }
          </div>
          <div >
            <input
              type="text"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="input"
            />
            {errorsArray.email && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.email}           </Alert> }
          </div>
          <div>
            <input
              type="string"
              name="phone"
              onChange={handleChange}
              placeholder="Número de Celular"
              className="input"
            />
            {errorsArray.phone && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.phone}           </Alert> }
          </div>

          <h6>Costo de envío: ${shipmentCost}</h6>
          <div className='checkboxContainerCheckout'>
            <h6>Retiro por el local (gratis)</h6>
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
              {errorsArray.cp && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.cp}           </Alert> }
            </div>
            <div >
              <input
                type="string"
                name="city"
                onChange={handleChange}
                placeholder="Ciudad"
                className="input"
              />
              {errorsArray.city && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.city}           </Alert> }
            </div>
            <div >
              <input
                type="string"
                name="province"
                onChange={handleChange}
                placeholder="Provincia"
                className="input"
              />
              {errorsArray.province && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.province}           </Alert> }
            </div>
            <div >
              <input
                type="string"
                name="adress"
                onChange={handleChange}
                placeholder="Dirección de entrega"
                className="input"
              />
              {errorsArray.adress && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.adress}           </Alert> }
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
          <div className='buttonsCheckoutContainer'>
            <p className='seleccionarMetodoCheckout' onClick={(e)=>handleBuy(e, 'transfer')}> Pagar con transferencia <strong className='transferCheckout'>10% OFF</strong></p>
            <button className='seleccionarMetodoCheckout' onClick={(e)=>handleBuy(e, 'card')} disabled={(preferenceId!=null)}> <img src={mp} alt="Mercado Pago" className='mercadoPagoLogo' /> Pagar con tarjeta de crédito/débito</button>
          </div>

        </form>
        
      }
      
      {
        (preferenceId) &&
        <Wallet initialization={{preferenceId, redirectMode:"self"}} />
      }
      
    </div>
  )
}

export default Checkout
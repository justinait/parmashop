import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import './UserOrders.css'

function UserOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        const ordersCollections = collection (db, "orders")
        const ordersQuery = query(ordersCollections, orderBy("date", "desc"))
        getDocs(ordersQuery).then(res =>{
            const newArr = res.docs.map(e =>{
                return {
                    ...e.data(), id: e.id
                }
            })
            setOrders(newArr)
        })
    }, [])

  return (
    <div className='checkoutContainer'>
        <h2>PEDIDOS</h2>
        {orders.map((e, i) => {
            const reversedIndex = orders.length - i;
            const timestamp = e.date;
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
            const formattedDate = date.toISOString();
            const finalDate = formattedDate.split("T")[0];
            return (
                <div key={i} className='orderContainer'>
                    
                    <h6>Código de orden: {e.id}</h6>
                    <h5># {reversedIndex}</h5>
                    <p>Fecha de compra: {finalDate}</p>
                    {e.pickUp &&
                    <h6>RETIRA POR EL LOCAL</h6>
                    }
                    <p>Método de pago: {e.paymentMethod}</p>
                    <p>Total: ${e.total}</p>

                    <h6>Datos de los productos:</h6>
                    {(e.items).map((item, index) => {
                        return (
                            <div key={index} className='prendaOrder'>
                                <div className='prendaOrderInfoPpal'>
                                    <h6>Prenda {index + 1}</h6>
                                    <img src={item.image} width={50}/>                                    
                                </div>

                                <p>Nombre: {item.title}</p>
                                <p>Categoría: {item.category}</p>
                                <p>Talle: {item.size}</p>
                                <p>Color: {item.color}</p>
                                <p>Precio: ${item.unit_price}</p>
                            </div>
                        )
                    })}
                    <h6>Datos del comprador:</h6>
                    
                    {Object.keys(e.userData).map((key, index) => {
                        const element = e.userData[key];
                        return (
                            <div key={index} className='userOrder'>
                                <p>{element}</p>
                            </div>
                        )
                    })}
                    
                </div>
            )
        })
        }
    </div>
  )
}

export default UserOrders
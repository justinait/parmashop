import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './UserOrders.css'

function UserOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        const ordersCollections = collection (db, "orders")
        getDocs(ordersCollections).then(res =>{
            const newArr = res.docs.map(e =>{
                return {
                    ...e.data(), id: e.id
                }
            })
            setOrders(newArr)
        })
    }, [])

  return (
    <div className='userOrdersContainer'>
        <h2>PEDIDOS</h2>
        {orders.map((e, i) => {
            
            const timestamp = e.date;
            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
            const formattedDate = date.toISOString();
            const finalDate = formattedDate.split("T")[0];
            return (
                <div key={i}>
                    <p>Método de pago: {e.paymentMethod}</p>
                    <p>Total: ${e.total}</p>
                    <p>Fecha de compra: {finalDate}</p>
                    <h6>Datos de los productos:</h6>
                    {(e.items).map((item, index) => {
                        return (
                            <div key={index}>
                                <h6>Prenda {index + 1}</h6>
                                <img src={item.image} width={50}/>
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
                            <div key={index}>
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
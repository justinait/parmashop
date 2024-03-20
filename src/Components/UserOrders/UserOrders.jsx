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
        <h2>ORDENES</h2>
        {orders.map((e, i) => {
            
            return <div key={i}>
                <h4>{e.title}</h4>
                <p>{e.total}</p>
                {console.log(e.items)}
                {(e.items).map(element => {
                    return <div>
                        <h2>{element.title}</h2>
                        <p>{element.size}</p>
                        <p>{element.color}</p>
                    </div>
                })}
            </div>
        })
        }
    </div>
  )
}

export default UserOrders
import React, { useEffect } from 'react'
import { db } from '../../firebaseConfig';

function UserOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(()=> {
        const ordersCollections = collection (db, "orders")
        getDocs(ordersCollections).then(res =>{
            const newArr = res.docs.map( e =>{
                return {
                    ...e.data(), id: e.id
                }
            })
        })
        setOrders(newArr)
    }, [ ])

  return (
    <div>
        <p>ORDENES</p>
        {orders.map(e => {
            {
                e?.items?.map(item => {
                    return <div>
                        <h2>{item.title}</h2>
                    </div>
                })
            }
            return <div key={e.id}>
                <h4>{e.title}</h4>
            </div>
        })
        }
    </div>
  )
}

export default UserOrders
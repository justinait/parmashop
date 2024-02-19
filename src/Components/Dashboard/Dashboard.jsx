import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import {collection, getDocs, doc} from "firebase/firestore"
import ProductsDashboard from './ProductsDashboard';
import './ProductsDashboard.css'

function Dashboard() {

  const [isChange, setIsChange] = useState(false)
  const [products, setProducts] = useState([]);
  
  useEffect(()=> {
    setIsChange(false)

    let productsCollection = collection(db, "products");
    getDocs(productsCollection).then(res =>{
      let newArr = res.docs.map(product=>{
        return {
          ...product.data(),
          id: product.id
        }
      })
      setProducts(newArr)
    })
  }, [isChange])
  
  return (
    <div className='dashboardContainer' style={{minHeight:'90vh'}}>
      
      <h2>Dashboard de Administrador</h2>
      
      <ProductsDashboard products={products} setIsChange={setIsChange} /> 
      
    </div>
  )
}

export default Dashboard
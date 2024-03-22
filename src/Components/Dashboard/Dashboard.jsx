import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import {collection, getDocs, doc, updateDoc} from "firebase/firestore"
import ProductsDashboard from './ProductsDashboard';
import './ProductsDashboard.css'
import { Modal } from 'react-bootstrap';

function Dashboard() {

  const [isChange, setIsChange] = useState(false)
  const [products, setProducts] = useState([]);
  const [shipmentCost, setShipmentCost] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(()=> {
    setIsChange(false)

    const productsCollection = collection(db, "products");
    getDocs(productsCollection).then(res =>{
      const newArr = res.docs.map(product=>{
        return {
          ...product.data(),
          id: product.id
        }
      })
      const productsWithNames = newArr.filter(product => product.name);
      productsWithNames.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(newArr)
    })
  }, [isChange])

  const updateShipment = async()=>{
    updateDoc( doc(db, "shipment", "9W3lmfPC5YpolvXbmrEL"), {cost:shipmentCost } )
    setOpen(false)
  }
  
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='dashboardContainer' style={{minHeight:'90vh'}}>
      
      <h2>Dashboard de Administrador</h2>

      <p onClick={()=>setOpen(true)}>Costo de envío</p>
      
      <Modal
        show={open}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Body>

        <input
          label="Costo"
          onChange={(e) => setShipmentCost(+e.target.value)}
        />
        </Modal.Body>
        <p onClick={updateShipment}>Modificar</p>
      </Modal>
      <ProductsDashboard products={products} setIsChange={setIsChange} /> 
      
    </div>
  )
}

export default Dashboard
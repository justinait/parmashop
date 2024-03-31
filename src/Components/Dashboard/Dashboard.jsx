import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import {collection, getDocs, doc, updateDoc, getDoc} from "firebase/firestore"
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

    const shipmentDocRef = doc(db, "shipment", "9W3lmfPC5YpolvXbmrEL");
    getDoc(shipmentDocRef).then((doc) => {
      if (doc.exists()) {
        setShipmentCost(doc.data().cost)
      } else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
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

      <p onClick={()=>setOpen(true)} className='shipmentCostDashboard'>Modificar costo de envío </p>
      
      <Modal
        show={open}
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <input
          label="Costo"
          onChange={(e) => setShipmentCost(+e.target.value)}
          value={shipmentCost}
        />
        <p className='modificarEnvio' onClick={updateShipment}>Modificar</p>
        </Modal.Body>
      </Modal>
      <ProductsDashboard products={products} setIsChange={setIsChange} /> 
      
    </div>
  )
}

export default Dashboard
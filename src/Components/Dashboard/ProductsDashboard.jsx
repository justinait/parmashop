import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../firebaseConfig';
import {deleteDoc, doc} from "firebase/firestore"
import EditAddModal from './EditAddModal';
import Modal from 'react-bootstrap/Modal';
import EditIcon from '@mui/icons-material/Edit';
import './ProductsDashboard.css'
import CrudModal from './CrudModal';

function ProductsDashboard({products, setIsChange}) {

    const [productSelected, setProductSelected] = useState(null)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
  
    const handleOpen = (product) => {
        if(!show){

            setShow(true);
            setProductSelected(product);
        }
    }
  
    const deleteProduct = (id) => {
        deleteDoc(doc(db, "products", id));
        setIsChange(true);
    }
    
    return (
        <div>
        
        <button className='dashboardButton addButton' onClick={()=>handleOpen(null)}>Agregar Nuevo Producto</button>
        
        {
            products.length > 1 ? 
            <table className='tableDiv'>
                <thead>
                    <tr>

                        <th>Título</th>
                        
                        <th>$</th>
                        <th>Foto</th>

                        <th>Acción</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {products.map((e, i)=>{
                        return (
                            <tr key={e.id} className='tableRowDashboard'>
                                
                                <td>{e.title}</td>
                                
                                <td>{e.unit_price}</td>
                                <td><img src={e.image} width={80} alt={e.name} /></td>
                                
                                <td>
                                    <button className='dashboardButton editButton' onClick={()=> handleOpen(e) }> <EditIcon/> </button>
                                    <button className='dashboardButton deleteButton' onClick={()=>deleteProduct(e.id)}> <DeleteIcon/></button>
                                </td>

                            </tr>
                        )
                    })}
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <CrudModal handleClose={handleClose} setIsChange={setIsChange} productSelected={productSelected} setProductSelected={setProductSelected} />
                        
                    </Modal>
                        

                </tbody>
            </table>    :    
            
            <p>No hay productos.</p>
        
        }
    </div>
  )
}

export default ProductsDashboard
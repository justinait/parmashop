import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../firebaseConfig';
import {deleteDoc, doc} from "firebase/firestore"
import Modal from 'react-bootstrap/Modal';
import EditIcon from '@mui/icons-material/Edit';
import './ProductsDashboard.css'
import CrudModal from './CrudModal';

function ProductsDashboard({products, setIsChange}) {

    const [productSelected, setProductSelected] = useState({
        title:"",
        unit_price:0,
        image:"",
        imageTwo:"",
        category:"",
        quantity:1,
        colors: [''],
        details: {},
        sale:0
    })
    const [show, setShow] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos los productos');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleClose = () => {
        setShow(false);
        setProductSelected({})
    }
  
    const handleOpen = (product) => {
        if(!show){
            setShow(true);
            setProductSelected(product);
        }
    }
    const handleDeleteConfirmation = (id) => {
        setDeleteId(id);
        setConfirmDelete(true);
    }
    const handleDeleteCancel = () => {
        setConfirmDelete(false);
        setDeleteId(null);
    }

    const deleteProduct = () => {//handledeleteconfirm
        deleteDoc(doc(db, "products", deleteId));
        setIsChange(true);
        setConfirmDelete(false);
        setDeleteId(null);
    }
    
    const categories = [     'Todos los productos' , 'Remeras', 'Pantalones', 'Camisas', 'Bermudas', 'Buzos' , 'Abrigos', 'Accesorios'    ]

    return (
        <div>
        
        <button className='dashboardButton shipmentCostDashboard' onClick={()=>handleOpen(productSelected)}>Agregar Nuevo Producto</button>

        <div className='dashboardCategoryBox' >
            {categories.map((e, i) => (
                <button
                    key={i}
                    className={`dashboardCategory ${selectedCategory === e ? 'dashboardCategoryActive' : ''}`}
                    onClick={() => setSelectedCategory(e)}
                >
                    {e}
                </button>
            ))}
        </div>

        {
            products.length > 1 ? 
            <table className='tableDiv'>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>$</th>
                        <th>Foto</th>
                        <th>Colores</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    products
                    .filter((e) => selectedCategory === 'Todos los productos' || (selectedCategory === e.category))
                    .map((e, i)=>{
                        return (
                            <tr key={i} className='tableRowDashboard'>
                                
                                <td>{e.title}</td>
                                
                                <td>{e.unit_price}</td>
                                <td>
                                    <img src={e.image} width={80} alt={e.name} />
                                    {
                                    e.imageTwo &&
                                    <img src={e.imageTwo} width={80} alt={e.name} />
                                    }
                                </td>
                                <td>
                                {
                                    e.colors.map((color, i)=>{
                                        return  <div key={i}>{color} <br /></div>
                                    })
                                }
                                </td>
                                
                                <td>
                                    <button className='dashboardButton editButton' onClick={()=> handleOpen(e) }> <EditIcon/> </button>
                                    <button className='dashboardButton deleteButton' onClick={()=>handleDeleteConfirmation(e.id)}> <DeleteIcon/></button>
                                </td>

                            </tr>
                        )
                    })
                    }
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <CrudModal handleClose={handleClose} setIsChange={setIsChange} productSelected={productSelected} setProductSelected={setProductSelected} />
                        
                    </Modal>
                    {confirmDelete && (
                        <Modal show={confirmDelete} onHide={handleDeleteCancel}>
                            <Modal.Header closeButton>
                                <Modal.Title>Confirmar eliminación</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>¿Estás seguro de que quieres eliminar este producto?</Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-secondary" onClick={handleDeleteCancel}>Cancelar</button>
                                <button className="btn btn-danger" onClick={deleteProduct}>Eliminar</button>
                            </Modal.Footer>
                        </Modal>
                    )}

                </tbody>
            </table>    :    
            <p>No hay productos.</p>
        
        }
    </div>
  )
}

export default ProductsDashboard
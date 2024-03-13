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
  
    const deleteProduct = (id) => {
        deleteDoc(doc(db, "products", id));
        setIsChange(true);
    }
    
    const categories = [     'Todos los productos' , 'Remeras', 'Pantalones', 'Camisas', 'Bermudas', 'Buzos' , 'Abrigos', 'Accesorios'    ]

    return (
        <div>
        
        <button className='dashboardButton addButton' onClick={()=>handleOpen(productSelected)}>Agregar Nuevo Producto</button>

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
                                    <button className='dashboardButton deleteButton' onClick={()=>deleteProduct(e.id)}> <DeleteIcon/></button>
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
                        

                </tbody>
            </table>    :    
            <p>No hay productos.</p>
        
        }
    </div>
  )
}

export default ProductsDashboard
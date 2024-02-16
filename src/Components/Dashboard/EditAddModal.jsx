import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    
  const [newProduct, setNewProduct] = useState({
    title:"",
    unit_price:0,
    image:"",
    description:""
  })
  const [file, setFile] = useState(null);

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file);

    if(productSelected) {
      setProductSelected({
        ...productSelected, image: url
      })
    } else {
      setNewProduct({...newProduct, image: url})
    }

    setIsLoading(false);
  }
   
  const handleChange = (e) => {
    if(productSelected) {
      setProductSelected({
        ...productSelected,  [e.target.name]: e.target.value
      })
    } else {
      setNewProduct({...newProduct, [e.target.name]: e.target.value})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const productsCollection = collection(db, "products")
    
    if(productSelected){
      let obj = {
        ...productSelected,
        unit_price: +productSelected.unit_price
      }

      updateDoc(doc(productsCollection, productSelected.id), obj).then(()=>{
        setIsChange(true);
        handleClose();
      })
      
    } else{
      let obj = {
        ...newProduct,
        unit_price: +newProduct.unit_price
      }
      addDoc(productsCollection, obj).then(()=> {
        setIsChange(true);
        handleClose();
      })

    }
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{productSelected?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         
        <form className="form">
          <div className="input">
            <input
              type="text"
              name="title"
              onChange={handleChange}
              placeholder="Nombre"
              className="input"
              defaultValue={productSelected?.title}
            />
          </div>
          <div className="input">
            <input
              type="number"
              name="unit_price"
              onChange={handleChange}
              placeholder="Precio"
              className="input"
              defaultValue={productSelected?.unit_price}
            />
          </div>
          <div className="input">
            <input
              type="text"
              name="description"
              onChange={handleChange}
              placeholder="Descripción"
              className="input"
              defaultValue={productSelected?.description}
            />
          </div>

          <div className="input">
            <input
              type="file"
              onChange={(e)=>setFile(e.target.files[0])}
              className="input"
            />
          </div>
          {
            file &&
            <button type='button' onClick={handleImage}>Confirmar imagen</button>
          }

        </form>
         
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        
        {
          !isLoading &&
          <Button type='submit' onClick={handleSubmit} variant="primary">Guardar</Button>
        }
        
    </Modal.Footer>
    </>
  );
}

export default EditAddModal;
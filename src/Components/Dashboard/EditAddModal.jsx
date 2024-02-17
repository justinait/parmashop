import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {

  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [file, setFile] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState(['']);


  const [newProduct, setNewProduct] = useState({
    title:"",
    unit_price:0,
    image:"",
    category:"",
    quantity:1,
    colors: ['Blanco', 'Negro'],
    details: {
      1: {
        color:'',
        size:'',
        stock: false
      }
    }
  })

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

  const handleSelectChange = (event) => {
    setCategorySelected(event.target.value);
  };
  const handleSizes = () => {
    if(productSelected){
      if( productSelected.category !== 'shorts' && productSelected.category !== 'jeans'  ){
        setSizes(['S', 'M', 'L', 'XL'])
      } else {
        setSizes(['38', '40', '42', '44', '46'])
      }
    }
  }
  
  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  };

  const addColorInput = () => {
    setColors([...colors, '']);
  };

  useEffect(()=>{
    handleSizes()
  }, [categorySelected])

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
            <select value={categorySelected} onChange={handleSelectChange}>
              <option value="">Categorias..</option>
              <option value="opcion1">Remeras</option>
              <option value="opcion2">Pantalones</option>
              <option value="opcion4">Camisas</option>
              <option value="opcion5">Bermudas</option>
              <option value="opcion6">Buzo</option>
              <option value="opcion7">Hoodies</option>
              <option value="opcion8">Accesorios</option>
            </select>
          </div>
          <div>
            <p>Colores</p>
            {colors.map((color, index) => (
              <div key={index} className="input">
                <input
                  type="text"
                  value={color}
                  onChange={(event) => handleColorChange(index, event)}
                  placeholder="Color"
                  className="input"
                />
              </div>
            ))}
            <p onClick={addColorInput}>+</p>
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
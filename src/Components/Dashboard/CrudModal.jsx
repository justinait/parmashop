import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"

function EditAddModal({handleClose, setIsChange, productSelected, setProductSelected}) {

  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [colorSelected, setColorSelected] = useState('');
  const [sizeSelected, setSizeSelected] = useState('');
  const [file, setFile] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [details, setDetails] = useState({
    1: {
      color:'',
      size:'',
      stock: false
    }
  });


  const [newProduct, setNewProduct] = useState({
    title:"",
    unit_price:0,
    image:"",
    category:"",
    quantity:1,
    colors: colors,
    details: {
      1: {
        color:'',
        size:''
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
  // const handleChange = (e) => {
  //   if(productSelected) {
  //     setProductSelected({
  //       ...productSelected,  [e.target.name]: e.target.value
  //     })
  //   } else {
  //     setNewProduct({...newProduct, [e.target.name]: e.target.value})
  //   }
  // }
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDetails = { ...details };
    updatedDetails[i] = {
      ...updatedDetails[i],
      [name]: value
    };
  
    setDetails(updatedDetails);
    if (productSelected) {
      setProductSelected({
        ...productSelected,
        [name]: value
      });
    } else {
      if (name === 'category') {
        setCategorySelected(value);
      } else if (name === 'colors') {
        const updatedColors = [...colors];
        const colorIndex = Number(e.target.dataset.index);
        updatedColors[colorIndex] = value;
        setColors(updatedColors);
      } else {
        setNewProduct({
          ...newProduct,
          [name]: value
        });
      }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const productsCollection = collection(db, "products")
    
    if(productSelected){
      let obj = {
        ...productSelected,
        unit_price: +productSelected.unit_price,
        category: categorySelected,
        colors: colors,
        details: details
      }

      updateDoc(doc(productsCollection, productSelected.id), obj).then(()=>{
        setIsChange(true);
        handleClose();
      })
      
    } else{
      let obj = {
        ...newProduct,
        unit_price: +newProduct.unit_price,
        category: categorySelected,
        colors: colors,
        details: details
      }
      addDoc(productsCollection, obj).then(()=> {
        setIsChange(true);
        handleClose();
      })

    }
  }

  const handleSizes = () => {
    if(productSelected){
      if( productSelected.category !== 'Bermudas' && productSelected.category !== 'Pantalones'  ){
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
    let colorsToAdd = productSelected ? [...productSelected.colors, ''] : [...colors, ''];
    setColors(colorsToAdd);
  };
  
  const addNewProductButton =() =>{
    const timestamp = Date.now();
    setDetails(prevDetails => ({
      ...prevDetails,
      [timestamp]: {
        color: '',
        size: '',
        stock: false
      }
    }));
  }
  const handleDeleteProduct = (i) => {
    const { [i]: deletedProduct, ...restProducts } = details; // Eliminar el objeto con la clave especificada
    setDetails(restProducts);
  };


  useEffect(()=>{
    handleSizes()

  }, [categorySelected, colors])

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{productSelected?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         
        <form className="form">
          <p>Información General</p>
          <div className="inputModal">
            <input
              type="text"
              name="title"
              onChange={handleChange}
              placeholder="Nombre"
              className="input"
              defaultValue={productSelected?.title}
            />
          </div>
          <div className="inputModal">
            <input
              type="number"
              name="unit_price"
              onChange={handleChange}
              placeholder="Precio"
              className="input"
              defaultValue={productSelected?.unit_price}
            />
          </div>
          <div className="inputModal">
            <select defaultValue={productSelected?.category} value={categorySelected} onChange={(event)=>setCategorySelected(event.target.value)}>
              <option value="">Categorias..</option>
              <option value="Remeras">Remeras</option>
              <option value="Pantalones">Pantalones</option>
              <option value="Camisas">Camisas</option>
              <option value="Bermudas">Bermudas</option>
              <option value="Buzo">Buzo</option>
              <option value="Hoodies">Hoodies</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <p>Colores</p>
          <div className='colorsDiv'>
            {
            (productSelected.colors.length !== 0 ? productSelected?.colors : colors).map((e, index) => (
              <div key={index} className="inputModal">
                <input
                  type="text"
                  defaultValue={e}
                  onChange={(event) => handleColorChange(index, event)}
                  placeholder="Color"
                  className="inputModal"
                />
              </div>
            ))}
            <p className='addMoreButton' onClick={addColorInput}>+</p>
          </div>

          <div className="inputModal">
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

          <p>Información Específica</p>
          <div className='colorsDiv'>
            <p>Prenda</p>
            
            {
            Object.values(details).map((e, index) => (
              <div key={index}>
                <p>Prenda {index}</p>
                  
                <div className="inputModal">
                  <select value={colorSelected} onChange={(event)=>setColorSelected(event.target.value)}>
                    <option value="">Colores..</option>
                    {colors.map((e, i)=>{
                      <option key={i} value={e}>{e}</option>  
                    })}
                  </select>
                </div>
              
                <div className="inputModal">
                  <select value={sizeSelected} onChange={(event)=>setSizeSelected(event.target.value)}>
                    <option value="">Talles..</option>
                    {sizes.map((e, i)=>{
                      <option key={i} value={e}>{e}</option>  
                    })}
                  </select>
                </div>
                
                <div className="inputModal">
                  <input
                    type="text"
                    defaultValue={e?.stock}
                    onChange={(event) => handleChange(index, event)}
                    placeholder="Stock"
                    className="inputModal"
                  />
                </div>
              </div>
            ))}
            <p className='addMoreButton' onClick={addNewProductButton}>+</p>
          </div>
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
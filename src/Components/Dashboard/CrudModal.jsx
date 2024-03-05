import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"


const CrudModal = ({handleClose, setIsChange, productSelected, setProductSelected}) => {
  
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [colorSelected, setColorSelected] = useState('');
  const [file, setFile] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState(['']);
  const [specificInfo, setSpecificInfo] = useState([])
  const [checkboxes, setCheckboxes] = useState([])
  const [details, setDetails] = useState({
    0: { color: '', size: '', stock: '' }
  });
  const [stockArray, setStockArray] = useState([])

  const handleNext = () => {
    setShowSecondScreen(true);
    if(productSelected){
      setSpecificInfo(productSelected)
    }
    else{
      setSpecificInfo(newProduct)
    }
  };
  const [newProduct, setNewProduct] = useState({
    title:"",
    unit_price:0,
    image:"",
    imageTwo:"",
    category:"",
    quantity:1,
    colors: colors,
    details: details,
    sale:0
  })

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file);
    let urlTwo = await uploadFile(fileTwo);

    if(productSelected) {
      
      setProductSelected({
        ...productSelected, 
        image: url,
        imageTwo: urlTwo
      })
    } else {
      setNewProduct({...newProduct, image: url, imageTwo: urlTwo})
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
  
  const handleSubmit = (e, updatedDetails) => {
    e.preventDefault();
    const productsCollection = collection(db, "products")
    handleDetails();
    if(productSelected){
      let obj = {
        ...productSelected,
        unit_price: +productSelected.unit_price,
        category: categorySelected,
        colors: colors,
        details: updatedDetails
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
        details: updatedDetails
      }
      
      addDoc(productsCollection, obj).then(()=> {
        setIsChange(true);
        handleClose();
      })

    }
  }
  const handleFormSubmit = (event) => {
    const updatedDetails = handleDetails(); // Obtener los detalles actualizados
    handleSubmit(event, updatedDetails); // Llamar a handleSubmit con los detalles actualizados
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
  const addColorInput = () => {
    setColors([...colors, '']);
  };

  useEffect(()=>{
    handleSizes()
  }, [categorySelected, productSelected, newProduct])

  useEffect(()=>{
    if(productSelected){
      setColors(productSelected?.colors)
      setCategorySelected(productSelected?.category)
    }
    else{
      setColors([''])
    }
  }, [])

  const handleColorChange =(index, e)=> {
    const newColors = [...colors];
    newColors[index] = e.target.value;
    setColors(newColors);
  }
  const handleCheckboxChange = (event) => {

    const { name, checked } = event.target;    
    setCheckboxes({ ...checkboxes, [name]: checked });
    handleChecks()
  };

  const handleChecks = ()=>{
  
    let stocksArray = [];
  
    sizes.forEach((e, i) => {
      const checkbox = document.getElementById(`checkbox-${i}`);
      if (checkbox && checkbox.checked) {
        stocksArray[i] = true;
      } else {
        stocksArray[i] = false;
      }
    });
  
    setStockArray(stocksArray)
  };
    

  const handleDetails = () => {
    
    let updatedDetails = {};
    let detailsSizes = {};

    sizes.forEach((e, i) => {
      detailsSizes[i] = {
        size: e
      };
    });
    Object.values(specificInfo.colors).map((color, index) => {
      sizes.forEach((key, i) => {
        let indexAux = index*4 + i;
        updatedDetails[indexAux] = {
          color: color, 
          size: detailsSizes[i].size,
          stock: stockArray[color][detailsSizes[i].size],
        };
        
      });
    })

    return updatedDetails
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{productSelected?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         
        <form className="form">
          {!showSecondScreen && (
          <div>
            <h5>Información General</h5>
            <div className="inputModal">
              <p>Nombre de la prenda</p>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                // placeholder="Nombre"
                className="input"
                defaultValue={productSelected?.title}
              />
            </div>
            <div className="inputModal">
              <p>Precio</p>
              <input
                type="number"
                name="unit_price"
                onChange={handleChange}
                className="input"
                defaultValue={productSelected?.unit_price}
              />
            </div>
            
            <div className="inputModal">
              <select value={categorySelected} onChange={(event)=>setCategorySelected(event.target.value)}>
                <option value="">Categorias..</option>
                <option value="Remeras">Remeras</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Camisas">Camisas</option>
                <option value="Bermudas">Bermudas</option>
                <option value="Buzo">Buzo</option>
                <option value="Abrigos">Abrigos</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
            <p>Colores</p>
            <div className='colorsDiv'>
              {colors.map((e, index) => (
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
              <p>Porcentaje de descuento</p>
              <input
                type="number"
                name="sale"
                placeholder='25'
                onChange={handleChange}
                className="input"
                defaultValue={productSelected?.sale}
              />
            </div>

            <div className="inputModal">
              <p>Imagen Principal</p>
              <input
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
                className="input"
              />
            </div>
            {
              file &&
              <button type='button' onClick={handleImage}>Confirmar imagen principal</button>
            }
            <div className="inputModal">
              <p>Imagen Secundaria</p>
              <input
                type="file"
                onChange={(e)=>setFileTwo(e.target.files[0])}
                className="input"
              />
            </div>
            {
              fileTwo &&
              <button type='button' onClick={handleImage}>Confirmar imagen secundaria</button>
            }
            {
              !isLoading &&
              <p onClick={handleNext}>Siguiente</p>
            }
          </div>
          )}
          
          {showSecondScreen && (
          <div>
            <h5>Información específica</h5>
            
            <div>
              {
                Object.values(specificInfo.colors).map((element, index) => {
                  
                  return(
                  <div>

                    <h5>Prenda {index+1}</h5>
                    <h6>{element}</h6>
                    
                    <div className="inputModal">
                      {sizes.map((e, i)=>{
                        return (
                        <div key={i}>
                          <input
                            type="checkbox"
                            name={e}
                            checked={checkboxes[e] || false}
                            id={`checkbox${element}-${i}`}
                            onChange={handleCheckboxChange}
                          />
                          <label>{e}</label>
                        </div>)
                      })}
                    </div>

                  </div>)
                })
              }

            
            </div>
            
          <button onClick={handleFormSubmit}>Guardar</button>
        </div>
        )}
      </form>
      
      </Modal.Body>
    </>
  );
};

export default CrudModal;

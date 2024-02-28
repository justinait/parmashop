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
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState(['']);
  const [specificInfo, setSpecificInfo] = useState([])
  const [checkboxes, setCheckboxes] = useState([])
  const [details, setDetails] = useState({})
  const [detailsPack, setDetailsPack] = useState({})
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
    category:"",
    quantity:1,
    colors: colors,
    details: {
      0: {
        color:'',
        size:'',
        stock: ''
      }
    },
    sale:0
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
    handleDetails();
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
      const newDetails = {};
      sizes.forEach((size, i) => {
        newDetails[i] = {
          color: '',
          size: size,
          stock: false
        };
      });
      setDetails(newDetails)
      
    }
    
    const initialState = {};
    sizes.forEach(e => {
      initialState[e] = false;
    });
    return initialState;
  }
  const addColorInput = () => {
    setColors([...colors, '']);
  };

  useEffect(()=>{
    handleSizes()
  }, [categorySelected])

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

  };

  const handleDetails = () => {

    let updatedDetails = {};
    let checksArray = Object.keys(checkboxes)
    let stocksArray = [false, false, false, false]
    
    for (let i = 0; i < sizes.length; i++) {
      checksArray.push('')
    }

    sizes.map((j, i) => {
      checksArray.map(e=>{
        console.log(e);
        console.log(j);
        if(j==e){
          return stocksArray[i] = true
          // setStockArray(prevState => [...prevState, true ]);
        }
        else{
          return stocksArray[i] = false
          // setStockArray(prevState => [...prevState, false ]);
        }
      })
    })
    // setStockArray(stocksArray)
    console.log(stocksArray);
    let detailsArray = Object.keys(details)
    detailsArray.forEach((e, i) => {

      updatedDetails[i] = {
        ...details[i], // Copiamos el tamaño intacto
        color: colorSelected, // Establecemos el nuevo color
        stock: stocksArray[i]
        // stock: ((details[key].size==checkboxes[i] )? true : false)
      };
      
      setDetails(e);
    });
    
    console.log(updatedDetails);  
    console.log(details);
  };
  
  const addNewProductButton =() =>{
    const timestamp = Date.now();
    setDetails(prevDetails => ({
      ...prevDetails,
      [timestamp]: {
        color: null,
        size: null,
        stock: false
      }
    }));
  }
  
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{productSelected?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         
        <form className="form">
          {!showSecondScreen && (
          <div>
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
              <select value={categorySelected} onChange={(event)=>setCategorySelected(event.target.value)}>
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
            {
              !isLoading &&
              <p onClick={handleNext}>Siguiente</p>
            }
          </div>
          )}
          
          {showSecondScreen && (
          <div>
            <p>Información específica</p>
            
            <div>
              
              {/* <p>Prenda {i+1}</p> */}

              <div className="inputModal">
                <select value={colorSelected} onChange={(event)=>setColorSelected(event.target.value)}>
                  <option value="">Colores..</option>
                  {specificInfo.colors.map((e, i)=>{
                    return <option key={i} value={e}>{e}</option>  
                  })}
                </select>
              </div>

              
              <div className="inputModal">
                {sizes.map((e, i)=>{
                  return (
                  <div key={i}>
                    <input
                      type="checkbox"
                      name={e}
                      checked={!!checkboxes[e]}
                      onChange={handleCheckboxChange}
                    />
                    <label>{e}</label>
                  </div>)
                })}
              </div>
              <p className='addMoreButton' onClick={addNewProductButton}>+</p>

            </div>
            
          <button onClick={handleSubmit}>Guardar</button>
        </div>
        )}
      </form>
      
      </Modal.Body>
    </>
  );
};

export default CrudModal;

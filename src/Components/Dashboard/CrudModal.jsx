import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"
import Alert from 'react-bootstrap/Alert';


const CrudModal = ({handleClose, setIsChange, productSelected, setProductSelected}) => {
  
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [file, setFile] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState(['']);
  const [specificInfo, setSpecificInfo] = useState([])
  const [checkboxes, setCheckboxes] = useState({})
  const [boxer, setBoxer] = useState(false)
  const [details, setDetails] = useState({});
  const [errorsArray, setErrorsArray] = useState([])
  const [imageValidation, setImageValidation]=useState(false);

  const [itsOnSale, setItsOnSale] = useState(false)
  const [oldPrice, setOldPrice] = useState(0);
  const [newUnitPrice, setNewUnitPrice] = useState()
  const [initialIsOnSale, setInitialIsOnSale] = useState(false);
  const [unitPriceAux, setUnitPriceAux] = useState()

  const [salePercentageAux, setSalePercentageAux] = useState()
  const [handleNextExecuted, setHandleNextExecuted] = useState(false)

  const validate = (values) => {
    const errors = {}
    if(!values.title){
      errors.title = 'Este campo es obligatorio'
    }
    if(!values.unit_price){
      errors.unit_price = 'Este campo es obligatorio'
    }
    if(!categorySelected){
      errors.category = 'Este campo es obligatorio'
    }
    if(colors[0] == ''){
      errors.colors = 'Este campo es obligatorio'
    }
    // if(!productSelected.id){

    //   if(imageValidation ==false){
    //     errors.firstImage = 'Este campo es obligatorio'
    //   }
    // }

    if(itsOnSale == true){
      if(!values.sale){
        errors.sale = 'Este campo es obligatorio'
      }
    }

    setErrorsArray(errors)
    
    return errors
  }
  useEffect(() => {
    // initialIsOnSale !==
    if ( itsOnSale && handleNextExecuted) {
      calculateSale();
    }
  }, [itsOnSale, initialIsOnSale, handleNextExecuted]);

  const handleNext = (e) => {
    e.preventDefault();
    setInitialIsOnSale(itsOnSale);
    setHandleNextExecuted(true);

    setProductSelected({
      ...productSelected,
      category: categorySelected,
      colors: colors,
      unit_price: newUnitPrice,
      //so wronggggggggggggggggggg
      oldPrice: oldPrice,
      sale: salePercentageAux
    })
    const result = validate(productSelected)
    
    if(!Object.keys(result).length){
      setShowSecondScreen(true);
    }
    console.log(colors[0]);
  };

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file);

    if(productSelected) {
      
      setProductSelected({
        ...productSelected, 
        image: url,
      })
      setImageValidation(true);
    } 

    setIsLoading(false);
  }
  const handleImageTwo = async () => {
    setIsLoading(true);
    let urlTwo = await uploadFile(fileTwo);

    if(productSelected) {
      
      setProductSelected({
        ...productSelected, 
        imageTwo: urlTwo
      })
    }
    setIsLoading(false);
  }
  const handleChange = (e) => {
    if(productSelected) {
      setProductSelected({
        ...productSelected,  [e.target.name]: e.target.value
      })
    } 
    if(e.target.name === 'unit_price'){
      setUnitPriceAux(e.target.value)
    }
  }
  
  const handleSubmit = (e, updatedDetails) => {
    e.preventDefault()

    try {
      const productsCollection = collection(db, "products")
      if(productSelected.id !== undefined){
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
        
      } 
      else{
        let obj = {
          ...productSelected,
          unit_price: +productSelected.unit_price,
          category: categorySelected,
          colors: productSelected.colors,
          details: updatedDetails
        }
        addDoc(productsCollection, obj).then(()=> {
          setIsChange(true);
          handleClose();
        })

      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
    }
    
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedDetails = handleDetails();
    handleSubmit(event, updatedDetails);
  }

  const handleSizes = () => {
    if (productSelected) {
      if (productSelected.category === 'Bermudas' || productSelected.category === 'Pantalones') {
        setSizes(['38', '40', '42', '44', '46']);
      } else if (productSelected.category === 'Accesorios' && !boxer) {
        setSizes([]);
      } else if(productSelected.category === 'Accesorios' && boxer){
        setSizes(['S', 'M', 'L']);
      }
      else {
        setSizes(['S', 'M', 'L', 'XL']);
      }
    }
  };
  
  const addColorInput = () => {
    setColors([...colors, '']);
  };

  useEffect(()=>{
    handleSizes()
  }, [categorySelected, productSelected])

  useEffect(()=>{
    if(productSelected.id !== undefined){
      setColors(productSelected?.colors)
      setCategorySelected(productSelected?.category)
      setOldPrice(productSelected.oldPrice? productSelected.oldPrice : productSelected.unit_price)
      setUnitPriceAux(productSelected.unit_price)
      setSalePercentageAux(productSelected.sale)
      //so wrongggg
      setNewUnitPrice(productSelected.unit_price)
      
      //TRAER CHECKS
      colors.forEach((color, colorIndex)=> {
        sizes.forEach((size, sizeIndex) =>{
          
          const index = colorIndex * sizes.length + sizeIndex;
          let auxStock=productSelected.details[index].stock

          if (auxStock == undefined){
            auxStock= false
          }
          setCheckboxes(prevState => ({
            ...prevState,
            [color]: {
              ...prevState[color],
              [size]: auxStock
            }
          }));
        })
      })
    }
    else{
      // setColors([.colors])
    }
  }, [productSelected])

  const handleColorChange =(index, event)=> {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  }

  useEffect(()=> {
    setDetails({})
  }, [productSelected])

  const handleCheckboxChange = (event, color, size) => {
    const { name, checked } = event.target;
    const isChecked = event.target.checked;
      
    setCheckboxes(prevState => ({
      ...prevState,
      [color]: {
        ...prevState[color],
        [size]: isChecked
      }
    }));
  };

  const handleDetails = () => {
    let updatedDetails = {};
    
    (colors).forEach((color, colorIndex) => {
      sizes.forEach((size, sizeIndex) => {
        
        let auxStock=checkboxes[color]?.[size]
        if (auxStock == undefined){
          auxStock= false
        }
        const index = colorIndex * sizes.length + sizeIndex;
        updatedDetails[index] = {
          color: color,
          size: size,
          stock: auxStock
        };
        
      });
    });
  
    return updatedDetails;
  };
  
  const handleBoxerChange = (event) => {
    setBoxer(event.target.checked);
  };
  
  const handleSaleChange = (event) => {
    setItsOnSale(event.target.checked);
  };
  

  const calculateSale =()=> {
    if(itsOnSale== true){
      const newPriceAux = +(unitPriceAux - (unitPriceAux * (salePercentageAux/100)));
      
      setOldPrice(unitPriceAux);
      setNewUnitPrice(newPriceAux);
      
    } else {
      setNewUnitPrice(oldPrice);
      setOldPrice(null);
    }
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
            <h5>Información General</h5>
            <div className="inputModal">
              <h6>Nombre de la prenda</h6>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                // placeholder="Nombre"
                className="input"
                defaultValue={productSelected?.title}
              />
              {errorsArray.title && <Alert key={'danger'} variant={'danger'} className='p-1'>                {errorsArray.title}           </Alert> }
            </div>
            
            <div className="inputModal">
              <h6>Precio</h6>
              <input
                type="number"
                name="unit_price"
                onChange={handleChange}
                className="input"
                defaultValue={productSelected?.unit_price}
              />
              {errorsArray.unit_price && <Alert key={'danger'} variant={'danger'} className='p-1'>                {errorsArray.unit_price}           </Alert> }
              
            </div>
            <h6>Categoría</h6>
            <div className="inputModal">
              <select value={categorySelected&& categorySelected} onChange={(event)=>setCategorySelected(event.target.value)}>
                <option value="">Categorias..</option>
                <option value="Remeras">Remeras</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Camisas">Camisas</option>
                <option value="Bermudas">Bermudas</option>
                <option value="Buzo">Buzo</option>
                <option value="Abrigos">Abrigos</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Accesorios" onClick={()=>setBoxer(true)}>Boxer</option>
              </select>
              {errorsArray.category && <Alert key={'danger'} variant={'danger'} className='p-1'>                {errorsArray.category}           </Alert> }
              
            </div>
            {
              categorySelected == 'Accesorios' &&
              <>
                <h6>El producto es un BOXER?</h6>
                <input type="checkbox" name='boxer' checked={boxer} onChange={handleBoxerChange} />
              </>
            }

            <h6>Colores</h6>
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
                  {errorsArray.colors && <Alert key={'danger'} variant={'danger'} className='p-1'>                {errorsArray.colors}           </Alert> }
                </div>
              ))}
              <p className='addMoreButton' onClick={addColorInput}>+</p>
            </div>

            <h6>El producto está en SALE?</h6>
            <input type="checkbox" name='itsOnSale' checked={itsOnSale} onChange={handleSaleChange} />
            {
              itsOnSale &&
              <div className="inputModal">
                <h6>Porcentaje de descuento</h6>
                <input
                  type="number"
                  name="sale"
                  placeholder='%'
                  // onChange={handleChange}
                  onChange={(event) => setSalePercentageAux(event.target.value)}
                  className="input"
                  defaultValue={productSelected?.sale}
                />
                {errorsArray.sale && <Alert key={'danger'} variant={'danger'} className='p-1'>                {errorsArray.sale}           </Alert> }
              </div>
            }

            <div className="inputModal">
              <h6>Imagen Principal</h6>
              <input
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
                className="input"
              />
              {errorsArray.firstImage && <Alert key={'danger'} variant={'danger'} className='p-1'>                {errorsArray.firstImage}           </Alert> }
              
            </div>
            {
              file &&
              <button type='button' onClick={handleImage}>Confirmar imagen principal</button>
            }
            <div className="inputModal">
              <h6>Imagen Secundaria</h6>
              <input
                type="file"
                onChange={(e)=>setFileTwo(e.target.files[0])}
                className="input"
              />
            </div>
            {
              fileTwo &&
              <button type='button' onClick={handleImageTwo}>Confirmar imagen secundaria</button>
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
                (colors).map((color, index) => {
                  
                  return(
                  <div key={index}>

                    <h5>Prenda {index+1}</h5>
                    <h6>{color}</h6>
                    
                    <div className="inputModal">
                      {sizes.map((size, i)=>{
                        
                        return (
                        <div key={i}>
                          <input
                            type="checkbox"
                            name={size}
                            checked={checkboxes[color]?.[size] || false}
                            id={`checkbox${color}-${size}`}
                            onChange={(event)=>handleCheckboxChange(event, color, size)}
                          />
                          <label>{size}</label>
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

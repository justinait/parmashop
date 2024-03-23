import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"
import Alert from 'react-bootstrap/Alert';
import ProgressBar from 'react-bootstrap/ProgressBar';


const CrudModal = ({handleClose, setIsChange, productSelected, setProductSelected}) => {
  
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [file, setFile] = useState(null);
  const [fileTwo, setFileTwo] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState(['']);
  const [checkboxes, setCheckboxes] = useState({})
  const [boxer, setBoxer] = useState(false)
  const [errorsArray, setErrorsArray] = useState([])
  const [imageValidation, setImageValidation]=useState(false);

  const [oldPrice, setOldPrice] = useState(0);
  const [newUnitPrice, setNewUnitPrice] = useState(0)
  const [unitPriceAux, setUnitPriceAux] = useState()
  const [itsOnSale, setItsOnSale] = useState(false)
  const [initialIsOnSale, setInitialIsOnSale] = useState(false);
  const [salePercentageAux, setSalePercentageAux] = useState()

  const [handleNextExecuted, setHandleNextExecuted] = useState(false)
  const [progress, setProgress] = useState(0);
  const [progressTwo, setProgressTwo] = useState(0);
  
  const validate = (values) => {
    const errors = {}
    if(!values.title){
      errors.title = 'Este campo es obligatorio'
    }
    if(!values.unit_price || values.unit_price == 0){
      errors.unit_price = 'Este campo es obligatorio'
    }
    if(!categorySelected){
      errors.category = 'Este campo es obligatorio'
    }
    if (colors.some(color => color === '')) {
      errors.colors = 'Este campo es obligatorio';
    }    

    if(productSelected.image == undefined) {

      if(imageValidation ==false){
        errors.firstImage = 'Este campo es obligatorio'
        console.log(productSelected.image);
      }
    }

    if(itsOnSale == true){
      if(!values.sale || values.sale ==0){
        errors.sale = 'Este campo es obligatorio'
      }
    }

    setErrorsArray(errors)
    
    return errors
  }
  useEffect(() => {
    if ( itsOnSale && handleNextExecuted) {
      calculateSale();
    }
    // itsOnSale
  }, [ handleNextExecuted]);

  const handleNext = (e) => {
    e.preventDefault();
    setInitialIsOnSale(itsOnSale);
    setHandleNextExecuted(true);
    
    setProductSelected({
      ...productSelected,
      category: categorySelected,
      colors: colors,
      ...(itsOnSale == true? {unit_price: newUnitPrice} : {unit_price: productSelected.unit_price}),
      oldPrice: oldPrice,
      ...(salePercentageAux !== undefined && { sale: salePercentageAux }),
      ...(boxer && { boxer: true })
    })
    const result = validate(productSelected)
    console.log(productSelected);
    if(!Object.keys(result).length){
      setShowSecondScreen(true);
    }
  };

  const handleImage = async () => {
    setIsLoading(true);
    simulateUpload()
    let url = await uploadFile(file)
    
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
    simulateUploadTwo()
    let urlTwo = await uploadFile(fileTwo)

    if(productSelected) {
      
      setProductSelected({
        ...productSelected, 
        imageTwo: urlTwo
      })
    }
    setIsLoading(false);
  }
  const simulateUpload = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 10;
        if (nextProgress >= 100) {
          clearInterval(interval);
        }
        return nextProgress;
      });
    }, 300);
  }
  const simulateUploadTwo = () => {
    setProgressTwo(0);
    const interval = setInterval(() => {
      setProgressTwo((prevProgress) => {
        const nextProgress = prevProgress + 10;
        if (nextProgress >= 100) {
          clearInterval(interval);
        }
        return nextProgress;
      });
    }, 300);
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
    if (Object.values(productSelected).some(value => value === undefined)) {
      console.log(productSelected);
      console.error("Algunos campos están undefined. No se puede agregar el documento.");
      return;
    }
    try {
      const productsCollection = collection(db, "products")
      if(productSelected.id !== undefined){
        let obj = {
          ...productSelected,
          // unit_price: +productSelected.unit_price,
          ...(itsOnSale == true? {unit_price: newUnitPrice} : {unit_price: productSelected.unit_price}),
          category: categorySelected,
          colors: colors,
          details: updatedDetails,
          ...(salePercentageAux !== undefined && { sale: salePercentageAux }),
          ...(boxer && { boxer: true })
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
          details: updatedDetails,
          ...(salePercentageAux !== undefined && { sale: salePercentageAux }),
          ...(boxer && { boxer: true })
        }
        console.log(obj);
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
  const removeColorInput = () => {
    if(colors.length > 0){

      const newColors = [...colors];
      newColors.pop();
      setColors(newColors);
    }
  };

  const handleColorChange =(index, event)=> {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  }

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
      
      !itsOnSale &&      setNewUnitPrice(productSelected.unit_price)
      
      //TRAER CHECKS details
      colors.forEach((color, colorIndex)=> {
        sizes.forEach((size, sizeIndex) =>{
          
          const index = colorIndex * sizes.length + sizeIndex;
          
          let auxStock=productSelected.details[index]?.stock
          if (auxStock == undefined || !productSelected.details[index]){
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

      //boxer
      let auxBoxer = productSelected.boxer
      if (auxBoxer == undefined ){
        auxBoxer= false
      }
      setBoxer(auxBoxer)
      //sale
      let auxSaleCheck = false
      if(productSelected.sale > 1){
        auxSaleCheck = true;
      }
      if (auxSaleCheck == undefined ){
        auxSaleCheck= false
      }
      setItsOnSale(auxSaleCheck)
    }
    else{
      // setColors([colors])
    }
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
      console.log(newPriceAux);
      console.log(newUnitPrice);
    } else {
      setNewUnitPrice(oldPrice);
      setOldPrice(0);
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
            <h4>Información General</h4>
            <div className="inputModal">
              <h6>Nombre de la prenda</h6>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                className="input"
                defaultValue={productSelected?.title}
              />
              {errorsArray.title && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.title}           </Alert> }
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
              {errorsArray.unit_price && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.unit_price}           </Alert> }
              
            </div>
            <h6>Categoría</h6>
            <div className="inputModal">
              <select value={categorySelected&& categorySelected}  onChange={(e)=>{setCategorySelected(e.target.value);}}>
                <option value="">Categorias..</option>
                <option value="Remeras">Remeras</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Camisas">Camisas</option>
                <option value="Bermudas">Bermudas</option>
                <option value="Buzos">Buzos</option>
                <option value="Abrigos">Abrigos</option>
                <option value="Accesorios">Accesorios</option>
              </select>
              {errorsArray.category && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.category}           </Alert> }
              
            </div>
            {
              categorySelected == 'Accesorios' &&
              <div className='checkboxContainerLine'>
                <h6>El producto es un BOXER?</h6>
                <input type="checkbox" name='boxer' checked={boxer} onChange={handleBoxerChange} />
              </div>
            }

            <h6>Colores</h6>
            <div className='colorsDiv'>
              {colors.map((e, index) => (
                <div key={index} className="inputModal inputModalColors">
                  <input
                    type="text"
                    defaultValue={e}
                    onChange={(event) => handleColorChange(index, event)}
                    placeholder="Color"
                    className="inputModal"
                  />
                </div>
              ))}
              {errorsArray.colors && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.colors}           </Alert> }
              <p className='addMoreButton' onClick={()=> removeColorInput()}>-</p>
              <p className='addMoreButton' onClick={addColorInput}>+</p>
            </div>

            <div className='checkboxContainerLine'>
              <h6>El producto está en SALE?</h6>
              <input type="checkbox" name='itsOnSale' checked={itsOnSale} onChange={handleSaleChange} />
            </div>

            {
              itsOnSale &&
              <div className="inputModal">
                <h6>Porcentaje de descuento</h6>
                <input
                  type="number"
                  name="sale"
                  placeholder='%'
                  onChange={(event) => setSalePercentageAux(event.target.value)}
                  // onChange={(event) => console.log(event.target.value)}
                  className="input"
                  defaultValue={productSelected?.sale}
                />
                {errorsArray.sale && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.sale}           </Alert> }
              </div>
            }

            <div className="inputModal">
              <h6>Imagen Principal</h6>
              <input
                type="file"
                onChange={(e)=>setFile(e.target.files[0])}
                className="input"
              />
              {errorsArray.firstImage && <Alert key={'danger'} variant={'danger'} className='p-1' style={{ width: 'fit-content' }}>                {errorsArray.firstImage}           </Alert> }
              
            </div>
            {
              file &&
              <>
                <button type='button' className='confirmImage' onClick={handleImage}>Confirmar imagen principal</button>
                <ProgressBar now={progress} label={`${progress}%`} />
              </>
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
              <>
                <button type='button' className='confirmImage' onClick={handleImageTwo}>Confirmar imagen secundaria</button>
                <ProgressBar now={progressTwo} label={`${progress}%`} />
              </>
            }
            {
              !isLoading &&
              <p className='nextButtonCrud' onClick={handleNext}>Siguiente</p>
            }
          </div>
          )}
          
          {showSecondScreen && (
          <div>
            <h4>Información específica</h4>
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

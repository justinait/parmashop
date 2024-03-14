import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db, uploadFile } from '../../firebaseConfig';
import {addDoc, collection, updateDoc, doc} from "firebase/firestore"


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
  const [details, setDetails] = useState({
    // 0: { color: '', size: '', stock: '' }
  });

  const handleNext = () => {
    
    setShowSecondScreen(true);
    // if(productSelected.id !== undefined){
    //deberia ir esto pero creo q asi funciona
    if(productSelected.id){
      setSpecificInfo(productSelected)
    }
    else {
      setProductSelected({
        ...productSelected,
        category: categorySelected,
        colors: colors
      })
    }
  };

  const handleImage = async () => {
    setIsLoading(true);
    let url = await uploadFile(file);

    if(productSelected) {
      
      setProductSelected({
        ...productSelected, 
        image: url,
      })
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
      } else {
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
      
      console.log(productSelected);
      console.log(checkboxes);
      //TRAER CHECKS
      // colors.map(color=> {
      //   productSelected.details.map(e=> {
      //     if(e.color ==color){
      //       checkboxes[color]?.[e.size]= e.stock
      //     }
      //   })
      // })
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
    console.log(checkboxes);
  };

  const handleChecks = (e) => {
    e.preventDefault()
    const newStockArray = {};
  
    sizes.forEach((size) => {
      newStockArray[size] = {};
      (specificInfo.colors).map((color) => {
        const checkbox = document.getElementById(`checkbox${element}-${e}`);
        console.log(checkbox);
        newStockArray[size][color] = true
      });
    });
    console.log(newStockArray);
    return newStockArray
  };
  
  const handleDetails = () => {
    // const stockArray = handleChecks()
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
                          {console.log(productSelected)}
                          {console.log(categorySelected)}
                          {console.log(colors)}
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

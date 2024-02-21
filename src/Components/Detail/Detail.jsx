import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Detail.css'
import { CartContext } from '../../context/CartContext';
import { Placeholder, Spinner } from 'react-bootstrap';

function Detail() {
  
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState(true);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const refCollection = collection(db, 'products');
        const refDoc = doc(refCollection, id);
        const docSnap = await getDoc(refDoc);
        if (docSnap.exists()) {
          setProduct({ ...docSnap.data(), id: docSnap.id });
        } else {
          console.log('No such document!');
        }
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    setTimeout(() => {
      fetchProduct();
    }, 100);
  }, [id]);
  
  useEffect(()=>{
    checkStock();
  }, [selectedColor, selectedSize])

  useEffect (()=>{
    const loadProductAndSizes = async () => {
      setTimeout(() => {
        setSizes([]);
        handleSizes();
      }, 100);
    };
  
    loadProductAndSizes();
  }, [product])

  function onAdd (product) {
    let obj = {
      productData: product,
      color: selectedColor,
      size: selectedSize,
      id: product.id+selectedColor+selectedSize,
      quantity: 1
    }
    addToCart(obj)
    
  }
  
  const handleSizes = () => {
    if(product){
      if( product.category !== 'Bermudas' && product.category !== 'Pantalones'  ){
        setSizes(['S', 'M', 'L', 'XL'])
      } else {
        setSizes(['38', '40', '42', '44', '46'])
      }
    }
  }
  
  const handleColorPick = (e) => {
    setSelectedColor(e);
  }
  const handleSizePick = (e) => {
    setSelectedSize(e);
  }

  const checkStock = () => {
    if(product){
      const detailsArray = Object.values(product.details);
      
      if(selectedColor && !selectedSize){
        detailsArray.map((e)=>{
          if(selectedColor == e)  
            return true
          else  
            return false;
        })  
      }

      const foundDetail = detailsArray.some((e) => {
        return (e.color == selectedColor && e.size == selectedSize && e.stock);
      });

      return setStock(foundDetail)
    
    }
    else {
      return console.error('El producto aún no cargó.');
    }
  }

  return (
    <div>
      {loading ? 
      <div className='spinner'>
        <Spinner animation="border" role="status" >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
      : (
        <div className='detailContainer'>
          <img src={product.image} alt={product.title} className='imageDetail'/>
          <div className='infoBasic'>
            <p className='nameDetail'>{product.title}</p>
            <p className='brandDetail'>Shato</p>
            <p className='priceDetail'>${product.unit_price}</p>
            
            <div className='separatorLine'></div>
            
            <p className='selectDetail'>Seleccionar color</p>
            <div className='sizesBox'>
              {product.colors.map((e, i)=>{
                return <p key={i}  onClick={()=>{handleColorPick(e)}} className={`size ${selectedColor === e ? 'sizeActive' : ''}`}>{e}</p>
              })}
            </div>
            
            <p className='selectDetail'>Seleccionar talle</p>
            <div className='sizesBox'>
              {sizes.map((e, i)=>{
                return <p key={i}  onClick={()=>{handleSizePick(e)}} className={`size ${selectedSize === e ? 'sizeActive' : ''}`}>{e}</p>
              })}
            </div>

            {
              (selectedColor && selectedSize) &&
              !stock &&
              <p>No hay stock</p>
            }
            <button 
            onClick={()=>onAdd(product)} 
            className={`addToCartButton ${!stock ? 'disabledButton' : ''}`}
            disabled={!stock || !selectedColor || !selectedSize}
            >Agregar al carrito</button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
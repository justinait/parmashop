import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Detail.css'
import { CartContext } from '../../context/CartContext';

function Detail() {
  
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState(true);

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
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    fetchProduct();

    setSizes([]);
    handleSizes();
    
  }, [id]);

  useEffect(()=>{
    checkStock();
  }, [selectedColor, selectedSize])

  function onAdd (product) {
    let obj = [
      product,
      selectedColor,
      selectedSize
    ]
    addToCart(obj)
    console.log(obj)
  }
  
  const handleSizes = () => {
    if( product && (product.category !== 'shorts' || product.category !== 'jeans' ) ){
      setSizes(['S', 'M', 'L', 'XL'])
    } else {
      setSizes(['38', '40', '42', '44', '46'])
    }
  }
  
  const handleColorPick = (e) => {
    // cual es la mejor forma de diferenciar color y talle
    setSelectedColor(e);
  }
  const handleSizePick = (e) => {
    setSelectedSize(e);
  }

  const checkStock = () => {
    if(product){
      const detailsArray = Object.values(product.details);
      const foundDetail = detailsArray.find((e) => {
        return (e.color === selectedColor && e.size === selectedSize && e.stock);
      });
      return setStock(foundDetail)
    }else {
      return console.error('El producto o los detalles del producto son nulos o indefinidos.');
  }
  }

  return (
    <div>
      {product && (
        <div className='detailContainer'>
          {console.log(product.details)}
          <img src={product.image} alt={product.name} className='imageDetail'/>
          <div className='infoBasic'>
            <p className='nameDetail'>{product.name}</p>
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
              !stock &&
              <p>No hay stock</p>
            }
            <button onClick={()=>onAdd(product)} className='addToCartButton' disabled={!stock} >Agregar al carrito</button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
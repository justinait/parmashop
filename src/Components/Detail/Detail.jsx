import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Detail.css'

function Detail() {
  
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState(['38', '40', '42', '44', '46'])

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

  return (
    <div>
      {product && (
        <div className='detailContainer'>
          {console.log(product)}
          <img src={product.image} alt={product.name} className='imageDetail'/>
          <div className='infoBasic'>
            <p className='nameDetail'>{product.name}</p>
            <p className='brandDetail'>Shato</p>
            <p className='priceDetail'>${product.unit_price}</p>
            
            <div className='separatorLine'></div>
            
            <p className='selectDetail'>Seleccionar color</p>
            <div className='sizesBox'>
              <p className='size' onClick={()=>{handleColorPick(e)}}>Negro</p>
              <p className='size'>Blanco</p>
            </div>

            
            <p className='selectDetail'>Seleccionar talle</p>
            <div className='sizesBox'>
              {sizes.map((e, i)=>{
                return <p key={i}  onClick={()=>{handleSizePick(e)}} className={`size ${selectedSize === e ? 'sizeActive' : ''}`}>{e}</p>
              })}
            </div>

            <button className='addToCartButton'>Agregar al carrito</button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
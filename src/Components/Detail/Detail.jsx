import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { Link, useParams } from 'react-router-dom';
import './Detail.css'
import { CartContext } from '../../context/CartContext';
import { Spinner } from 'react-bootstrap';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import Carousel from 'react-bootstrap/Carousel';

function Detail() {
  
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [stock, setStock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sizeChartOpen, setSizeChartOpen] = useState(false)

  const { addToCart } = useContext(CartContext);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
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
    if (product) {
      if (product.category === 'Bermudas' || product.category === 'Pantalones') {
        setSizes(['38', '40', '42', '44', '46']);
      } else if (product.category === 'Accesorios' && !product.boxer) {
        setSizes([]);
      } else if(product.category === 'Accesorios' && product.boxer){
        setSizes(['S', 'M', 'L']);
      } else {
        setSizes(['S', 'M', 'L', 'XL']);
      }
    }
  };
  
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
  }

  let unitPrice = Math.trunc(product?.unit_price);
  let quota = Math.trunc((product?.unit_price/3));
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
          <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
              <img src={product.image} alt={product.title} className='imageDetail'/>
            </Carousel.Item>
            {product.imageTwo &&
            <Carousel.Item>
              <img src={product.imageTwo} alt={product.title} className='imageDetail'/>
            </Carousel.Item>
            }
            {product.image3 &&
            <Carousel.Item>
              <img src={product.image3} alt={product.title} className='imageDetail'/>
            </Carousel.Item>
            }
            {product.image4 &&
            <Carousel.Item>
              <img src={product.image4} alt={product.title} className='imageDetail'/>
            </Carousel.Item>
            }
            {product.image5 &&
            <Carousel.Item>
              <img src={product.image5} alt={product.title} className='imageDetail'/>
            </Carousel.Item>
            }
            {product.image6 &&
            <Carousel.Item>
              <img src={product.image6} alt={product.title} className='imageDetail'/>
            </Carousel.Item>
            }
          </Carousel>
          {
            product.sale > 0 &&
            <p className='saleDetail'>{product.sale}% OFF</p>
          }
          <div className='infoBasic'>
  
            <Link to={`/${product?.category}`} className='backTo'> <KeyboardBackspaceOutlinedIcon/>Volver a {product.category}</Link>

            <p className='nameDetail'>{product.title}</p>
            <p className='priceDetail'>${unitPrice}</p>
            <p className='quotaDetail'>3 cuotas sin interés de ${quota}</p>
            <p className='quotaDetail'>20% off en transferencias</p>
            
            <div className='separatorLine'></div>
            
            <p className='selectDetail'>Seleccionar color</p>
            <div className='sizesBox'>
              {product.colors.map((e, i)=>{
                return <p key={i}  onClick={()=>{handleColorPick(e)}} className={`size ${selectedColor === e ? 'sizeActive' : ''}`}>{e}</p>
              })}
            </div>
            {
              sizes.length > 0 &&
              <>
                <p className='selectDetail'>Seleccionar talle</p>
                <div className='sizesBox'>
                  {sizes.map((e, i)=>{
                    return <p key={i}  onClick={()=>{handleSizePick(e)}} className={`size ${selectedSize === e ? 'sizeActive' : ''}`}>{e}</p>
                  })}
                </div>
              </>
            }

            {
              (selectedColor && selectedSize) &&
              !stock &&
              <p className='noStock'>Sin stock</p>
            }
            <button 
              onClick={()=>onAdd(product)} 
              className={`addToCartButton ${
                ((product.category != 'Accesorios' || (product.category == 'Accesorios' && product.boxer)) && !stock) 
                  || !selectedColor 
                  ||((product.category != 'Accesorios' || (product.category == 'Accesorios' && product.boxer)) && !selectedSize)
                ? 'disabledButton' : ''}`}
              disabled={(
                (product.category != 'Accesorios' || (product.category == 'Accesorios' && product.boxer)) && !stock) 
                || !selectedColor 
                ||((product.category != 'Accesorios' || (product.category == 'Accesorios' && product.boxer)) && !selectedSize)}
            >Agregar al carrito</button>

            {
              product.description &&
              <p className='detailDescription'>{product.description}</p>
            }
            {
              product.sizeChart &&
              <div>

                <div className='sizeChartText' onClick={()=>setSizeChartOpen(!sizeChartOpen)}>
                  <p>¿Cuál es mi talle?</p>
                  {sizeChartOpen ? <p>-</p> : <p>+</p>}
                </div>
                  {
                    sizeChartOpen &&
                    <img className='sizeChartImage' src={product.sizeChart} alt="Tabla de talles" />
                  }
              </div>
            }

          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
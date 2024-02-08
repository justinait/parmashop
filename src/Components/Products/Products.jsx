import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Products.css'
import { ProductsContext } from '../../context/ProductsProvider';

function Products() {
  const { dataProducts } = useContext(ProductsContext);
  const {id} = useParams();
  const [product, setProduct] = useState([]);

  const getProduct = () =>{

    dataProducts?.map(e => {

      setProduct(e);
      return product

    })
  }

  useEffect(()=>{
    getProduct();
  }, [])
  return (
    <div className='productsContainer'>

      <h2 className=''>NUESTROS PRODUCTOS</h2>

      {
        dataProducts && dataProducts.slice().reverse().map((e, i) =>  {
          return(
            <Link to={`/${e.name}`} className='productContainer' key={i}>
              <img src={e.image} alt={e.name} className='imgProduct'/>
              <div className='productInfoContainer'>
                <p className='productName'>{e.name}</p>
                <p className='productPrice'>$ {e.unit_price}</p>
              </div>

            </Link>
          )
        })
      }

    </div>
  )
}

export default Products
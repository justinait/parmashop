import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Products.css'
import { ProductsContext } from '../../context/ProductsProvider';

function Products() {
  const { dataCurtains } = useContext(ProductsContext);
  const {curtain} = useParams();
  const [product, setProduct] = useState([]);

  const getProduct = () =>{

    dataCurtains?.map(e => {

      setProduct(e);
      return product

    })
  }

  useEffect(()=>{
    getProduct();
  }, [])
  return (
    <div className='productsContainer'>

      <h2 className='curtainsh2' > NUESTRAS CORTINAS</h2>

      {
        dataCurtains && dataCurtains.slice().reverse().map((e, i) =>  {
          return(
            <Link to={`/${e.name}`} className='productContainer' key={i}>
              <img src={e.image} alt={e.name} className='imgProduct'/>
              <div className='productInfoContainer'>
                <p className='productName'>{e.name}</p>
                <p dangerouslySetInnerHTML={{ __html: e.description }} className='productDescription'></p>
                <p className='moreInfo'>Ver más...</p>
              </div>

            </Link>
          )
        })
      }

    </div>
  )
}

export default Products
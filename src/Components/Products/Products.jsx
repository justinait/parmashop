import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Products.css'
import { ProductsContext } from '../../context/ProductsProvider';

function Products() {
  const { dataProducts } = useContext(ProductsContext);
  const {category} = useParams();
  const [productsList, setProductsList] = useState(dataProducts);

  const getProducts = () => {
    let filteredProducts
    if (category) {
      filteredProducts = dataProducts?.filter((e) => e?.category === category);
    }
    setProductsList(filteredProducts)
    return productsList;
  };
  
  useEffect(() => {
    getProducts();
  }, [category]);

  return (
    <div className='productsContainer'>
      {console.log(category)}
      <h2 className=''>NUESTROS PRODUCTOS</h2>

      {
        productsList && productsList.slice().reverse().map((e, i) =>  {
          return(
            <Link to={`/item/${e.id}`} className='productContainer' key={i}>
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
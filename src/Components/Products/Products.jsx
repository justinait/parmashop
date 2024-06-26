import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Products.css'
import { ProductsContext } from '../../context/ProductsProvider';
import Pagination from 'react-bootstrap/Pagination';

function Products({handlePageChange, activePage}) {
  const { dataProducts } = useContext(ProductsContext);
  const {category} = useParams();
  const [title, setTitle] = useState()
  const [productsList, setProductsList] = useState(dataProducts); 
  const itemsPerPage = 12;

  const getProducts = () => {
    let filteredProducts
    if (category && category!='category') {
      
      filteredProducts = dataProducts?.filter((e) => e?.category === category);
      setTitle(category)
      setProductsList(filteredProducts)
      if(category == 'NUEVO'){
        filteredProducts = dataProducts?.sort((a, b) => b.timestamp - a.timestamp);
        setProductsList(filteredProducts)
      }
      if(category == 'sale'){
        filteredProducts = dataProducts?.filter((e)=> e.sale && (e.sale > 0))
        setProductsList(filteredProducts)
      }
      
    } else {
      setTitle('Todos los productos')
      setProductsList(dataProducts)
    }
    return productsList;
  };

  const totalPages = Math.ceil(productsList?.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productsList?.slice(startIndex, endIndex);

  useEffect(() => {
    getProducts()
    handlePageChange(1)
    const scrollPosition = JSON.parse(localStorage.getItem("scrollPosition"));
    if (scrollPosition && scrollPosition.category === category) {
      window.scrollTo(scrollPosition.x, scrollPosition.y);
    } else {
      window.scrollTo(100, 0);
    }
  }, [category, dataProducts]);

  const handleScroll = () => {
    localStorage.setItem("scrollPosition", JSON.stringify({ x: window.scrollX, y: window.scrollY }));
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
    <div className='productsContainer'>
      <h2 className='categoryTitle'>{title} </h2>

      {
        currentProducts && currentProducts.slice().reverse().map((e, i) =>  {
          
          let unitPrice = Math.trunc(e.unit_price);
          let quota = Math.trunc((e.unit_price/3));
          return(
            <Link to={`/item/${e.id}`} className='productContainer' key={i}>
              <img src={e.image} alt={e.title} className='imgProduct'/>
              {
                e.sale > 0 &&
                <p className='stockProducts'>{e.sale}% OFF</p>
              }
              <div className='productInfoContainer'>
                {
                  (e.oldPrice != undefined && e.oldPrice != e.unit_price && e.oldPrice > 0 && e.sale > 0)?
                  <div className='salePricesDiv'>
                    <p className='productName'>{e.title}</p>
                    <p className='oldPrice'>$ {e.oldPrice}</p>
                    <p className='productPrice'>$ {unitPrice}</p>
                    {(unitPrice >= 23000) &&
                    <p className='productCuotes'>3 cuotas sin interés de ${quota} </p>
                    }
                    {/* <p className='productCuotes'>3 cuotas sin interés de ${quota} </p> */}
                  </div>:
                  <div>
                    <p className='productName'>{e.title}</p>
                    <p className='productPrice'>$ {unitPrice}</p>
                    {(unitPrice >= 23000) &&
                    <p className='productCuotes'>3 cuotas sin interés de ${quota} </p>
                    }
                  </div>
                }
              </div>

            </Link>
          )
        })
      }

    </div>

      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(activePage - 1)}
          disabled={activePage === 1}
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(activePage + 1)}
          disabled={activePage === totalPages}
        />
      </Pagination>
    </div>
  )
}

export default Products
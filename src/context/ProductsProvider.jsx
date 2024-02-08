import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { createContext } from 'react';
import {db} from '../firebaseConfig';

const ProductsContext = createContext();

function ProductsProvider({children}) {

  const [dataProducts, setDataProducts] = useState(null);

  useEffect(()=>{
    let refCollection = collection(db, 'products')
    getDocs(refCollection)
    .then((res)=>{
      let newArray = res.docs.map(e =>{
        return {
          ...e.data(), 
          id: e.id
        }
      })
      setDataProducts(newArray);
    })
    .catch((err)=>console.log(err))
  }, [])

  // useEffect(() => {
  //   const getProducts = async () => {
  //     try {
  //       const productsCollection = collection(db, 'products');
  //       const productsSnapshot = await getDocs(productsCollection);

  //       const productsList = productsSnapshot.docs.map((e) => {
  //         let eachItem = e.data();
  //         eachItem.id = e.id;

  //         return eachItem;
  //       });

  //       setDataProducts(productsList);
        
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };
  //   getProducts();
  // }, []);

  return (
    <ProductsContext.Provider value={{ dataProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
export { ProductsContext }

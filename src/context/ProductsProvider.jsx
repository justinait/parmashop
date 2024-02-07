import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { createContext } from 'react';
import {db} from '../firebaseConfig';

const ProductsContext = createContext();

function ProductsProvider({children}) {

  const [dataProducts, setDataProducts] = useState(null);
  const [dataFabrics, setDataFabrics] = useState(null);

  useEffect(() => {
    const getCurtains = async () => {
      try {
        const curtainsCollection = collection(db, 'curtains');
        const curtainsSnapshot = await getDocs(curtainsCollection);

        const curtainsList = curtainsSnapshot.docs.map((e) => {
          let eachItem = e.data();
          eachItem.id = e.id;

          return eachItem;
        });

        setDataProducts(curtainsList);
        
      } catch (error) {
        console.error('Error fetching curtains:', error);
      }
    };
    getCurtains();
  }, []);
  
  useEffect(() => {
    const getFabrics = async () => {
      try {
        const fabricsCollection = collection(db, 'fabrics');
        const fabricsSnapshot = await getDocs(fabricsCollection);

        const fabricsList = fabricsSnapshot.docs.map((e) => {
          let eachItem = e.data();
          eachItem.id = e.id;

          return eachItem;
        });

        setDataFabrics(fabricsList);
        
      } catch (error) {
        console.error('Error fetching Fabrics:', error);
      }
    };
    getFabrics();
  }, []);

  return (
    <ProductsContext.Provider value={{ dataProducts, dataFabrics }}>
      {children}
    </ProductsContext.Provider>
  );
}

export default ProductsProvider;
export { ProductsContext }

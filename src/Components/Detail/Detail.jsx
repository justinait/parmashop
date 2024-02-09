import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';

function Detail() {
  
  const {id} = useParams();
  const [product, setProduct] = useState(null)

  useEffect(() => {
    console.log(id)
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
  }, [id]);
  return (
    <div>
      {product ? (
        <div>
          {console.log(product)}
          <h2>{product.name}</h2>
          <p>{product.unit_price}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Detail
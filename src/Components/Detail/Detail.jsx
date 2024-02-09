import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig';
import { useParams } from 'react-router-dom';
import './Detail.css'

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
      {product && (
        <div className='detailContainer'>
          {console.log(product)}
          <img src={product.image} alt={product.name} className='imageDetail'/>
          <div className='infoBasic'>
            <p className='nameDetail'>{product.name}</p>
            <p className='brandDetail'>Shato</p>
            <p className='priceDetail'>${product.unit_price}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home'
import Navbar from './Components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductsContainer from './Components/Products/ProductsContainer';
import CheckScroll from './CheckScroll'
import Products from './Components/Products/Products';
import ProductsProvider from './context/ProductsProvider';
import Detail from './Components/Detail/Detail';
import Changes from './Components/Changes/Changes';
import Login from './Components/Login/Login';
import Cart from './Components/Cart/Cart';
import CartContextComponent from './context/CartContext';
import Checkout from './Components/Checkout/Checkout';

function App() {

  return (
    <>
      <ProductsProvider>
      <CartContextComponent>
          <BrowserRouter>
            <Navbar/>
            <CheckScroll />
            <Routes>
              
              <Route path='/' element={< Home />} />
              
              <Route path='item/:id' element={<Detail />} />
              <Route path=':category' element={< Products />} />
              <Route path='/changes' element={< Changes />} />
              <Route path='/login' element={< Login />} />
              <Route path='/cart' element={< Cart />} />
              <Route path='/checkout' element={< Checkout />} />
              
              {/* <Route element={<ProtectedAdmin/>} >
                <Route path="/dashboard" element={<Dashboard/>} />
              </Route> */}
              
            </Routes>
            <Footer />
          </BrowserRouter>
        </CartContextComponent>
      </ProductsProvider>
    </>
  )
}

export default App

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home'
import Navbar from './Components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from './Components/Products/Products';
import ProductsProvider from './context/ProductsProvider';
import Detail from './Components/Detail/Detail';
import Changes from './Components/Changes/Changes';
import Login from './Components/Login/Login';
import Cart from './Components/Cart/Cart';
import Checkout from './Components/Checkout/Checkout';
import CartContextComponent from './context/CartContext';
import AuthContextComponent from './context/AuthContext';
import Dashboard from './Components/Dashboard/Dashboard';
import ProtectedAdmin from './ProtectedAdmin';
import UserOrders from './Components/UserOrders/UserOrders';
import CheckScroll from './CheckScroll';
import { useState } from 'react';

function App() {
  const [activePage, setActivePage] = useState(1); // Definir activePage utilizando useState

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };
  return (
    <>
      <ProductsProvider>
        <CartContextComponent>
          <AuthContextComponent>
            <BrowserRouter>
              <CheckScroll pageNumber={activePage} />
              <Navbar/>
              <Routes>
                
                <Route path='/' element={< Home />} />
                
                <Route path='item/:id' element={<Detail />} />
                <Route path=':category' element={< Products  handlePageChange={handlePageChange} />} />
                <Route path='/changes' element={< Changes />} />
                <Route path='/login' element={< Login />} />
                <Route path='/cart' element={< Cart />} />
                <Route path='/checkout' element={< Checkout />} />
                
                <Route element={<ProtectedAdmin/>} >
                  <Route path="/dashboard" element={<Dashboard/>} />
                  <Route path="/orders" element={<UserOrders/>} />
                  
                </Route>
                <Route path='*' element={<Navigate to="/" />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </AuthContextComponent>
        </CartContextComponent>
      </ProductsProvider>
    </>
  )
}

export default App

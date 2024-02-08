import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './Components/Footer/Footer';
import Home from './Components/Home/Home'
import Navbar from './Components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductsContainer from './Components/Products/ProductsContainer';
import CheckScroll from './CheckScroll'
import Products from './Components/Products/Products';
import ProductsProvider from './context/ProductsProvider';

function App() {

  return (
    <>
      <ProductsProvider>
        <BrowserRouter>
          <Navbar/>
          <CheckScroll />
          <Routes>
            
            <Route path='/' element={< Home />} />
            
            <Route path='/:product' element={< Products />} />
            
            {/* <Route path='/entrar' element={< Login />} />
            <Route path='/about' element={< About />} /> */}
            {/* <Route path='/:curtain' element={< Detail />} /> */}
            {/* <Route element={<ProtectedAdmin/>} >
              <Route path="/dashboard" element={<Dashboard/>} />
            </Route> */}
            
          </Routes>
          <Footer />
        </BrowserRouter>
      </ProductsProvider>
    </>
  )
}

export default App

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import ProductView from './components/Products/ProductView';
import CartList from './components/Carts/CartList';
import CartForm from './components/Carts/CartForm';
import UserList from './components/Users/UserList';
import UserForm from './components/Users/UserForm';
import CustomNavbar from './components/Navbar/CustomNavbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <CustomNavbar />
          <div className="container flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id" element={<ProductForm />} />
              <Route path="/product/:id" element={<ProductView />} />
              <Route path="/carts" element={<CartList />} />
              <Route path="/carts/new" element={<CartForm />} />
              <Route path="/carts/:id" element={<CartForm />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/:id" element={<UserForm />} />
            </Routes>
          </div>
          <footer className="bg-dark text-light py-3 mt-auto">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <h5>Fake Store Inc.</h5>
                  <p>© 2025 Fake Store Inc. All rights reserved.</p>
                </div>
                <div className="col-md-4">
                  <h5>Contact Us</h5>
                  <p>Phone: (123) 456-7890</p>
                </div>
                <div className="col-md-4">
                  <h5>Follow Us</h5>
                  <p>
                    <button className="btn btn-link text-light me-2 p-0">Twitter</button>
                    <button className="btn btn-link text-light me-2 p-0">Facebook</button>
                    <button className="btn btn-link text-light p-0">Instagram</button>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
// CartList.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCarts, deleteCart, getProducts } from '../../services/api';

const CartList = () => {
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCarts();
  }, [token, navigate]);

  const fetchCarts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCarts();
      setCarts(response.data);
    } catch (error) {
      setError('Failed to load carts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCart(id);
      fetchCarts();
    } catch (error) {
      setError('Failed to delete cart. Please try again.');
    }
  };

  const calculateCartTotal = async (cart) => {
    const productsResponse = await getProducts();
    const products = productsResponse.data;
    let total = 0;
    cart.products.forEach(cartProduct => {
      const product = products.find(p => p.id === cartProduct.productId);
      if (product) {
        total += product.price * cartProduct.quantity;
      }
    });
    return total.toFixed(2);
  };

  const calculateAllCartsTotal = async () => {
    let total = 0;
    for (const cart of carts) {
      total += Number(await calculateCartTotal(cart));
    }
    alert(`Total price for all carts: $${total.toFixed(2)}`);
  };

  return (
    <div className="container mt-3 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">Carts</h2>
        <div>
          <button 
            onClick={() => navigate('/carts/new')} 
            className="btn btn-success me-2"
          >
            Add Cart
          </button>
          <button 
            onClick={calculateAllCartsTotal} 
            className="btn btn-info"
          >
            Checkout All (${carts.length > 0 ? '...' : '0.00'})
          </button>
        </div>
      </div>
      {isLoading && <div className="alert alert-info">Loading carts...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {carts.map((cart) => (
          <CartItem 
            key={cart.id} 
            cart={cart} 
            navigate={navigate} 
            calculateCartTotal={calculateCartTotal} 
            handleDelete={handleDelete} 
          />
        ))}
      </div>
    </div>
  );
};

const CartItem = ({ cart, navigate, calculateCartTotal, handleDelete }) => {
  const [total, setTotal] = useState('...');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchTotal = async () => {
      const total = await calculateCartTotal(cart);
      setTotal(total);
    };

    fetchTotal();
  }, [cart, calculateCartTotal]);

  return (
    <div 
      className="col-md-4 mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`card h-100 border-0 shadow-sm ${isHovered ? 'enlarged-cart' : ''}`}
        style={{ 
          transition: 'all 0.3s ease',
          height: isHovered ? 'auto' : '400px', // Fixed height when not hovered
          overflow: 'hidden'
        }}
      >
        <div className="card-body p-3">
          <h5 className="card-title mb-1">Cart #{cart.id}</h5>
          <p className="card-text text-muted mb-2">User ID: {cart.userId}</p>
          {cart.products.map((cartProduct, index) => (
            <AsyncProduct 
              key={index} 
              cartProduct={cartProduct} 
              navigate={navigate} 
              show={isHovered || index === 0} // Show only first product when not hovered
            />
          ))}
          <p className={`card-text fw-bold mb-2 ${!isHovered ? 'position-absolute bottom-0 w-100 p-2 bg-light' : ''}`}>
            Total: ${total}
          </p>
          <div className="d-flex gap-2">
            <button
              onClick={() => navigate(`/carts/${cart.id}`)}
              className="btn btn-primary btn-sm"
            >
              Edit Cart
            </button>
            <button
              onClick={() => handleDelete(cart.id)}
              className="btn btn-danger btn-sm"
            >
              Delete Cart
            </button>
            <button
              onClick={() => alert(`Checkout for Cart #${cart.id}: $${total}`)}
              className="btn btn-success btn-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .enlarged-cart {
          transform: scale(1.1);
          z-index: 10;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          height: auto !important;
          overflow: visible;
        }
      `}</style>
    </div>
  );
};

const AsyncProduct = ({ cartProduct, navigate, show }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const productsResponse = await getProducts();
      const product = productsResponse.data.find(p => p.id === cartProduct.productId);
      setProduct(product);
    };

    fetchProduct();
  }, [cartProduct]);

  if (!product || !show) {
    return null; // Don't render if not hovered and not the first product
  }

  return (
    <div className="mb-2 p-2 bg-light rounded-1 border border-light">
      <div className="d-flex align-items-start gap-2">
        <img 
          src={product.image} 
          alt={product.title} 
          className="img-fluid rounded" 
          style={{ width: '75px', height: '75px', objectFit: 'cover' }}
        />
        <div className="flex-grow-1">
          <h6 className="mb-1">{product.title}</h6>
          <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
            {product.description.length > 50 
              ? `${product.description.substring(0, 50)}...` 
              : product.description}
          </p>
          <p className="mb-1" style={{ fontSize: '0.9rem' }}>
            ${product.price.toFixed(2)} x {cartProduct.quantity} = ${(product.price * cartProduct.quantity).toFixed(2)}
          </p>
          <div className="d-flex gap-1">
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="btn btn-primary btn-sm"
            >
              Edit
            </button>
            <button
              onClick={() => alert('Delete product from cart not implemented')}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartList;
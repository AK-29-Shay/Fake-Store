import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarts, createCart, updateCart } from '../../services/api';

const CartForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState({
    userId: '',
    products: [{ productId: '', quantity: '' }]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCarts();
      const foundCart = response.data.find(c => c.id === parseInt(id));
      if (foundCart) setCart(foundCart);
    } catch (error) {
      setError('Failed to load cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadCart();
    }
  }, [id, loadCart]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (id) {
        await updateCart(id, cart);
      } else {
        await createCart(cart);
      }
      navigate('/carts');
    } catch (error) {
      setError('Failed to save cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...cart.products];
    newProducts[index][field] = value;
    setCart({ ...cart, products: newProducts });
  };

  const addProduct = () => {
    setCart({
      ...cart,
      products: [...cart.products, { productId: '', quantity: '' }]
    });
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit' : 'Create'} Cart</h2>
      {isLoading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">User ID</label>
          <input
            type="number"
            className="form-control"
            value={cart.userId}
            onChange={(e) => setCart({...cart, userId: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <h4>Products</h4>
        {cart.products.map((product, index) => (
          <div key={index} className="mb-3">
            <div className="row">
              <div className="col">
                <label className="form-label">Product ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={product.productId}
                  onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="col">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addProduct}
          disabled={isLoading}
        >
          Add Product
        </button>
        <br />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default CartForm;
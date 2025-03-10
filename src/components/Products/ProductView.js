// ProductView.jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, addToCart } from '../../services/api';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      const foundProduct = response.data.find(p => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found.');
      }
    } catch (error) {
      setError('Failed to load product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]);

  const handleAddToCart = async () => {
    try {
      await addToCart({ 
        userId: 1, // Default user ID or fetch from context/auth
        productId: product.id, 
        quantity: 1 
      });
      alert('Product added to cart successfully!');
      navigate('/carts'); // Navigate to carts page after adding
    } catch (error) {
      setError('Failed to add product to cart. Please try again.');
    }
  };

  if (isLoading) return <div className="alert alert-info">Loading product...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return null;

  const truncatedDescription = product.description.length > 100 
    ? `${product.description.substring(0, 100)}...` 
    : product.description;

  return (
    <div className="container mt-5">
      <h2>{product.title}</h2>
      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.image} 
            alt={product.title} 
            className="img-fluid rounded" 
            style={{ width: '300px', height: '300px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Description:</strong> {truncatedDescription}</p>
          <div className="d-flex gap-2">
            <button 
              onClick={() => navigate(`/products/${product.id}`)} 
              className="btn btn-primary"
            >
              Edit
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="btn btn-danger"
            >
              Delete
            </button>
            <button 
              onClick={handleAddToCart} 
              className="btn btn-success"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
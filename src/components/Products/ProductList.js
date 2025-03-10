import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [token, navigate]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      setError('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="container mt-5 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button 
          onClick={() => navigate('/products/new')} 
          className="btn btn-success"
        >
          Add Product
        </button>
      </div>
      {isLoading && <div className="alert alert-info">Loading products...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="col-md-4 mb-4"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div 
              className="card h-100"
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={product.image} 
                className="card-img-top" 
                alt={product.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }} // Uniform size
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
                <p className="card-text">
                  {product.description.length > 50 
                    ? `${product.description.substring(0, 50)}...` 
                    : product.description}
                </p>
                <div className="d-flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            {hoveredProduct === product.id && <div className="dimmed" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
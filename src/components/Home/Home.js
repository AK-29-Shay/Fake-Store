import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from '../../logo.svg';
import { getProducts } from '../../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(''); // the search input
  const [category, setCategory] = useState('');     //  the category dropdown
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProducts();
      const products = response.data;

      // Filter products search and category
      const filteredProduct = products.find(p =>
        (!category || p.category === category) && // Match category if selected
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) // Match search term
      );

      if (filteredProduct) {
        navigate(`/product/${filteredProduct.id}`); // Navigate to the product page
      } else {
        setError('No products found matching your search.');
      }
    } catch (error) {
      setError('Failed to search products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <img src={Logo} alt="Fake Store Logo" className="mb-3" style={{ height: '100px' }} />
      <h1 className="display-4 fw-bold text-dark mb-3">Fake Store</h1>
      <p className="lead text-muted mb-4">
        Your One-Stop Shop for Everything You Need!
      </p>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-2 align-items-center justify-content-center">
          <div className="col-md-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                value={searchTerm} // input value to search
                onChange={(e) => setSearchTerm(e.target.value)} // Update search on input change
                disabled={isLoading}
                aria-label="Search products"
                style={{ borderRadius: 'var(--radius-md)' }}
              />
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="input-group-text"
                style={{ height: '100%', padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)' }}
              >
                {isLoading ? '...' : 'Search'}
              </Button>
            </div>
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <select
              className="form-control"
              value={category} // Bind value to category state
              onChange={(e) => setCategory(e.target.value)} // Update category on select change
              disabled={isLoading}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
          </div>
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/products')}
        className="shadow mb-4"
        style={{ borderRadius: 'var(--radius-md)' }}
      >
        Shop Now
      </Button>
      {/* The image tag with incomplete base64 data was removed to fix errors */}
    </div>
  );
};

export default Home;

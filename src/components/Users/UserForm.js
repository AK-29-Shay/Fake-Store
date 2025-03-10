import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUser } from '../../services/api';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    username: '',
    password: '',
    name: { firstname: '', lastname: '' },
    address: { city: '', street: '', number: '', zipcode: '' },
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      const foundUser = response.data.find(u => u.id === parseInt(id));
      if (foundUser) setUser(foundUser);
    } catch (error) {
      setError('Failed to load user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id, loadUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (id) {
        await updateUser(id, user);
      } else {
        await createUser(user);
      }
      navigate('/users');
    } catch (error) {
      setError('Failed to save user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (field, value) => {
    setUser({ ...user, name: { ...user.name, [field]: value } });
  };

  const handleAddressChange = (field, value) => {
    setUser({ ...user, address: { ...user.address, [field]: value } });
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit' : 'Create'} User</h2>
      {isLoading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={user.username}
            onChange={(e) => setUser({...user, username: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            value={user.name.firstname}
            onChange={(e) => handleNameChange('firstname', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={user.name.lastname}
            onChange={(e) => handleNameChange('lastname', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            value={user.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            type="text"
            className="form-control"
            value={user.address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number</label>
          <input
            type="text"
            className="form-control"
            value={user.address.number}
            onChange={(e) => handleAddressChange('number', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Zipcode</label>
          <input
            type="text"
            className="form-control"
            value={user.address.zipcode}
            onChange={(e) => handleAddressChange('zipcode', e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            value={user.phone}
            onChange={(e) => setUser({...user, phone: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
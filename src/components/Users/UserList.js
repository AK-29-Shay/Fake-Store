import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="container mt-5 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Users</h2>
        <button 
          onClick={() => navigate('/users/new')} 
          className="btn btn-success"
        >
          Add User
        </button>
      </div>
      {isLoading && <div className="alert alert-info">Loading users...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {users.map((user) => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{user.name.firstname} {user.name.lastname}</h5>
                <p className="card-text">Email: {user.email}</p>
                <p className="card-text">Username: {user.username}</p>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="btn btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
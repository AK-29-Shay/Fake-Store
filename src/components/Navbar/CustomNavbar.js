import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Logo from '../../logo.svg';

const CustomNavbar = () => {
  const { token, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" style={{ borderRadius: '10px' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Fake Store Logo" className="me-2" style={{ height: '30px' }} />
          Fake Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/carts">Carts</Nav.Link>
            <Nav.Link as={Link} to="/users">Users</Nav.Link>
          </Nav>
          <Nav>
            {token ? (
              <Button onClick={logout} variant="outline-light">Logout</Button>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
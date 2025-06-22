import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../store/FavoritesStore';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { House, HeartFill } from 'react-bootstrap-icons';

function NavbarBootstrap() {
  const photos = useFavoritesStore((state) => state.photos);
  const posts = useFavoritesStore((state) => state.posts);

  const totalFavorites = photos.length + posts.length;

  return (
    <Navbar 
      variant="dark" 
      expand="lg" 
      className="shadow-sm"
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          JSONPlaceholder
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <House className="me-1" /> Ana Sayfa
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link as={Link} to="/favorites" className="position-relative">
              <HeartFill className="me-1" style={{ color: 'var(--accent-secondary)' }} /> Favoriler
              {totalFavorites > 0 && (
                <Badge 
                  pill 
                  bg="danger"
                  className="ms-2 position-absolute top-0 start-100 translate-middle-x"
                  style={{ fontSize: '0.7em', padding: '0.4em 0.6em' }}
                >
                  {totalFavorites}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarBootstrap;
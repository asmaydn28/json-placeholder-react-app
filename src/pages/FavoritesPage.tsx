import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Image, FileEarmarkText, Trash } from 'react-bootstrap-icons';
import { useFavoritesStore } from '../store/FavoritesStore';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const { photos, posts, removePhotoFromFavorites, removePostFromFavorites } = useFavoritesStore();

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5 display-4 fw-bold">Favoriler</h1>

      <section className="mb-5">
        <h2 className="mb-4"><Image className="me-2" /> Favori Fotoğraflar</h2>
        {photos.length === 0 ? (
          <p className="text-white-50">Henüz favori fotoğrafınız yok.</p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {photos.map((photo) => (
              <Col key={photo.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={photo.thumbnailUrl} alt={photo.title} />
                  <Card.Body className="d-flex flex-column">
                    <Card.Text className="flex-grow-1">
                      {photo.title}
                    </Card.Text>
                    <Button variant="danger" size="sm" onClick={() => removePhotoFromFavorites(photo.id)}>
                      <Trash className="me-1" /> Kaldır
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section>
        <h2 className="mb-4"><FileEarmarkText className="me-2" /> Favori Gönderiler</h2>
        {posts.length === 0 ? (
          <p className="text-white-50">Henüz favori gönderiniz yok.</p>
        ) : (
          <Row xs={1} md={2} className="g-4">
            {posts.map((post) => (
               <Col key={post.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h5">{post.title}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {post.body.substring(0, 100)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <Link to={`/users/${post.userId}/posts/${post.id}`} className="btn btn-primary btn-sm">
                        Yazıya Git
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => removePostFromFavorites(post.id)}>
                         <Trash className="me-2"/> Kaldır
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
               </Col>
            ))}
          </Row>
        )}
      </section>
    </Container>
  );
};

export default FavoritesPage;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Collection, PersonCircle, Heart, HeartFill, Image as ImageIcon } from 'react-bootstrap-icons';
import { useFavoritesStore, type FavoritePhoto } from '../store/FavoritesStore';

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface User {
  id: number;
  name: string;
  username: string;
}

const FavoriteButton = ({ photo, userId }: { photo: Photo; userId: number }) => {
  const { photos: favoritePhotos, addPhotoToFavorites, removePhotoFromFavorites } = useFavoritesStore();
  const isFavorite = favoritePhotos.some(p => p.id === photo.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favoritePhoto: FavoritePhoto = {
      userId: userId,
      albumId: photo.albumId,
      id: photo.id,
      title: photo.title,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl
    };

    if (isFavorite) {
      removePhotoFromFavorites(photo.id);
    } else {
      addPhotoToFavorites(favoritePhoto);
    }
  };

  return (
    <Button 
      variant="link" 
      onClick={handleToggleFavorite} 
      className="p-0 fs-4 position-absolute top-0 end-0 m-2"
      style={{ color: 'var(--accent-danger)' }}
      title={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
    >
      {isFavorite ? <HeartFill /> : <Heart />}
    </Button>
  );
};


const AlbumPage = () => {
  const { userId, albumId } = useParams<{ userId: string; albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);
        const [albumRes, photosRes, userRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`),
          fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`),
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        ]);

        if (!albumRes.ok || !photosRes.ok || !userRes.ok) {
          throw new Error('Veriler yüklenirken bir sorun oluştu.');
        }
        
        const albumData = await albumRes.json();
        const photosData = await photosRes.json();
        const userData = await userRes.json();
        
        setAlbum(albumData);
        setPhotos(photosData);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && albumId) {
      fetchAlbumDetails();
    }
  }, [userId, albumId]);

  const renderLoading = () => (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </Spinner>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!album || !user) return <Alert variant="warning">Albüm detayları bulunamadı.</Alert>;

  return (
    <Container className="my-5">
      <Card className="mb-4 text-center shadow-lg">
        <Card.Header as="h2" className="fw-bold">
          <Collection className="me-2" />
          {album.title}
        </Card.Header>
        <Card.Body>
          <Card.Subtitle className="mb-3">
            <Link to={`/users/${user.id}`} className="text-decoration-none">
              <PersonCircle className="me-2" />
              <strong>{user.name}</strong> (@{user.username})
            </Link>
          </Card.Subtitle>
        </Card.Body>
      </Card>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {photos.map((photo) => {
          return (
            <Col key={photo.id}>
              <Card className="h-100 shadow-sm photo-card">
                <div className="position-relative">
                   <Card.Img 
                      variant="top" 
                      src={photo.thumbnailUrl} 
                      alt={photo.title}
                      style={{ height: '150px', objectFit: 'cover' }}
                      onError={(e) => {
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = "https://via.placeholder.com/150/1e2332/e8eaed?text=Resim+Yok";
                      }}
                    />
                  <FavoriteButton photo={photo} userId={user.id} />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Text className="flex-grow-1">
                    {photo.title}
                  </Card.Text>
                  <Button 
                    variant="outline-primary" 
                    href={photo.url}
                    target="_blank" 
                  >
                    Tam Boyut
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default AlbumPage;
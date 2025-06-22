import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, ListGroup, Nav, Tab, Button, Badge } from 'react-bootstrap';
import { PersonFill, EnvelopeFill, TelephoneFill, Globe, GeoAltFill, BriefcaseFill, JournalAlbum, CheckCircleFill, XCircleFill, FileEarmarkText, Heart, HeartFill } from 'react-bootstrap-icons';
import { useFavoritesStore, type FavoritePost } from '../store/FavoritesStore';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
  };
  company: {
    name: string;
  };
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState({ user: true, posts: true, albums: true, todos: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (url: string, key: keyof typeof loading, setter: (data: any) => void) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${key}`);
        const data = await response.json();
        setter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : `An unknown error occurred while fetching ${key}.`);
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    };

    if (userId) {
      fetchData(`https://jsonplaceholder.typicode.com/users/${userId}`, 'user', setUser);
      fetchData(`https://jsonplaceholder.typicode.com/users/${userId}/posts`, 'posts', setPosts);
      fetchData(`https://jsonplaceholder.typicode.com/users/${userId}/albums`, 'albums', setAlbums);
      fetchData(`https://jsonplaceholder.typicode.com/users/${userId}/todos`, 'todos', setTodos);
    }
  }, [userId]);

  const { addPostToFavorites, removePostFromFavorites, isPostFavorite } = useFavoritesStore();

  const renderLoading = () => (
    <div className="text-center py-5">
      <Spinner animation="border" />
    </div>
  );

  if (loading.user) return renderLoading();
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!user) return <Container className="my-5"><Alert variant="warning">Kullanıcı bulunamadı.</Alert></Container>;

  return (
    <Container className="my-5 fade-in">
      <Row>
        <Col md={4}>
          <Card className="shadow-lg mb-4">
            <Card.Header as="h4" className="text-center fw-bold">
              <PersonFill className="me-2" />
              {user.name}
            </Card.Header>
            <Card.Body>
              <Card.Subtitle className="mb-3 text-center">
                @{user.username}
              </Card.Subtitle>
              <ListGroup variant="flush">
                <ListGroup.Item className="bg-transparent"><EnvelopeFill className="me-2 text-primary" /> {user.email}</ListGroup.Item>
                <ListGroup.Item className="bg-transparent"><TelephoneFill className="me-2 text-primary" /> {user.phone}</ListGroup.Item>
                <ListGroup.Item className="bg-transparent"><Globe className="me-2 text-primary" /> {user.website}</ListGroup.Item>
                <ListGroup.Item className="bg-transparent"><GeoAltFill className="me-2 text-primary" /> {user.address.street}, {user.address.city}</ListGroup.Item>
                <ListGroup.Item className="bg-transparent"><BriefcaseFill className="me-2 text-primary" /> {user.company.name}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Tab.Container id="user-details-tabs" defaultActiveKey="posts">
            <Nav variant="pills" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="posts"><FileEarmarkText className="me-1"/> Gönderiler</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="albums"><JournalAlbum className="me-1"/> Albümler</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="todos"><CheckCircleFill className="me-1"/> Yapılacaklar</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="posts">
                {loading.posts ? renderLoading() : (
                  <ListGroup>
                    {posts.map((post) => {
                      const isFavorite = isPostFavorite(post.id);
                      const handleToggleFavorite = () => {
                        const postToToggle: FavoritePost = { ...post };
                        if (isFavorite) {
                          removePostFromFavorites(post.id);
                        } else {
                          addPostToFavorites(postToToggle);
                        }
                      };
                      return (
                        <ListGroup.Item key={post.id} className="p-3 mb-2 rounded shadow-sm">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1 me-3">
                              <Link to={`/users/${userId}/posts/${post.id}`} className="text-decoration-none text-light">
                                <h5 className="mb-1">{post.title}</h5>
                              </Link>
                              <p className="mb-1" style={{ color: '#bdc1c6' }}>
                                {post.body.substring(0, 100)}...
                              </p>
                            </div>
                            <Button variant="link" onClick={handleToggleFavorite} className="p-0 fs-4 text-danger">
                              {isFavorite ? <HeartFill /> : <Heart />}
                            </Button>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="albums">
                {loading.albums ? renderLoading() : (
                  <ListGroup>
                    {albums.map((album) => (
                      <Link to={`/users/${userId}/albums/${album.id}`} key={album.id} className="text-decoration-none">
                         <ListGroup.Item action className="mb-2 rounded shadow-sm">
                           <JournalAlbum className="me-2" />{album.title}
                         </ListGroup.Item>
                      </Link>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="todos">
                {loading.todos ? renderLoading() : (
                  <ListGroup>
                    {todos.map((todo) => (
                      <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center mb-2 rounded shadow-sm">
                        <span>{todo.title}</span>
                        <Badge bg={todo.completed ? "success" : "warning"} pill>
                          {todo.completed ? <CheckCircleFill className="me-1"/> : <XCircleFill className="me-1"/>}
                          {todo.completed ? "Tamamlandı" : "Bekliyor"}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
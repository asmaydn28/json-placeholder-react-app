import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { PersonCircle, Heart, HeartFill, FileEarmarkText } from 'react-bootstrap-icons';
import { useFavoritesStore, type FavoritePost } from '../store/FavoritesStore';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
}

const PostPage = () => {
  const { userId, postId } = useParams<{ userId: string; postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { posts: favoritePosts, addPostToFavorites, removePostFromFavorites } = useFavoritesStore();
  const isFavorite = favoritePosts.some(p => p.id === Number(postId));

  const handleToggleFavorite = () => {
    if (!post || !user) return;

    const favoritePost: FavoritePost = {
      userId: user.id,
      id: post.id,
      title: post.title,
      body: post.body
    };

    if (isFavorite) {
      removePostFromFavorites(post.id);
    } else {
      addPostToFavorites(favoritePost);
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const [postRes, commentsRes, userRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
          fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`),
          fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        ]);
        
        if (!postRes.ok || !commentsRes.ok || !userRes.ok) {
          throw new Error('Veriler yüklenirken bir sorun oluştu.');
        }

        const postData = await postRes.json();
        const commentsData = await commentsRes.json();
        const userData = await userRes.json();
        
        setPost(postData);
        setComments(commentsData);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && postId) {
      fetchPostDetails();
    }
  }, [userId, postId]);

  const renderLoading = () => (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </Spinner>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post || !user) return <Alert variant="warning">Gönderi detayları bulunamadı.</Alert>;

  return (
    <Container className="my-5 fade-in">
      <Card className="mb-4 shadow-lg">
        <Card.Header as="h2" className="fw-bold">
          <FileEarmarkText className="me-2"/>
          {post.title}
        </Card.Header>
        <Card.Body>
          <Card.Subtitle className="mb-3">
            <Link to={`/users/${user.id}`} className="text-decoration-none">
              <PersonCircle className="me-2"/>
              <strong>{user.name}</strong> (@{user.username})
            </Link>
          </Card.Subtitle>
          <Card.Text className="lead">{post.body}</Card.Text>
        </Card.Body>
      </Card>
      
      <h3 className="mb-3">Yorumlar</h3>
      {comments.map((comment) => (
        <Card key={comment.id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title as="h6" className="fw-bold">{comment.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{comment.email}</Card.Subtitle>
            <Card.Text>{comment.body}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default PostPage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { PersonCircle, Envelope, GeoAlt, Globe } from 'react-bootstrap-icons';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Kullanıcılar yüklenirken bir hata oluştu.');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Bilinmeyen bir hata oluştu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 fade-in">
      <h1 className="text-center mb-5 display-4 fw-bold">Kullanıcılar</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {users.map((user) => (
          <Col key={user.id}>
            <Card className="h-100 shadow-lg user-card">
              <Card.Header as="h5" className="fw-bold d-flex align-items-center">
                <PersonCircle className="me-2" /> {user.username}
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-3">{user.name}</Card.Title>
                <ListGroup variant="flush" className="flex-grow-1">
                  <ListGroup.Item className="bg-transparent ps-3">
                    <Envelope className="me-2" /> {user.email}
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent ps-3">
                    <GeoAlt className="me-2" /> {user.address.city}
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent ps-3">
                    <Globe className="me-2" /> {user.website}
                  </ListGroup.Item>
                </ListGroup>
                <Link to={`users/${user.id}`} className="mt-auto">
                  <Button variant="primary" className="w-100 mt-3">
                    Detayları Gör
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <style type="text/css">
        {`
          .user-card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
          .user-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3) !important;
          }
        `}
      </style>
    </Container>
  );
};

export default HomePage;

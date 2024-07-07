import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DynamicHeader from '@components/Header';
import Footer from '@components/Footer'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchNews } from '../src/api/NewsService';

export default function Home() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews('tesla')
      .then(data => setNews(data.articles))
      .catch(error => setError(error.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!news.length) return <div>Loading...</div>;

  return (
    <Container>
      <Head>
        <title>Personalized News</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicHeader title="Business News" tag="h1" className="main-heading" />
        <Row>
          {news.map((article, index) => 
            article && (
              <Col md={4} key={index} className="mb-4">
                <Card>
                  {article.urlToImage ? (
                    <Card.Img variant="top" src={article.urlToImage} alt={article.title} className="img-fluid object-fit-cover" style={{ height: "300px" }} />
                  ) : (
                    <Card.Img variant="top" src="https://placehold.co/600x400" alt={article.title} className="img-fluid object-fit-cover" style={{ height: "300px" }} />
                  )}
                  
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.author}</Card.Text>
                    <Card.Text>{article.source.name}</Card.Text>
                    <Card.Text>{new Date(article.publishedAt).toLocaleDateString()}</Card.Text>
                    <Card.Text>{article.description}</Card.Text>
                    <Button variant="primary" href={article.url} target="_blank" rel="noopener noreferrer">Read More</Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>
      </main>
      <Footer />
    </Container>
  );
}

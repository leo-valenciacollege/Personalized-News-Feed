import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DynamicHeader from '@components/Header';
import Footer from '@components/Footer'; 
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import fetchNews from '../src/api/NewsService';

export default function Home() {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
    const loadNews = async (page) => {
      setLoading(true);
      try {
        const params = {
          q: 'everything',
          from: '',
          sortBy: '',
          pageSize: 20,
          page: page
        };
        const newsArticles = await fetchNews(params);
        const validArticles = newsArticles
          .filter(article => 
            article.title !== "[Removed]" && 
            article.description !== "[Removed]" &&
            article.urlToImage // Ensure there's an image
          )
          .slice(0, 9); // Limit to 9 articles

        setNews(prevNews => [...prevNews, ...validArticles]);
        setCurrentPage(page);
      } catch (error) {
        setError(error.message);
      } finally{
        setLoading(false);
      }
    };

  useEffect(() => {
    loadNews(1);
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!news || !news.length) return <div>Loading...</div>;

  return (
    <Container>
      <Head>
        <title>Personalized News</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicHeader title="Business News" tag="h1" className="main-heading" />
        {error && <div className="alert alert-danger">{error}</div>}
        <Row>
          {news.map((article, index) => 
            article && (
              <Col md={4} key={index} className="mb-4">
                <Card>
                  <Card.Img 
                    variant="top" 
                    src={article.urlToImage || "https://placehold.co/600x400"} 
                    alt={article.title} 
                    className="img-fluid object-fit-cover" 
                    style={{ height: "300px" }} 
                  />
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
        {!error && (
          <Row className="justify-content-center mt-4 mb-4">
            <Col xs="auto">
              <Button 
                variant="primary" 
                onClick={() => loadNews(currentPage + 1)} 
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </Col>
          </Row>
        )}
      </main>
      <Footer />
    </Container>
  );
}

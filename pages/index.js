import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DynamicHeader from '@components/Header';
import Footer from '@components/Footer'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
          {news.map((article, index) => (
            <Col key={index} className="w-100">
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </Col>
          ))}
        </Row>
      </main>
      <Footer />
    </Container>
  );
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DynamicHeader from '@components/Header';
import Footer from '@components/Footer';
import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import fetchNews from '../src/api/NewsService';
import PersonalizedNews from '../components/PersonalizedNews';
import { trackArticleClick } from '../services/trackingService';

export async function getServerSideProps() {
  try {
    const initialNewsResponse = await fetchNews({
      q: "everything",
      pageSize: 20,
      page: 1
    });
    return {
      props: {
        initialNews: initialNewsResponse.articles,
      }
    }
  } catch (error) {
    console.error('Error in getServerSideProps', error);
    return {
      props: {
        initialNews: [],
        error: error.message
      }
    }
  }
}

const filterArticles = (articles) => {
  if (!Array.isArray(articles)) {
    console.error('Expected articles to be an array, but got:', articles);
    return [];
  }

  if (articles.length === 0) {
    console.log("Received empty articles array");
    return [];
  }

  return articles
    .filter(article =>
      article &&
      article.title &&
      article.title !== "[Removed]" &&
      article.description !== "[Removed]" &&
      article.description &&
      article.urlToImage &&
      article.source
    )
    .slice(0, 9);
};

export default function Home({ initialNews }) {
  const [news, setNews] = useState(filterArticles(initialNews));
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const loadNews = async (page, search = searchTerm, cat = category) => {
    setLoading(true);
    setError(null); //reset error state

    try {
      const params = cat
        ? {
          category: cat,
          pageSize: 20,
          page: page,
        }
        : {
          q: search || 'everything',
          pageSize: 20,
          page: page,
        };

      const response = await fetchNews(params);

      //check if the response has the expected result
      if (!response || !response.articles) {
        throw new Error('Unexpected API response structure');
      }

      console.log("Unfiltered articles:", response.articles);

      const validArticles = filterArticles(response.articles);

      console.log("Filtered articles:", validArticles);

      if (validArticles.length === 0) {
        setError("No articles found for the selected category");
        setNews([]);
      } else {
        if (page === 1) {
          setNews(validArticles);
        } else {
          setNews(prevNews => [...prevNews, ...validArticles]);
        }
      }

      setCurrentPage(page);

    } catch (error) {
      console.log('Error loading news:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialNews.length) {
      loadNews(1);
    }
  }, []);

  useEffect(() => {
    document.querySelectorAll('.article-link').forEach(item => {
        item.addEventListener('click', event => {
            const articleId = item.getAttribute('data-article-id');
            const articleCategory = item.getAttribute('data-article-category');
            const articleTitle = item.getAttribute('data-article-title');
            trackArticleClick(articleId, articleCategory, articleTitle);
        });
    });
}, [news]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadNews(1, searchTerm, category);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    setCurrentPage(1);
    loadNews(1, searchTerm, newCategory);
  };

  if (error) return <div>Error: {error}</div>;
  if (!news || !news.length) return <div>Loading...</div>;

  return (
    <Container>
      <Head>
        <title>Personalized News</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicHeader 
          title="Your Personal Newsstand" 
          tag="h1" 
          className="main-heading" 
        />
        <Form onSubmit={handleSearch} className="mb-4">
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  <option value="business">Business</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="general">General</option>
                  <option value="health">Health</option>
                  <option value="science">Science</option>
                  <option value="sports">Sports</option>
                  <option value="techology">Technology</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button type="submit" variant="primary" className="d-grid">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <PersonalizedNews />
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && news.length === 0 && !loading && (
          <div className="alert alert-info">No news found. Try a different search or category.</div>
        )}
        <Row>
          {news.map((article, index) => (
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
                  <Button 
                      variant="primary" 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="article-link" 
                      data-article-id={article.url} 
                      data-article-category={article.category || 'general'}
                      data-article-title={article.title}
                  >
                      Read More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {!error && news.length > 0 && (
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

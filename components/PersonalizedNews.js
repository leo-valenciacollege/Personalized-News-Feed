import { useEffect, useState } from "react";
import DynamicHeader from "@components/Header";
import { getViewedArticles } from "../services/trackingService";
import { getLocalStorage } from "../services/storageService";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PersonalizedNews = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchPersonalizedNews = async () => {
      const viewedArticles = getViewedArticles();
      const categoryPreferences =
        JSON.parse(getLocalStorage("categoryPreferences")) || {};
      const response = await fetch("/api/getPersonalizedNews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ viewedArticles, categoryPreferences }),
      });
      const data = await response.json();
      setArticles(data.articles);
    };
    fetchPersonalizedNews();
  }, []);

  if (articles.length === 0) {
    return null; // Don't render anything if there are no recommended articles
  }

  return (
    <Alert variant="info">
      <Container className="p-0">
        <Row id="personalized-news">
          <DynamicHeader
            title="Recommended For You"
            tag="h2"
            className="main-heading"
          />
        </Row>
        <Row id="news-container">
          {articles.map((article, index) => (
            <Col md={6} key={index} className="mb-4">
              <Card>
                <Row className="g-0">
                  <Col xs={4}>
                    <Card.Img
                      src={article.urlToImage || "https://placehold.co/600x400"}
                      alt={article.title}
                      className="img-fluid h-100 object-fit-cover"
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Body className="article h-100">
                      <Card.Title>{article.title}</Card.Title>
                      <Button
                        variant="primary"
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-link mt-auto"
                        data-article-id={article.url}
                        data-article-category={article.category || "general"}
                        data-article-title={article.title}
                      >
                        Read More
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Alert>
  );
};

export default PersonalizedNews;
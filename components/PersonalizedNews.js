import { useEffect, useState } from "react";
import DynamicHeader from "@components/Header";
import { getViewedArticles } from "../services/trackingService";
import { getLocalStorage } from "../services/storageService";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
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

  return (
    <Container className="p-0">
      <Row id="personalized-news">
        <DynamicHeader
          title="Recommeneded For You"
          tag="h2"
          className="main-heading"
        />
      </Row>
      <Row id="news-container">
        {articles.map((article, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card>
              <Card.Body className="article">
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.description}</Card.Text>
                <Button
                  variant="primary"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                  data-article-id={article.url}
                  data-article-category={article.category || "general"}
                  data-article-title={article.title}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PersonalizedNews;

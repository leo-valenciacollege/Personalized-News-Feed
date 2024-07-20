import { useEffect, useState } from 'react';
import { getViewedArticles } from '../services/trackingService';

const PersonalizedNews = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchPersonalizedNews = async () => {
            const viewedArticles = getViewedArticles();
            const response = await fetch('/api/getPersonalizedNews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ viewedArticles }),
            });
            const data = await response.json();
            setArticles(data.articles);
        };

        fetchPersonalizedNews();
    }, []);

    return (
        <div id="personalized-news">
            <h2>News for You</h2>
            <div id="news-container">
                {articles.map(article => (
                    <div key={article.id} className="article">
                        <h3>{article.title}</h3>
                        <p>{article.summary}</p>
                        <a href={article.url}>Read more</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalizedNews;

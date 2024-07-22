import fetchNews from '../../src/api/NewsService';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { viewedArticles, categoryPreferences } = req.body;

        // Check if the user has viewed any articles
        if (!viewedArticles || viewedArticles.length === 0) {
            return res.status(200).json({ articles: [] });
        }

        // Get the categories of viewed articles
        const viewedCategories = [...new Set(viewedArticles.map(article => article.category))];

        let personalizedNews = [];

        for (const category of viewedCategories) {
            const newsResponse = await fetchNews({
                category: category,
                pageSize: 5,
                page: 1
            });

            const filteredArticles = newsResponse.articles.filter(article => 
                !viewedArticles.some(viewed => viewed.id === article.url)
            );

            personalizedNews = [...personalizedNews, ...filteredArticles];

            if (personalizedNews.length >= 6) break;
        }

        // If we don't have enough articles, fetch some general news
        if (personalizedNews.length < 6) {
            const generalNews = await fetchNews({
                q: 'general',
                pageSize: 6 - personalizedNews.length,
                page: 1
            });

            personalizedNews = [...personalizedNews, ...generalNews.articles.filter(article => 
                !viewedArticles.some(viewed => viewed.id === article.url)
            )];
        }

        // Limit to 6 articles
        personalizedNews = personalizedNews.slice(0, 6);

        res.status(200).json({ articles: personalizedNews });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
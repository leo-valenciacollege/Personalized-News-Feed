import fetchNews from '../../src/api/NewsService';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { viewedArticles, categoryPreferences } = req.body;

        // Get the top 3 preferred categories
        const topCategories = Object.entries(categoryPreferences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        let personalizedNews = [];

        for (const category of topCategories) {
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

        // If there is not enough articles, fetch some general news
        if (personalizedNews.length < 6) {
            const generalNews = await fetchNews({
                q: 'general',
                pageSize: 9 - personalizedNews.length,
                page: 1
            });

            personalizedNews = [...personalizedNews, ...generalNews.articles.filter(article => 
                !viewedArticles.some(viewed => viewed.id === article.url)
            )];
        }

        res.status(200).json({ articles: personalizedNews.slice(0, 6) });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
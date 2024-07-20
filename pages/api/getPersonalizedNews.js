// pages/api/getPersonalizedNews.js

// Sample data for articles
const articles = [
    [{"id":"https://www.macrumors.com/guide/apple-watch-ultra-3-everything-we-know/","category":null},{"id":"https://www.macrumors.com/guide/apple-watch-ultra-3-everything-we-know/","category":null},{"id":"https://www.macrumors.com/guide/apple-watch-ultra-3-everything-we-know/","category":null},{"id":"https://www.macrumors.com/guide/apple-watch-ultra-3-everything-we-know/","category":null},{"id":"https://apnews.com/article/delta-flight-attendant-palestinian-pin-1f8f4bee3dab6d502446ffa44711acc3","category":null},{"id":"https://apnews.com/article/delta-flight-attendant-palestinian-pin-1f8f4bee3dab6d502446ffa44711acc3","category":null},{"id":"https://apnews.com/article/delta-flight-attendant-palestinian-pin-1f8f4bee3dab6d502446ffa44711acc3","category":null}]
];

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Parse the request body
        const { viewedArticles } = req.body;

        // Simulate fetching personalized news based on viewedArticles
        const personalizedNews = articles.filter(article => 
            viewedArticles.some(viewed => viewed.id === article.id)
        );

        // Respond with the personalized news
        res.status(200).json({ articles: personalizedNews });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

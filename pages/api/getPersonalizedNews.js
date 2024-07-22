import fetchNews from "../../src/api/NewsService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { viewedArticles, categoryPreferences } = req.body;

    // Check if the user has viewed any articles
    if (!viewedArticles || viewedArticles.length === 0) {
      return res.status(200).json({ articles: [] });
    }

    // Get the categories of viewed articles
    const viewedCategories = [
      ...new Set(viewedArticles.map((article) => article.category)),
    ];

    let personalizedNews = [];

    for (const category of viewedCategories) {
      const newsResponse = await fetchNews({
        category: category,
        pageSize: 5,
        page: 1,
      });

      const filteredArticles = newsResponse.articles
        .filter(
          (article) =>
            !viewedArticles.some((viewed) => viewed.id === article.url)
        )
        .map((article) => ({
          ...article,
          category: category, // Assign the correct category
        }));

      personalizedNews = [...personalizedNews, ...filteredArticles];

      if (personalizedNews.length >= 4) break;
    }

    // If not enough articles, fetch some general news
    if (personalizedNews.length < 4) {
      const generalNews = await fetchNews({
        q: "general",
        pageSize: 4 - personalizedNews.length,
        page: 1,
      });

      const filteredGeneralNews = generalNews.articles
        .filter(
          (article) =>
            !viewedArticles.some((viewed) => viewed.id === article.url)
        )
        .map((article) => ({
          ...article,
          category: "general", // Assign 'general' category
        }));

      personalizedNews = [...personalizedNews, ...filteredGeneralNews];
    }

    // Limit to 4 articles
    personalizedNews = personalizedNews.slice(0, 4);

    res.status(200).json({ articles: personalizedNews });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

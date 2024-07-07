const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

if (!API_KEY) {
  throw new Error('News API key is missing');
}

async function fetchNews(params) {
  const queryParams = new URLSearchParams({
    ...params,
    apiKey: API_KEY,
  }).toString();
  const url = `https://newsapi.org/v2/everything?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export default fetchNews;
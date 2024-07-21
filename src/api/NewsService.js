const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

if (!API_KEY) {
  throw new Error('News API key is missing');
}

async function fetchNews(params) {
  const { q, category, ...otherParams } = params;
  let url;
  let queryParams;
  
  if (category && category !== '') {
    url = 'https://newsapi.org/v2/top-headlines';
    queryParams = new URLSearchParams({
      category,
      country: 'us', // Add this line
      ...otherParams,
      apiKey: API_KEY,
    });
  } else {
    url = 'https://newsapi.org/v2/everything';
    queryParams = new URLSearchParams({
      q: q || 'everything',
      ...otherParams,
      apiKey: API_KEY,
    });
  }

  const fullUrl = `${url}?${queryParams.toString()}`;

  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    console.log('API Response:', data);

    //check if the response has the expected result
    if(!data || !data.articles){
      throw new Error('Unexpected API response structure');
    }

    return data;

  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export default fetchNews;
const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

if (!API_KEY) {
  throw new Error('News API key is missing');
}

async function fetchNews(params) {
  const queryParams = new URLSearchParams({
    ...params,
    apiKey: API_KEY,
  }).toString();
  
  let url;
  if (params.category && params.category !== '') {
    url = `https://newsapi.org/v2/top-headlines?${queryParams}`;
  } else {
    url = `https://newsapi.org/v2/everything?${queryParams}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();

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
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

if (!API_KEY) {
  throw new Error('News API key is missing');
}

export const fetchNews = async (query) => {
  const url = `${BASE_URL}/top-headlines?country=us&category=business&apiKey=${API_KEY}`
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export const fetchNews = async (query) => {
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=`
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

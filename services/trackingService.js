import { setLocalStorage, getLocalStorage } from './storageService';

export const trackArticleClick = (articleId, articleCategory) => {
    let viewedArticles = JSON.parse(getLocalStorage('viewedArticles')) || [];
    viewedArticles.push({ id: articleId, category: articleCategory });
    setLocalStorage('viewedArticles', JSON.stringify(viewedArticles));
};

export const getViewedArticles = () => {
    const viewedArticles = getLocalStorage('viewedArticles');
    if (!viewedArticles) return []; 
    return JSON.parse(viewedArticles);
};

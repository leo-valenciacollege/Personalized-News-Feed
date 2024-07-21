import { setLocalStorage, getLocalStorage } from './storageService';

export const trackArticleClick = (articleId, articleCategory, articleTitle) => {
    let viewedArticles = JSON.parse(getLocalStorage('viewedArticles')) || [];
    let categoryPreferences = JSON.parse(getLocalStorage('categoryPreferences')) || {};

    // Add the article to viewed articles if not already present
    if (!viewedArticles.some(article => article.id === articleId)) {
        viewedArticles.push({ id: articleId, category: articleCategory, title: articleTitle });
        setLocalStorage('viewedArticles', JSON.stringify(viewedArticles));
    }

    // Update category preferences
    categoryPreferences[articleCategory] = (categoryPreferences[articleCategory] || 0) + 1;
    setLocalStorage('categoryPreferences', JSON.stringify(categoryPreferences));
};

export const getViewedArticles = () => {
    const viewedArticles = getLocalStorage('viewedArticles');
    if (!viewedArticles) return []; 
    return JSON.parse(viewedArticles);
};

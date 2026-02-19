import { Favorite } from '../models/favorite.model.js';

const favorites = [];

export const addFavorite = (favorite) => {
    favorites.push(favorite);
    saveToLocalStorage();
};

export const getFavorites = () => favorites;

const saveToLocalStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

export const loadFavorites = () => {
    const data = localStorage.getItem('favorites');
    if (!data) return;

    const parsed = JSON.parse(data);

    parsed.forEach(fav => {
        favorites.push(
            new Favorite(fav.name, fav.country, fav.latitude, fav.longitude)
        );
    });
};

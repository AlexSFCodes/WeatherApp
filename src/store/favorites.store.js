import { Favorite } from '../models/favorites.model';

const favorites = [];


export const addFavorite = (favorite) => {
    if (favorites.length >= 3) {
        favorites.shift(); // Saca el más antiguo
    }
    favorites.push(favorite); // Agrega el nuevo
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

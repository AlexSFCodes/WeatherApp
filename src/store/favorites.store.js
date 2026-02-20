import { Favorite } from '../models/favorite.model.js';
import { STORAGE_KEYS, APP_CONFIG } from '../config/api.config.js';

const favorites = [];

// Obtener todos los favoritos
export const getFavorites = () => favorites;

// Agregar un favorito
export const addFavorite = (favorite) => {
    // Verificar si ya existe
    const exists = favorites.some(
        fav => fav.latitude === favorite.latitude && fav.longitude === favorite.longitude
    );
    
    if (exists) {
        return false;
    }
    
    // Si alcanzamos el límite, eliminar el más antiguo
    if (favorites.length >= APP_CONFIG.maxFavorites) {
        const removed = favorites.shift();
        removed.stopAutoUpdate();
    }
    
    favorites.push(favorite);
    saveToLocalStorage();
    return true;
};

// Eliminar un favorito por índice
export const removeFavorite = (index) => {
    if (index >= 0 && index < favorites.length) {
        const removed = favorites.splice(index, 1)[0];
        removed.stopAutoUpdate();
        saveToLocalStorage();
        return true;
    }
    return false;
};

// Guardar en localStorage
const saveToLocalStorage = () => {
    const toSave = favorites.map(fav => ({
        name: fav.name,
        country: fav.country,
        latitude: fav.latitude,
        longitude: fav.longitude,
        currently_temp: fav.currently_temp,
        lastUpdate: fav.lastUpdate
    }));
    
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(toSave));
};

// Cargar desde localStorage
export const loadFavorites = () => {
    const data = localStorage.getItem(STORAGE_KEYS.favorites);
    if (!data) return;

    try {
        const parsed = JSON.parse(data);

        parsed.forEach(fav => {
            const favorite = new Favorite(
                fav.name, 
                fav.country, 
                fav.latitude, 
                fav.longitude
            );
            
            // Restaurar temperatura si existe
            if (fav.currently_temp !== null) {
                favorite.currently_temp = fav.currently_temp;
                favorite.lastUpdate = fav.lastUpdate ? new Date(fav.lastUpdate) : null;
            }
            
            favorites.push(favorite);
        });
    } catch (error) {
        console.error('Error al cargar favoritos:', error);
    }
};

// Limpiar todos los favoritos
export const clearFavorites = () => {
    favorites.forEach(fav => fav.stopAutoUpdate());
    favorites.length = 0;
    localStorage.removeItem(STORAGE_KEYS.favorites);
};
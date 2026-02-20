// Configuración centralizada de APIs
export const API_CONFIG = {
    geocoding: {
        baseUrl: 'https://geocoding-api.open-meteo.com/v1',
        endpoints: {
            search: '/search'
        }
    },
    weather: {
        baseUrl: 'https://api.open-meteo.com/v1',
        endpoints: {
            forecast: '/forecast'
        }
    }
};

export const STORAGE_KEYS = {
    favorites: 'weather_favorites'
};

export const APP_CONFIG = {
    maxFavorites: 3,
    updateIntervalMinutes: 10
};
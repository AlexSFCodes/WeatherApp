import { weatherService } from './services/weather.service.js';
import { getFavorites, addFavorite, loadFavorites } from './store/favorites.store.js';
import { Favorite } from './models/favorite.model.js';
import { renderWeatherResult, showLoading, showError } from './ui/weather.ui.js';
import { renderFavoritesList } from './ui/favorites.ui.js';
import { APP_CONFIG } from './config/api.config.js';

export class WeatherApp {
    constructor() {
        this.elements = {
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            weatherResult: document.getElementById('weatherResult'),
            favoritesContainer: document.getElementById('favorites')
        };
    }

    // Inicializar la aplicación
    init() {
        this.loadData();
        this.attachEventListeners();
        this.startAutoUpdates();
    }

    // Cargar datos iniciales
    loadData() {
        loadFavorites();
        this.renderFavorites();
    }

    // Agregar event listeners
    attachEventListeners() {
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    }

    // Manejar búsqueda de clima
    async handleSearch() {
        const city = this.elements.cityInput.value.trim();
        
        if (!city) {
            showError(this.elements.weatherResult, 'Por favor ingresa una ciudad');
            return;
        }
        
        showLoading(this.elements.weatherResult);
        
        try {
            const weatherData = await weatherService.getWeatherByCity(city);
            
            renderWeatherResult(this.elements.weatherResult, weatherData);
            this.saveFavorite(weatherData);
            this.renderFavorites();
            
        } catch (error) {
            showError(this.elements.weatherResult, 'Error al obtener el clima');
            console.error('Error:', error);
        }
    }

    // Guardar ciudad como favorita
    saveFavorite(weatherData) {
        const favorite = new Favorite(
            weatherData.name,
            weatherData.country,
            weatherData.latitude,
            weatherData.longitude
        );
        
        const added = addFavorite(favorite);
        
        if (added) {
            favorite.startAutoUpdate(APP_CONFIG.updateIntervalMinutes);
        }
    }

    // Renderizar lista de favoritos
    renderFavorites() {
        const favorites = getFavorites();
        renderFavoritesList(
            this.elements.favoritesContainer, 
            favorites,
            (cityName) => this.quickSearch(cityName)
        );
    }

    // Búsqueda rápida desde favoritos
    quickSearch(cityName) {
        this.elements.cityInput.value = cityName;
        this.handleSearch();
    }

    // Iniciar actualizaciones automáticas
    startAutoUpdates() {
        const favorites = getFavorites();
        
        favorites.forEach(fav => {
            fav.startAutoUpdate(APP_CONFIG.updateIntervalMinutes);
        });
        
        // Re-renderizar periódicamente
        setInterval(() => {
            this.renderFavorites();
        }, APP_CONFIG.updateIntervalMinutes * 60 * 1000);
    }
}
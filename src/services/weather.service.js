import { API_CONFIG } from '../config/api.config.js';

export const weatherService = {
    // Obtener coordenadas de una ciudad
    async getCityCoordinates(cityName) {
        const url = `${API_CONFIG.geocoding.baseUrl}${API_CONFIG.geocoding.endpoints.search}?name=${cityName}&count=1&language=es`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('Ciudad no encontrada');
        }
        
        return data.results[0];
    },

    // Obtener clima actual por coordenadas
    async getCurrentWeather(latitude, longitude) {
        const url = `${API_CONFIG.weather.baseUrl}${API_CONFIG.weather.endpoints.forecast}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return {
            temperature: data.current_weather.temperature,
            windSpeed: data.current_weather.windspeed,
            weatherCode: data.current_weather.weathercode
        };
    },

    // Obtener clima completo de una ciudad (combina los dos métodos anteriores)
    async getWeatherByCity(cityName) {
        const location = await this.getCityCoordinates(cityName);
        const weather = await this.getCurrentWeather(location.latitude, location.longitude);
        
        return {
            ...location,
            ...weather
        };
    }
};
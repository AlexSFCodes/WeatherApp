import './style.css';
import { getFavorites, addFavorite, loadFavorites } from './store/favorites.store.js';
import { Favorite } from './models/favorites.model.js'; // ⚠️ Asegúrate que el archivo se llame así
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const favoritesContainer = document.getElementById('favorites');

async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        weatherResult.innerHTML = '<p class="error">Por favor ingresa una ciudad</p>';
        return;
    }
    
    weatherResult.innerHTML = '<p class="loading">Cargando...</p>';
    
    try {
        // First Step: Getting coords
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=es`
        );
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            weatherResult.innerHTML = '<p class="error">Ciudad no encontrada</p>';
            return;
        }
        
        const { latitude, longitude, name, country } = geoData.results[0];
        
        // Second step: Get the weather
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        
        const temp = weatherData.current_weather.temperature;
        const windSpeed = weatherData.current_weather.windspeed;
        
        // Mostrar resultado
        weatherResult.innerHTML = `
            <div class="weather-card">
                <h2>${name}, ${country}</h2>
                <div class="temp">${temp}°C</div>
                <p>Viento: ${windSpeed} km/h</p>
            </div>
        `;
        
        // Guardar como favorito/frecuente
        const favoritoadd = new Favorite(name, country, latitude, longitude);
        addFavorite(favoritoadd);
        
        // 🔥 CRÍTICO: Actualizar la UI de favoritos
        renderFavorites();
        
    } catch (error) {
        weatherResult.innerHTML = '<p class="error">Error al obtener el clima</p>';
        console.error('Error:', error);
    }
}

function renderFavorites() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="info">No tienes actividad frecuente aún. Busca una ciudad</p>';
        return;
    }
    
    favoritesContainer.innerHTML = `
        <h3>⏱️ Actividad reciente</h3>
        <div class="favorites-list">
            ${favorites.map((fav, index) => `
                <div class="favorite-item">
                    <div class="favorite-info">
                        <span class="favorite-name">${fav.name}, ${fav.country}</span>
                        <span class="favorite-coords">${fav.latitude.toFixed(2)}, ${fav.longitude.toFixed(2)}</span>
                        ${fav.currently_temp !== null ? 
                            `<span class="favorite-temp">🌡️ ${fav.currently_temp.toFixed(1)}°C</span>` 
                            : ''
                        }
                    </div>
                    <button class="quick-search" data-name="${fav.name}">
                        Ver clima
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Event listeners para búsqueda rápida
    document.querySelectorAll('.quick-search').forEach(btn => {
        btn.addEventListener('click', (e) => {
            cityInput.value = e.target.dataset.name;
            getWeather();
        });
    });
}

// 🔥 IMPORTANTE: Cargar favoritos al iniciar
function init() {
    loadFavorites(); // Cargar desde localStorage
    renderFavorites(); // Renderizar en la UI
    
    // 🔄 Iniciar actualización automática de temperaturas
    startTemperatureUpdates();
}

// Función para iniciar actualizaciones automáticas
function startTemperatureUpdates() {
    const favorites = getFavorites();
    
    favorites.forEach(fav => {
        if (fav.startAutoUpdate) {
            fav.startAutoUpdate(10); // Actualizar cada 10 minutos
        }
    });
    
    // Re-renderizar cada vez que se actualizan las temperaturas
    setInterval(() => {
        renderFavorites();
    }, 10 * 60 * 1000); // Cada 10 minutos
}

// Event listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// 🚀 Iniciar la aplicación
init();
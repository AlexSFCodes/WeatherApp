// Renderizar resultado del clima
export const renderWeatherResult = (container, weatherData) => {
    container.innerHTML = `
        <div class="weather-card">
            <h2>${weatherData.name}, ${weatherData.country}</h2>
            <div class="temp">${weatherData.temperature}°C</div>
            <p>Viento: ${weatherData.windSpeed} km/h</p>
        </div>
    `;
};

// Mostrar mensaje de carga
export const showLoading = (container) => {
    container.innerHTML = '<p class="loading">Cargando...</p>';
};

// Mostrar mensaje de error
export const showError = (container, message) => {
    container.innerHTML = `<p class="error">${message}</p>`;
};
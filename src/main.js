import './style.css'

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');

async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        weatherResult.innerHTML = '<p class="error"> Por favor ingresa una ciudad</p>';
        return;
    }
    
    weatherResult.innerHTML = '<p class="loading">Cargando...</p>';
    
    try {
        // First Step: Getting cords
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=es`);
        const geoData = await geoRes.json();
        console.log(geoRes);
        console.log(geoData);
        if (!geoData.results || geoData.results.length === 0) {
            weatherResult.innerHTML = '<p class="error"> Ciudad no encontrada</p>';
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
                <h2> ${name}, ${country}</h2>
                <div class="temp"> ${temp}°C</div>
                <p> Viento: ${windSpeed} km/h</p>
            </div>
        `;
        
    } catch (error) {
        weatherResult.innerHTML = '<p class="error"> Error al obtener el clima</p>';
        console.error('Error:', error);
    }
}

// Event listeners
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});
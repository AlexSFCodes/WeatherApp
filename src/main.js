import './style.css';
import { WeatherApp } from './app.js';

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();
    app.init();
});
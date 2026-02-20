import { weatherService } from '../services/weather.service.js';

export class Favorite {
    constructor(name, country, latitude, longitude) {
        this.name = name;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.currently_temp = null;
        this.lastUpdate = null;
        this.intervalId = null;
    }

    // Actualizar temperatura usando el servicio
    async updateTemperature() {
        try {
            const weather = await weatherService.getCurrentWeather(
                this.latitude, 
                this.longitude
            );
            
            this.currently_temp = weather.temperature;
            this.lastUpdate = new Date();
            
            return this.currently_temp;
        } catch (error) {
            console.error('Error al actualizar temperatura:', error);
            return null;
        }
    }

    // Iniciar actualizaciones automáticas
    startAutoUpdate(intervalMinutes = 10) {
        // Actualizar inmediatamente
        this.updateTemperature();
        
        // Convertir minutos a milisegundos
        const intervalMs = intervalMinutes * 60 * 1000;
        
        // Programar actualizaciones periódicas
        this.intervalId = setInterval(() => {
            this.updateTemperature();
        }, intervalMs);
    }

    // Detener actualizaciones automáticas
    stopAutoUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
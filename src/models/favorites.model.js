export class Favorite {
    constructor(name, country, latitude, longitude) {
        this.name = name;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.currently_temp = null; // Temperatura actual
        this.lastUpdate = null; // Última vez que se actualizó
    }

    
    async updateTemperature() {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&appid=TU_API_KEY&units=metric`
            );
            const data = await response.json();
            
            this.currently_temp = data.main.temp;
            this.lastUpdate = new Date();
            
            return this.currently_temp;
        } catch (error) {
            console.error('Error al actualizar temperatura:', error);
            return null;
        }
    }

    startAutoUpdate(intervalMinutes = 10) {
        this.updateTemperature();
        
        const intervalMs = intervalMinutes * 60 * 1000; 
        this.intervalId = setInterval(() => {
            this.updateTemperature();
        }, intervalMs);
    }

    stopAutoUpdate() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
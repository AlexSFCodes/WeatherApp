// Renderizar lista de favoritos
export const renderFavoritesList = (container, favorites, onQuickSearch) => {
    if (favorites.length === 0) {
        container.innerHTML = '<p class="info">No tienes actividad frecuente aún. Busca una ciudad</p>';
        return;
    }
    
    container.innerHTML = `
        <h3>Actividad reciente</h3>
        <div class="favorites-list">
            ${favorites.map((fav, index) => createFavoriteItem(fav, index)).join('')}
        </div>
    `;
    
    // Agregar event listeners
    attachFavoriteListeners(container, onQuickSearch);
};

// Crear HTML de un item de favorito
const createFavoriteItem = (fav, index) => {
    const tempDisplay = fav.currently_temp !== null 
        ? `<span class="favorite-temp">${fav.currently_temp.toFixed(1)}°C</span>` 
        : '';
    
    return `
        <div class="favorite-item">
            <div class="favorite-info">
                <span class="favorite-name">${fav.name}, ${fav.country}</span>
                <span class="favorite-coords">${fav.latitude.toFixed(2)}, ${fav.longitude.toFixed(2)}</span>
                ${tempDisplay}
            </div>
            <button class="quick-search" data-name="${fav.name}">
                Ver clima
            </button>
        </div>
    `;
};

// Agregar event listeners a los botones de favoritos
const attachFavoriteListeners = (container, onQuickSearch) => {
    container.querySelectorAll('.quick-search').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cityName = e.target.dataset.name;
            onQuickSearch(cityName);
        });
    });
};
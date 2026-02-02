/**
 * Dynamic Component Loader for Static Sites
 * Loads header.html and footer.html into placeholder divs
 */

async function loadComponent(elementId, filePath) {
    try {
        const element = document.getElementById(elementId);
        if (!element) return; // Skip if element not found on page

        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        
        const html = await response.text();
        element.innerHTML = html;
        
        // After loading Header, update Cart Badge if Cart exists
        if (elementId === 'global-header' && window.Cart) {
            window.Cart.updateHeaderCount();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('global-header', 'header.html');
    loadComponent('global-footer', 'footer.html');
});

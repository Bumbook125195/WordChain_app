document.addEventListener('DOMContentLoaded', () => {
    
    const menuToggleButton = document.getElementById('menu-toggle'); 
    const sideMenu = document.getElementById('side-menu');         
    const closeMenuButton = document.getElementById('menu-toggle-slideout'); 

    
    function toggleMenu() {
        
        
        sideMenu.classList.toggle('is-active');

        
        const currentExpanded = menuToggleButton.getAttribute('aria-expanded');
        menuToggleButton.setAttribute('aria-expanded', currentExpanded === 'true' ? 'false' : 'true');
    }

    
    if (menuToggleButton) { 
        menuToggleButton.addEventListener('click', toggleMenu);
    }

    
    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', toggleMenu);
    }
});
let mouseX = 0;
let mouseY = 0;

// Rastreia a posição física do mouse na tela
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Escuta a tecla 9
window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return; 
    }

    if (e.key === '9') {
        console.log("Tecla 9 apertada! Posição:", mouseX, mouseY);
        // Avisa o sistema central para clicar nessas coordenadas
        chrome.runtime.sendMessage({ 
            acao: "alternar_clicker", 
            x: Math.round(mouseX), 
            y: Math.round(mouseY) 
        });
    }
});

console.log("🚀 Monitor do Auto-Clicker Ultra injetado com permissões totais!");

let clicando = false;
let intervaloId = null;
let targetTabId = null;
let clickX = 0;
let clickY = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.acao === "alternar_clicker") {
        clicando = !clicando;
        targetTabId = sender.tab.id;

        if (clicando) {
            // Salva as coordenadas do primeiro clique fixas para o loop funcionar
            clickX = request.x;
            clickY = request.y;
            
            console.log(`Ativando clique de hardware em: X=${clickX}, Y=${clickY}`);
            
            chrome.debugger.attach({ tabId: targetTabId }, "1.3", () => {
                if (chrome.runtime.lastError) {
                    console.error("Erro ao conectar debugger:", chrome.runtime.lastError.message);
                    clicando = false;
                    return;
                }

                intervaloId = setInterval(() => {
                    // 1. Move o mouse nativo para a posição correta (Ativa o foco da API)
                    chrome.debugger.sendCommand({ tabId: targetTabId }, "Input.dispatchMouseEvent", {
                        type: "mouseMoved",
                        x: clickX,
                        y: clickY,
                        button: "none",
                        clickCount: 0
                    });

                    // 2. Pressiona o botão esquerdo do mouse
                    chrome.debugger.sendCommand({ tabId: targetTabId }, "Input.dispatchMouseEvent", {
                        type: "mousePressed",
                        x: clickX,
                        y: clickY,
                        button: "left",
                        clickCount: 1
                    });

                    // 3. Solta o botão esquerdo do mouse imediatamente
                    chrome.debugger.sendCommand({ tabId: targetTabId }, "Input.dispatchMouseEvent", {
                        type: "mouseReleased",
                        x: clickX,
                        y: clickY,
                        button: "left",
                        clickCount: 1
                    });
                }, 100); // Executa a cada 100ms
            });
        } else {
            console.log("Desativando clique de hardware...");
            clearInterval(intervaloId);
            // Verifica se o debugger ainda está ativo antes de desconectar para evitar erros no console
            chrome.debugger.detach({ tabId: targetTabId }, () => {
                if (chrome.runtime.lastError) { /* ignora erro de já desconectado */ }
            });
        }
    }
});

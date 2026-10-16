let clicando = false;
let intervaloId = null;
let targetTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.acao === "alternar_clicker") {
        clicando = !clicando;
        targetTabId = sender.tab.id;

        if (clicando) {
            console.log("Ativando clique de hardware...");
            
            // Conecta o sistema de depuração na aba atual para ganhar controle do mouse físico
            chrome.debugger.attach({ tabId: targetTabId }, "1.3", () => {
                if (chrome.runtime.lastError) {
                    clicando = false;
                    return;
                }

                // Inicia o loop de cliques reais com comandos Input.dispatchMouseEvent
                intervaloId = setInterval(() => {
                    // 1. Pressiona o botão do mouse
                    chrome.debugger.sendCommand({ tabId: targetTabId }, "Input.dispatchMouseEvent", {
                        type: "mousePressed",
                        x: request.x,
                        y: request.y,
                        button: "left",
                        clickCount: 1
                    });

                    // 2. Solta o botão do mouse imediatamente
                    chrome.debugger.sendCommand({ tabId: targetTabId }, "Input.dispatchMouseEvent", {
                        type: "mouseReleased",
                        x: request.x,
                        y: request.y,
                        button: "left",
                        clickCount: 1
                    });
                }, 100); // 100ms = 10 cliques por segundo
            });
        } else {
            console.log("Desativando clique de hardware...");
            clearInterval(intervaloId);
            chrome.debugger.detach({ tabId: targetTabId });
        }
    }
});

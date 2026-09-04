// Módulo de Renderização Gráfica (SVG) com tratamento de erros
const svgCanvas = document.getElementById('gameCanvas');

function render() {
    try {
        if (!svgCanvas) {
            console.error("Elemento gameCanvas não encontrado no HTML.");
            return;
        }

        svgCanvas.innerHTML = '';
        svgCanvas.setAttribute("width", gridWidth * tileSize);
        svgCanvas.setAttribute("height", gridHeight * tileSize);

        // 1. Desenha o fundo do grid
        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", x * tileSize);
                rect.setAttribute("y", y * tileSize);
                rect.setAttribute("width", tileSize);
                rect.setAttribute("height", tileSize);
                rect.setAttribute("fill", "#1e1e1e");
                rect.setAttribute("stroke", "#2a2a2a");
                svgCanvas.appendChild(rect);
            }
        }

        // 2. Desenha as paredes
        walls.forEach(wall => {
            let wallRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            wallRect.setAttribute("x", wall.x * tileSize + 2);
            wallRect.setAttribute("y", wall.y * tileSize + 2);
            wallRect.setAttribute("width", tileSize - 4);
            wallRect.setAttribute("height", tileSize - 4);
            wallRect.setAttribute("fill", "#7f8c8d");
            svgCanvas.appendChild(wallRect);
        });

        // 3. Desenha as caixas destrutíveis
        boxes.forEach(box => {
            let boxRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            boxRect.setAttribute("x", box.x * tileSize + 8);
            boxRect.setAttribute("y", box.y * tileSize + 8);
            boxRect.setAttribute("width", tileSize - 16);
            boxRect.setAttribute("height", tileSize - 16);
            boxRect.setAttribute("fill", "#d35400");
            svgCanvas.appendChild(boxRect);
        });

        // 4. Desenha a porta de saída
        let doorRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        doorRect.setAttribute("x", door.x * tileSize + 5);
        doorRect.setAttribute("y", door.y * tileSize + 5);
        doorRect.setAttribute("width", tileSize - 10);
        doorRect.setAttribute("height", tileSize - 10);
        doorRect.setAttribute("fill", "#e67e22");
        svgCanvas.appendChild(doorRect);

        // 5. Desenha o jogador e o indicador de direção
        let px = player.x * tileSize + tileSize / 2;
        let py = player.y * tileSize + tileSize / 2;

        let hood = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let pathData = `M ${px - 12} ${py + 12} Q ${px} ${py - 18} ${px + 12} ${py + 12} Z`;
        hood.setAttribute("d", pathData);
        hood.setAttribute("fill", "#3498db");
        svgCanvas.appendChild(hood);

        let pointer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        let vec = getDirectionVector(player.dir);
        pointer.setAttribute("cx", px + vec.dx * 10);
        pointer.setAttribute("cy", py + vec.dy * 10);
        pointer.setAttribute("r", 4);
        pointer.setAttribute("fill", "#ffffff");
        svgCanvas.appendChild(pointer);

    } catch (erro) {
        alert("Erro no módulo render.js: " + erro.message);
        console.error("Erro detalhado no render:", erro);
    }
}
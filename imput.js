// Módulo de Entrada de Teclado e Menus Hierárquicos
let gameState = 'NORMAL'; 
let menuPrincipalOptions = ['Status', 'Inventário', 'Equipamento'];
let menuStatusOptions = ['Classe', 'Potência', 'Coordenação', 'Mente', 'HP', 'Estamina', 'Mana', 'Ouro'];
let menuEquipamentoOptions = ['Cabeça', 'Pescoço', 'Anel 1', 'Anel 2', 'Tronco', 'Sobre o Corpo', 'Cintura', 'Pernas', 'Pés', 'Arma Corpo a Corpo', 'Arma à Distância', 'Escudo'];
let currentMenuIndex = 0;

const announcer = document.getElementById('screenReaderAnnouncer');

function anunciar(mensagem) {
    announcer.textContent = "";
    setTimeout(() => {
        announcer.textContent = mensagem;
    }, 50);
}

function obterDetalheStatus(opcao) {
    let attr = player.attributes;
    let s = player.stats;
    let classeInfo = classesDoJogo[player.classeAtiva];

    switch (opcao) {
        case 'Classe': return `Classe: ${classeInfo.nome}. Foco em ${classeInfo.foco}.`;
        case 'Potência': return `Potência: ${attr.potencia}. Influencia HP, dano físico, estamina e carga.`;
        case 'Coordenação': return `Coordenação: ${attr.coordenacao}. Influencia esquiva, dano à distância e furtividade.`;
        case 'Mente': return `Mente: ${attr.mente}. Influencia mana, magias e leitura de tomos.`;
        case 'HP': return `HP: ${s.hpAtual} de ${s.hpMax}.`;
        case 'Estamina': return `Estamina: ${s.estAtual} de ${s.estMax}.`;
        case 'Mana': return `Mana: ${s.manaAtual} de ${s.manaMax}.`;
        case 'Ouro': return `Ouro: ${s.ouro} moedas. Moeda padrão do jogo.`;
        default: return opcao;
    }
}

function obterDetalheEquipamento(opcao) {
    let eq = player.equipment;
    let item = null;

    switch (opcao) {
        case 'Cabeça': item = eq.cabeca; break;
        case 'Pescoço': item = eq.pescoco; break;
        case 'Anel 1': item = eq.anel1; break;
        case 'Anel 2': item = eq.anel2; break;
        case 'Tronco': item = eq.tronco; break;
        case 'Sobre o Corpo': item = eq.sobreCorpo; break;
        case 'Cintura': item = eq.cintura; break;
        case 'Pernas': item = eq.pernas; break;
        case 'Pés': item = eq.pes; break;
        case 'Arma Corpo a Corpo': item = eq.armaMelee; break;
        case 'Arma à Distância': item = eq.armaRanged; break;
        case 'Escudo': item = eq.escudo; break;
    }

    let nomeItem = item ? `${item.nome} (Alcance: ${item.alcance || 1})` : 'Vazio';
    return `${opcao}: ${nomeItem}`;
}

function alternarInstanciaArma() {
    if (player.instanciaAtiva === 'MELEE') {
        player.instanciaAtiva = 'RANGED';
        let nomeRanged = player.equipment.armaRanged ? `${player.equipment.armaRanged.nome} (Alcance ${player.equipment.armaRanged.alcance})` : 'Nenhuma';
        anunciar(`Instância alterada para arma à distância. Equipado com: ${nomeRanged}.`);
    } else {
        player.instanciaAtiva = 'MELEE';
        let nomeMelee = player.equipment.armaMelee ? `${player.equipment.armaMelee.nome} (Alcance ${player.equipment.armaMelee.alcance})` : 'Nenhuma';
        anunciar(`Instância alterada para arma corpo a corpo. Equipado com: ${nomeMelee}.`);
    }
}

function realizarAtaque() {
    let armaAtiva = player.instanciaAtiva === 'MELEE' ? player.equipment.armaMelee : player.equipment.armaRanged;
    
    if (!armaAtiva) {
        anunciar("Nenhuma arma equipada nesta instância.");
        return;
    }

    soundManager.playAttack();

    let alcanceMaximo = armaAtiva.alcance || 1;
    let vec = getDirectionVector(player.dir);
    let alvoAtingido = false;

    for (let i = 1; i <= alcanceMaximo; i++) {
        let alvoX = player.x + (vec.dx * i);
        let alvoY = player.y + (vec.dy * i);

        if (isWall(alvoX, alvoY)) {
            anunciar(`Ataque bloqueado por parede em X ${alvoX}, Y ${alvoY}.`);
            return;
        }

        let caixa = getBoxAt(alvoX, alvoY);
        if (caixa) {
            soundManager.playSuccess();
            player.stats.ouro += caixa.ouro;
            boxes = boxes.filter(b => b !== caixa);

            anunciar(`Ataque certeiro! Caixa em X ${alvoX}, Y ${alvoY} destruída. Você encontrou ${caixa.ouro} de ouro! Total de ouro: ${player.stats.ouro}.`);
            alvoAtingido = true;
            render();
            break;
        }
    }

    if (!alvoAtingido) {
        soundManager.playHitWall();
        anunciar(`Ataque desferido com ${armaAtiva.nome} para a ${player.dir.toLowerCase()}. Nenhum alvo ao alcance.`);
    }
}

function interagirComMundo() {
    let vec = getDirectionVector(player.dir);
    let frenteX = player.x + vec.dx;
    let frenteY = player.y + vec.dy;

    if (isDoor(frenteX, frenteY)) {
        soundManager.playSuccess();
        anunciar("Porta aberta! Avançando para o próximo nível!");
        alert("Parabéns! Você abriu a porta e avançou para o próximo nível!");
        player.x = 0;
        player.y = 0;
        render();
    } else {
        anunciar("Nada com o que interagir nesta direção.");
    }
}

function moveInDirection(directionName) {
    let vec = getDirectionVector(directionName);
    let newX = player.x + vec.dx;
    let newY = player.y + vec.dy;

    if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
        if (isBlocked(newX, newY)) {
            soundManager.playHitWall();
            let msg = "";
            if (isDoor(newX, newY)) msg = " Porta à frente. Pressione Enter para abri-la.";
            else if (getBoxAt(newX, newY)) msg = " Caixas devem ser destruídas ou contornadas.";
            anunciar(`Caminho bloqueado na direção ${directionName.toLowerCase()}.${msg}`);
            return;
        }

        player.x = newX;
        player.y = newY;

        soundManager.playStep();
        anunciar(`X ${player.x}, Y ${player.y}`);

        render();
    } else {
        soundManager.playHitWall();
        anunciar("Fronteira do mapa alcançada.");
    }
}

function performScan() {
    soundManager.playScan();
    let vec = getDirectionVector(player.dir);
    let foundObjects = [];
    let checkedCoordinates = new Set();

    for (let i = 1; i <= 5; i++) {
        let spread = Math.floor(i / 2);

        for (let s = -spread; s <= spread; s++) {
            let scanX, scanY;

            if (player.dir === 'CIMA' || player.dir === 'BAIXO') {
                scanX = player.x + s;
                scanY = player.y + (vec.dy * i);
            } else {
                scanX = player.x + (vec.dx * i);
                scanY = player.y + s;
            }

            let coordKey = `${scanX},${scanY}`;

            if (scanX >= 0 && scanX < gridWidth && scanY >= 0 && scanY < gridHeight && !checkedCoordinates.has(coordKey)) {
                checkedCoordinates.add(coordKey);

                if (isWall(scanX, scanY)) {
                    foundObjects.push(`Parede em X ${scanX}, Y ${scanY}`);
                } else if (getBoxAt(scanX, scanY)) {
                    foundObjects.push(`Caixa destrutível em X ${scanX}, Y ${scanY}`);
                } else if (isDoor(scanX, scanY)) {
                    foundObjects.push(`Porta em X ${scanX}, Y ${scanY}`);
                }
            }
        }
    }

    if (foundObjects.length > 0) {
        anunciar(`Varredura em cone concluída: ${foundObjects.join(', ')}.`);
    } else {
        anunciar(`Varredura em cone concluída: Nenhum obstáculo ou porta relevante no campo de visão.`);
    }
}

window.addEventListener('keydown', (e) => {
    let key = e.key;
    let isShift = e.shiftKey;
    let lowerKey = key.toLowerCase();

    if (gameState === 'MENU_EQUIPAMENTO') {
        if (key === 'ArrowUp') {
            currentMenuIndex = (currentMenuIndex - 1 + menuEquipamentoOptions.length) % menuEquipamentoOptions.length;
            soundManager.playMenuScroll();
            anunciar(obterDetalheEquipamento(menuEquipamentoOptions[currentMenuIndex]));
        } else if (key === 'ArrowDown') {
            currentMenuIndex = (currentMenuIndex + 1) % menuEquipamentoOptions.length;
            soundManager.playMenuScroll();
            anunciar(obterDetalheEquipamento(menuEquipamentoOptions[currentMenuIndex]));
        } else if (key === 'Escape') {
            soundManager.playMenuBack();
            gameState = 'MENU_PRINCIPAL';
            currentMenuIndex = 2;
            anunciar(`Menu principal. Opção: ${menuPrincipalOptions[currentMenuIndex]}`);
        }
        return;
    }

    if (gameState === 'MENU_STATUS') {
        if (key === 'ArrowUp') {
            currentMenuIndex = (currentMenuIndex - 1 + menuStatusOptions.length) % menuStatusOptions.length;
            soundManager.playMenuScroll();
            anunciar(obterDetalheStatus(menuStatusOptions[currentMenuIndex]));
        } else if (key === 'ArrowDown') {
            currentMenuIndex = (currentMenuIndex + 1) % menuStatusOptions.length;
            soundManager.playMenuScroll();
            anunciar(obterDetalheStatus(menuStatusOptions[currentMenuIndex]));
        } else if (key === 'Escape') {
            soundManager.playMenuBack();
            gameState = 'MENU_PRINCIPAL';
            currentMenuIndex = 0;
            anunciar(`Menu principal. Opção: ${menuPrincipalOptions[currentMenuIndex]}`);
        }
        return;
    }

    if (gameState === 'MENU_PRINCIPAL') {
        if (key === 'ArrowUp') {
            currentMenuIndex = (currentMenuIndex - 1 + menuPrincipalOptions.length) % menuPrincipalOptions.length;
            soundManager.playMenuScroll();
            anunciar(menuPrincipalOptions[currentMenuIndex]);
        } else if (key === 'ArrowDown') {
            currentMenuIndex = (currentMenuIndex + 1) % menuPrincipalOptions.length;
            soundManager.playMenuScroll();
            anunciar(menuPrincipalOptions[currentMenuIndex]);
        } else if (key === 'Enter') {
            soundManager.playMenuConfirm();
            let opcao = menuPrincipalOptions[currentMenuIndex];
            if (opcao === 'Status') {
                gameState = 'MENU_STATUS';
                currentMenuIndex = 0;
                anunciar(`Submenu de Status. ${obterDetalheStatus(menuStatusOptions[currentMenuIndex])}. Use as setas para navegar e Esc para voltar.`);
            } else if (opcao === 'Inventário') {
                anunciar("Inventário vazio. Pressione Esc para voltar.");
            } else if (opcao === 'Equipamento') {
                gameState = 'MENU_EQUIPAMENTO';
                currentMenuIndex = 0;
                anunciar(`Submenu de Equipamento. ${obterDetalheEquipamento(menuEquipamentoOptions[currentMenuIndex])}. Use as setas para navegar e Esc para voltar.`);
            }
        } else if (key === 'Escape') {
            soundManager.playMenuBack();
            gameState = 'NORMAL';
            anunciar(`X ${player.x}, Y ${player.y}`);
        }
        return;
    }

    if (lowerKey === 's') {
        performScan();
    } else if (lowerKey === 'c') {
        soundManager.playMenuConfirm();
        gameState = 'MENU_PRINCIPAL';
        currentMenuIndex = 0;
        anunciar(`Menu principal. Opção: ${menuPrincipalOptions[currentMenuIndex]}. Use as setas para navegar, Enter para selecionar e Esc para fechar.`);
    } else if (lowerKey === 't') {
        anunciar(`Você está olhando para a ${player.dir.toLowerCase()}.`);
    } else if (lowerKey === 'w') {
        alternarInstanciaArma();
    } else if (lowerKey === 'a') {
        realizarAtaque();
    } else if (key === 'Enter') {
        interagirComMundo();
    } else if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
        if (isShift) {
            let novaDir = '';
            if (key === 'ArrowUp') novaDir = 'CIMA';
            if (key === 'ArrowDown') novaDir = 'BAIXO';
            if (key === 'ArrowLeft') novaDir = 'ESQUERDA';
            if (key === 'ArrowRight') novaDir = 'DIREITA';

            player.dir = novaDir;
            soundManager.playStep();
            anunciar(`Olhar direcionado para a ${player.dir.toLowerCase()}.`);
            render();
        } else {
            if (key === 'ArrowUp') moveInDirection('CIMA');
            if (key === 'ArrowDown') moveInDirection('BAIXO');
            if (key === 'ArrowLeft') moveInDirection('ESQUERDA');
            if (key === 'ArrowRight') moveInDirection('DIREITA');
        }
    }
});
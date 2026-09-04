// Ponto de entrada principal do Zenit
window.addEventListener('load', () => {
    // Inicializa os atributos e bônus de classe do personagem
    inicializarAtributosDoJogador();

    // Anuncia o início do jogo para leitores de tela
    anunciar("Zenit iniciado. Use as setas para mover, Shift+setas para olhar, T para direção, S para scan, W para trocar arma, A para atacar, Enter para interagir e C para o menu.");

    // Desenha o mapa e o jogador pela primeira vez
    render();
});
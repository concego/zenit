export const LANGUAGES = [
    { code: "pt-BR", label: "Português (Brasil)" },
    { code: "en", label: "English" }
];

const P = {
    "pt-BR": {
        language: { title: "Selecione o idioma", description: "Escolha o idioma da interface.", hint: "Use as setas para escolher e Enter para confirmar.", selected: "Idioma selecionado." },
        main: { title: "Menu principal", continue: "Continuar jogo", newGame: "Novo jogo", options: "Opções", credits: "Créditos", noSave: "Nenhum jogo salvo disponível." },
        options: { title: "Opções", language: "Idioma", controls: "Controles", accessibility: "Acessibilidade", defaults: "Restaurar configurações padrão", languageInfo: "Selecione o idioma da interface.", controlsInfo: "Setas: mover. Shift mais setas: olhar.", accessibilityInfo: "Anúncios compatíveis com leitores de tela.", defaultsInfo: "Configurações restauradas." },
        credits: { title: "Créditos", description: "Zenit é desenvolvido pela equipe Euconcegojogar.", contact: "Contato: euconcego@gmail.com", back: "Pressione Escape para voltar." },
        startup: { newGame: "Novo jogo iniciado.", controls: "Use as setas para mover e C para abrir o menu." },
        common: { choose: "Use as setas para escolher e Enter para confirmar.", back: "Voltar" },
        character: {
            title: "Boas-vindas a Zenit",
            intro: "Starlight te dá as boas-vindas. Quem será você ao entrar em Zenit?",
            hint: "Setas cima e baixo: navegar. Setas esquerda e direita: mudar gênero, classe e modelo. Enter: editar o nome, confirmar o nome ou selecionar uma ação.",
            nameLabel: "Nome do personagem",
            namePlaceholder: "Qual será seu nome em Zenit?",
            genderLabel: "Gênero do personagem",
            classLabel: "Classe",
            presetLabel: "Modelo do personagem",
            descriptionLabel: "Descrição do modelo",
            confirm: "Entrar em Zenit",
            nameRequired: "Digite um nome para o personagem antes de continuar.",
            nameFocus: "Campo de nome. Pressione Enter para editar.",
            nameEditing: "Editando o nome. Digite o nome e pressione Enter para confirmar.",
            nameConfirmed: "Nome confirmado.",
            nameCancelled: "Edição do nome cancelada.",
            genderChanged: "Gênero atualizado.",
            classChanged: "Classe atualizada. Os modelos disponíveis foram atualizados.",
            presetChanged: "Modelo selecionado.",
            genders: { feminine: "Feminino", masculine: "Masculino" },
            classes: {
                vanguard: { name: "Vanguarda / Campeão", description: "Especialista em Potência e força bruta. Pode usar magia de suporte, como um paladino, mas esse não é seu foco." },
                hunter: { name: "Caçador / Patrulheiro", description: "Especialista em Coordenação, precisão e mobilidade. Pode seguir caminhos de arqueiro ou ladino." },
                mystic: { name: "Místico / Erudito", description: "Especialista em Mente e poderes sobrenaturais, com caminhos de mago, druida ou xamã." }
            },
            presets: {
                "vanguard-f-1": { description: "Armadura frontal leve, capa vermelha e postura pronta para proteger seus aliados." },
                "vanguard-f-2": { description: "Visual robusto, detalhes dourados e uma silhueta que transmite coragem e estabilidade." },
                "vanguard-f-3": { description: "Armadura escura com brilho azul e uma postura silenciosa, feita para resistir ao impossível." },
                "vanguard-m-1": { description: "Armadura frontal leve, capa vermelha e postura pronta para proteger seus aliados." },
                "vanguard-m-2": { description: "Visual robusto, detalhes dourados e uma silhueta que transmite coragem e estabilidade." },
                "vanguard-m-3": { description: "Armadura escura com brilho azul e uma postura silenciosa, feita para resistir ao impossível." },
                "hunter-f-1": { description: "Equipamento leve, arco preparado e olhar atento a qualquer movimento ao redor." },
                "hunter-f-2": { description: "Traje discreto, linhas ágeis e cores de crepúsculo para atravessar lugares perigosos." },
                "hunter-f-3": { description: "Visual luminoso, postura aberta e precisão de quem enxerga uma rota onde ninguém vê." },
                "hunter-m-1": { description: "Equipamento leve, arco preparado e olhar atento a qualquer movimento ao redor." },
                "hunter-m-2": { description: "Traje discreto, linhas ágeis e cores de crepúsculo para atravessar lugares perigosos." },
                "hunter-m-3": { description: "Visual luminoso, postura aberta e precisão de quem enxerga uma rota onde ninguém vê." },
                "mystic-f-1": { description: "Manto violeta, foco luminoso e uma presença concentrada nos sinais do desconhecido." },
                "mystic-f-2": { description: "Traje claro, detalhes azuis e gestos suaves que sugerem magia em movimento." },
                "mystic-f-3": { description: "Capa escura, brilho intenso e uma silhueta que parece guardar muitos segredos." },
                "mystic-m-1": { description: "Manto violeta, foco luminoso e uma presença concentrada nos sinais do desconhecido." },
                "mystic-m-2": { description: "Traje claro, detalhes azuis e gestos suaves que sugerem magia em movimento." },
                "mystic-m-3": { description: "Capa escura, brilho intenso e uma silhueta que parece guardar muitos segredos." }
            }
        },
        skills: { names: { guardian_oath: "Juramento do Guardião", aimed_shot: "Disparo Preciso", arcane_spark: "Faísca Arcana", heavy_strike: "Golpe Pesado", shield_bastion: "Bastião do Escudo", battle_prayer: "Oração de Batalha", rally: "Comando de Reunião", precise_shot: "Tiro Preciso", shadow_step: "Passo Sombrio", trap: "Armadilha", beast_companion: "Companheiro Animal", elemental_bolt: "Projétil Elemental", healing_rite: "Rito de Cura", spirit_call: "Chamado Espiritual", root_entangle: "Raízes Enredantes", second_wind: "Segundo Fôlego", smoke_screen: "Cortina de Fumaça", ward: "Proteção Arcana", poisoned_edge: "Lâmina Envenenada", blood_pact: "Pacto de Sangue" }, descriptions: { guardian_oath: "Fortalece a defesa e reduz parte do dano recebido.", aimed_shot: "Concentra o disparo para causar mais dano e melhorar a precisão.", arcane_spark: "Dispara uma faísca mágica contra um alvo à distância.", heavy_strike: "Desfere um golpe poderoso que pode desequilibrar o alvo.", shield_bastion: "Usa o escudo para aumentar a defesa e bloquear ataques.", battle_prayer: "Uma oração que causa dano e restaura parte da vida.", rally: "Aumenta Potência e Coordenação por um período.", precise_shot: "Um disparo focado com chance maior de acerto crítico.", shadow_step: "Permite um deslocamento rápido e aumenta a evasão.", trap: "Prepara uma armadilha que causa dano e controla o inimigo.", beast_companion: "Invoca um companheiro que luta ao seu lado.", elemental_bolt: "Lança um projétil elemental de grande alcance.", healing_rite: "Canaliza energia para restaurar a vida.", spirit_call: "Invoca um espírito que causa dano e oferece resistência.", root_entangle: "Prende inimigos com raízes e causa dano.", second_wind: "Recupera vida e estamina em um momento de necessidade.", smoke_screen: "Cria fumaça, aumentando a evasão e dificultando ações inimigas.", ward: "Cria uma proteção que aumenta armadura e resistência.", poisoned_edge: "Aplica veneno ao próximo ataque.", blood_pact: "Sacrifica vida para desferir um ataque muito poderoso." } },
        gameplay: { map: "Mapa", level: "nível", mainMenu: "Menu principal", status: "Status", inventory: "Inventário", equipment: "Equipamento", skills: "Habilidades", class: "Classe", power: "Potência", coordination: "Coordenação", mind: "Mente", hp: "HP", stamina: "Estamina", mana: "Mana", gold: "Ouro", empty: "Vazio", box: "Caixa", range: "alcance", head: "Cabeça", neck: "Pescoço", ring1: "Anel 1", ring2: "Anel 2", torso: "Tronco", body: "Sobre o Corpo", waist: "Cintura", legs: "Pernas", feet: "Pés", melee: "Arma Corpo a Corpo", ranged: "Arma à Distância", shield: "Escudo", direction: { CIMA: "cima", BAIXO: "baixo", ESQUERDA: "esquerda", DIREITA: "direita" }, item: { "Vanguarda / Campeão": "Vanguarda / Campeão", "Caçador / Patrulheiro": "Caçador / Patrulheiro", "Místico / Erudito": "Místico / Erudito", "Espada Curta": "Espada Curta", "Arco Curto": "Arco Curto" }, messages: { boundary: "Fronteira do mapa alcançada.", doorAhead: " Porta à frente. Pressione Enter para abrir.", boxAhead: " A caixa deve ser destruída ou contornada.", waterAhead: " A água impede a passagem.", objectAhead: " Um objeto bloqueia a passagem.", blocked: "Caminho bloqueado para", scanWall: "parede em", scanWater: "água em", scanBox: "caixa em", scanObject: "objeto em", scanDoor: "porta em", scanNone: "nenhum obstáculo ou porta relevante no campo de visão", scanDone: "Varredura em cone concluída", noWeapon: "Nenhuma arma equipada nesta instância.", attackWall: "Ataque bloqueado por parede em", attackDoor: "A porta bloqueia o ataque. Pressione Enter para interagir com ela.", destroyed: "destruída. Você encontrou", total: "Total", attackDone: "Ataque desferido com", noTarget: "Nenhum alvo ao alcance.", nothing: "Nada com que interagir nesta direção.", doorOpened: "Porta aberta. Você avançou para o nível", activeWeapon: "Arma ativa", none: "nenhuma", looking: "Você está olhando para", look: "Olhar direcionado para", menuHint: "Use as setas, Enter para selecionar e Escape para fechar.", submenuStatus: "Submenu de Status.", submenuEquipment: "Submenu de Equipamento.", submenuSkills: "Submenu de Habilidades.", inventoryEmpty: "Inventário vazio.", option: "Opção", skillDescription: "Descrição", skillLevel: "Nível", skillLevelShort: "nível", skillCost: "Custo", skillPoints: "Pontos de habilidade disponíveis", skillRequirements: "Requisitos", skillNone: "nenhum", skillReady: "Pronto para aprender. Pressione Enter para comprar.", skillNeedPoints: "Pontos insuficientes.", skillNeedRequirements: "Requisitos ainda não atendidos.", skillMax: "Nível máximo alcançado.", skillPurchased: "habilidade aprimorada para o nível" , skillCannotPurchase: "A habilidade não foi comprada.", skillShortcut: "Atalho numérico", skillAssigned: "atribuída ao atalho", skillMustBeLearned: "Aprenda a habilidade antes de atribuí-la a um atalho.", skillSlot: "Atalho", skillUnassigned: "nenhuma habilidade atribuída.", skillCannotUse: "A habilidade não pode ser usada agora.", skillUsed: "usada" } }
    },
    en: {
        language: { title: "Select language", description: "Choose the interface language.", hint: "Use the arrow keys to choose and Enter to confirm.", selected: "Language selected." },
        main: { title: "Main menu", continue: "Continue game", newGame: "New game", options: "Options", credits: "Credits", noSave: "No saved game is available." },
        options: { title: "Options", language: "Language", controls: "Controls", accessibility: "Accessibility", defaults: "Restore default settings", languageInfo: "Choose the interface language.", controlsInfo: "Arrows: move. Shift plus arrows: look.", accessibilityInfo: "Announcements compatible with screen readers.", defaultsInfo: "Settings restored." },
        credits: { title: "Credits", description: "Zenit is developed by the Euconcegojogar team.", contact: "Contact: euconcego@gmail.com", back: "Press Escape to go back." },
        startup: { newGame: "New game started.", controls: "Use the arrow keys to move and C to open the menu." },
        common: { choose: "Use the arrow keys to choose and Enter to confirm.", back: "Back" },
        character: {
            title: "Welcome to Zenit",
            intro: "Starlight welcomes you. Who will you be when you enter Zenit?",
            hint: "Up and Down arrows: navigate. Left and Right arrows: change gender, class, and model. Enter: edit the name, confirm the name, or select an action.",
            nameLabel: "Character name",
            namePlaceholder: "What will your name be in Zenit?",
            genderLabel: "Character gender",
            classLabel: "Class",
            presetLabel: "Character model",
            descriptionLabel: "Model description",
            confirm: "Enter Zenit",
            nameRequired: "Enter a character name before continuing.",
            nameFocus: "Name field. Press Enter to edit.",
            nameEditing: "Editing the name. Type the name and press Enter to confirm.",
            nameConfirmed: "Name confirmed.",
            nameCancelled: "Name editing cancelled.",
            genderChanged: "Gender updated.",
            classChanged: "Class updated. Available models have been updated.",
            presetChanged: "Model selected.",
            genders: { feminine: "Feminine", masculine: "Masculine" },
            classes: {
                vanguard: { name: "Vanguard / Champion", description: "A specialist in Power and brute force. They may use support magic like a paladin, but it is not their focus." },
                hunter: { name: "Hunter / Ranger", description: "A specialist in Coordination, precision, and mobility. They may follow an archer or rogue path." },
                mystic: { name: "Mystic / Scholar", description: "A specialist in Mind and supernatural powers, with mage, druid, or shaman paths." }
            },
            presets: {
                "vanguard-f-1": { description: "Light front armor, a red cape, and a stance ready to protect allies." },
                "vanguard-f-2": { description: "A sturdy look, golden details, and a silhouette that conveys courage and stability." },
                "vanguard-f-3": { description: "Dark armor with a blue glow and a quiet stance built to withstand the impossible." },
                "vanguard-m-1": { description: "Light front armor, a red cape, and a stance ready to protect allies." },
                "vanguard-m-2": { description: "A sturdy look, golden details, and a silhouette that conveys courage and stability." },
                "vanguard-m-3": { description: "Dark armor with a blue glow and a quiet stance built to withstand the impossible." },
                "hunter-f-1": { description: "Light gear, a ready bow, and an attentive gaze for every movement nearby." },
                "hunter-f-2": { description: "A discreet outfit, agile lines, and twilight colors for crossing dangerous places." },
                "hunter-f-3": { description: "A bright look, an open stance, and the precision to see a route where no one else can." },
                "hunter-m-1": { description: "Light gear, a ready bow, and an attentive gaze for every movement nearby." },
                "hunter-m-2": { description: "A discreet outfit, agile lines, and twilight colors for crossing dangerous places." },
                "hunter-m-3": { description: "A bright look, an open stance, and the precision to see a route where no one else can." },
                "mystic-f-1": { description: "A violet mantle, a luminous focus, and a presence attuned to signs of the unknown." },
                "mystic-f-2": { description: "Light robes, blue details, and gentle gestures that suggest magic in motion." },
                "mystic-f-3": { description: "A dark cape, an intense glow, and a silhouette that seems to hold many secrets." },
                "mystic-m-1": { description: "A violet mantle, a luminous focus, and a presence attuned to signs of the unknown." },
                "mystic-m-2": { description: "Light robes, blue details, and gentle gestures that suggest magic in motion." },
                "mystic-m-3": { description: "A dark cape, an intense glow, and a silhouette that seems to hold many secrets." }
            }
        },
        skills: { names: { guardian_oath: "Guardian's Oath", aimed_shot: "Aimed Shot", arcane_spark: "Arcane Spark", heavy_strike: "Heavy Strike", shield_bastion: "Shield Bastion", battle_prayer: "Battle Prayer", rally: "Rally", precise_shot: "Precise Shot", shadow_step: "Shadow Step", trap: "Trap", beast_companion: "Beast Companion", elemental_bolt: "Elemental Bolt", healing_rite: "Healing Rite", spirit_call: "Spirit Call", root_entangle: "Entangling Roots", second_wind: "Second Wind", smoke_screen: "Smoke Screen", ward: "Arcane Ward", poisoned_edge: "Poisoned Edge", blood_pact: "Blood Pact" }, descriptions: { guardian_oath: "Strengthens defense and reduces part of incoming damage.", aimed_shot: "Focuses a shot to deal more damage and improve accuracy.", arcane_spark: "Fires a magical spark at a distant target.", heavy_strike: "Delivers a powerful strike that may stagger the target.", shield_bastion: "Uses a shield to increase defense and block attacks.", battle_prayer: "A prayer that deals damage and restores some health.", rally: "Increases Power and Coordination for a period.", precise_shot: "A focused shot with a higher critical hit chance.", shadow_step: "Allows a quick movement and increases evasion.", trap: "Prepares a trap that damages and controls an enemy.", beast_companion: "Summons a companion that fights beside you.", elemental_bolt: "Launches a powerful elemental projectile.", healing_rite: "Channels energy to restore health.", spirit_call: "Summons a spirit that deals damage and grants resistance.", root_entangle: "Binds enemies with roots and deals damage.", second_wind: "Recovers health and stamina in a moment of need.", smoke_screen: "Creates smoke, increasing evasion and hindering enemy actions.", ward: "Creates protection that increases armor and resistance.", poisoned_edge: "Applies poison to the next attack.", blood_pact: "Sacrifices health to deliver a very powerful attack." } },
        gameplay: { map: "Map", level: "level", mainMenu: "Main menu", status: "Status", inventory: "Inventory", equipment: "Equipment", skills: "Skills", class: "Class", power: "Power", coordination: "Coordination", mind: "Mind", hp: "HP", stamina: "Stamina", mana: "Mana", gold: "Gold", empty: "Empty", box: "Box", range: "range", head: "Head", neck: "Neck", ring1: "Ring 1", ring2: "Ring 2", torso: "Torso", body: "Over the Body", waist: "Waist", legs: "Legs", feet: "Feet", melee: "Melee Weapon", ranged: "Ranged Weapon", shield: "Shield", direction: { CIMA: "up", BAIXO: "down", ESQUERDA: "left", DIREITA: "right" }, item: { "Vanguarda / Campeão": "Vanguard / Champion", "Caçador / Patrulheiro": "Hunter / Ranger", "Místico / Erudito": "Mystic / Scholar", "Espada Curta": "Short Sword", "Arco Curto": "Short Bow" }, messages: { boundary: "Map boundary reached.", doorAhead: " Door ahead. Press Enter to open.", boxAhead: " The box must be destroyed or avoided.", waterAhead: " Water blocks the path.", objectAhead: " An object blocks the path.", blocked: "Path blocked to", scanWall: "wall at", scanWater: "water at", scanBox: "box at", scanObject: "object at", scanDoor: "door at", scanNone: "no relevant obstacle or door in view", scanDone: "Cone scan complete", noWeapon: "No weapon is equipped in this instance.", attackWall: "Attack blocked by wall at", attackDoor: "The door blocks the attack. Press Enter to interact with it.", destroyed: "destroyed. You found", total: "Total", attackDone: "Attack performed with", noTarget: "No target in range.", nothing: "Nothing to interact with in this direction.", doorOpened: "Door opened. You advanced to", activeWeapon: "Active weapon", none: "none", looking: "You are looking", look: "Looking toward", menuHint: "Use the arrows, Enter to select, and Escape to close.", submenuStatus: "Status submenu.", submenuEquipment: "Equipment submenu.", submenuSkills: "Skills submenu.", inventoryEmpty: "Inventory is empty.", option: "Option", skillDescription: "Description", skillLevel: "Level", skillLevelShort: "level", skillCost: "Cost", skillPoints: "Available skill points", skillRequirements: "Requirements", skillNone: "none", skillReady: "Ready to learn. Press Enter to buy.", skillNeedPoints: "Not enough skill points.", skillNeedRequirements: "Requirements are not met yet.", skillMax: "Maximum level reached.", skillPurchased: "skill upgraded to level", skillCannotPurchase: "The skill was not purchased.", skillShortcut: "Number shortcut", skillAssigned: "assigned to shortcut", skillMustBeLearned: "Learn the skill before assigning it to a shortcut.", skillSlot: "Shortcut", skillUnassigned: "no skill assigned.", skillCannotUse: "The skill cannot be used now.", skillUsed: "used" } }
    }
};

const KEY = "zenit.language";
export function getSavedLanguage() { try { const value = localStorage.getItem(KEY); return LANGUAGES.some(({ code }) => code === value) ? value : null; } catch { return null; } }
export function saveLanguage(value) { try { localStorage.setItem(KEY, value); } catch {} }
export function getText(language, path) { return path.split(".").reduce((value, key) => value && value[key], P[language] || P["pt-BR"]) || path; }

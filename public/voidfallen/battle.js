class Battle {
    constructor(player, enemy, game, cavern = false) {
        this.player = player;
        this.enemy = enemy;
        this.game = game;
        this.cavern = cavern;
        this.enemy_max_hp = enemy.hp; // Store max HP for flee check

        // Define enemy properties based on name
        this.poison_inflictors = ["snake", "nightcrawler"];
        this.bleed_inflictors = ["winged horror"];
        this.silk_droppers = ["nightcrawler"];
        this.animal_fat_droppers = ["winged horror"];
        this.ghost_lifesteal = ["ghost"];
        this.ectoplasm_droppers = [];
        this.talkable_enemies = ["dragon"]; // Add talkable enemies here

        // Dark mode specific properties
        if (this.game.alt_mode) {
            this.poison_inflictors.push("flesh moth");
            this.bleed_inflictors.push("bleeding idol", "the feasting"); // Python's extend becomes push with multiple args
            this.silk_droppers.push("flesh moth");
            this.ectoplasm_droppers.push("watcher");
        }

        // Bind methods to this instance to ensure 'this' context is correct in event handlers
        this._handlePlayerAttack = this._handlePlayerAttack.bind(this);
        this._handleUseItem = this._handleUseItem.bind(this);
        this._handleRun = this._handleRun.bind(this);
        this._handleTalk = this._handleTalk.bind(this);
    }

    run() {
        this.game.displayMessage(`A wild ${this.enemy.name} appears!`);
        this._startTurn();
    }

    _startTurn() {
        // Check if battle is over
        if (this.enemy.hp <= 0) {
            this.game.displayMessage(`${this.enemy.name} has been defeated!`);
            this.handleDrops();
            // Signal battle won
            this.game.endBattle("won");
            return;
        }
        if (this.player.hp <= 0) {
            this.game.displayMessage("You have fallen in battle...");
            // Signal battle lost
            this.game.endBattle("lost");
            return;
        }

        this.player.process_debuffs(); // Assuming player.processDebuffs() exists
        if (this.player.hp <= 0) {
            this.game.displayMessage("You succumbed to debuffs!");
            this.game.endBattle("lost");
            return;
        }

        this.game.displayStats(this.player, this.enemy);
        const actions = [
            { name: "Attack", handler: this._handlePlayerAttack },
            { name: "Use Item", handler: this._handleUseItem },
            { name: "Run", handler: this._handleRun },
        ];

        if (this.talkable_enemies.includes(this.enemy.name.toLowerCase())) {
            actions.push({ name: "Talk", handler: this._handleTalk });
        }

        this.game.displayActions(actions);
    }

    _handlePlayerAttack() {
        this.game.clearActions(); // Clear buttons immediately after action

        const dmg = this.player.getCurrentAttack(this.game) + Math.floor(Math.random() * 5); // random.randint(0, 4)
        this.enemy.hp -= dmg;
        this.game.displayMessage(`You strike the ${this.enemy.name} for ${dmg} damage!`);

        // Lifesteal for specific enemies if player is bleeding
        const isLifestealEnemy = this.bleed_inflictors.some(e => this.enemy.name.toLowerCase().includes(e)) ||
                                  this.ghost_lifesteal.some(e => this.enemy.name.toLowerCase().includes(e));
        if (this.enemy.hp > 0 && isLifestealEnemy && (this.player.bleed_turns && this.player.bleed_turns > 0)) {
            const heal = 2;
            this.enemy.hp += heal;
            this.game.displayMessage(`${this.enemy.name} absorbs ${heal} HP from your bleeding!`);
        }

        this.game.displayStats(this.player, this.enemy);

        // Check if enemy is defeated after player's attack
        if (this.enemy.hp <= 0) {
            this.game.displayMessage(`${this.enemy.name} has been defeated!`);
            this.handleDrops();
            this.game.endBattle("won");
            return;
        }

        // Enemy's turn
        this._handleEnemyAttack();
    }

    _handleUseItem() {
        this.game.clearActions(); // Clear buttons immediately after action

        if (this.player.inventory["Potion"] && this.player.inventory["Potion"] > 0) {
            this.player.inventory["Potion"] -= 1;
            this.player.heal(30);
            this.game.displayMessage("You drink a potion and restore 30 HP.");
        } else if (this.cavern && this.player.inventory["Animal Fat"] && this.player.inventory["Animal Fat"] > 0) {
            this.player.inventory["Animal Fat"] -= 1;
            this.player.refuel_lantern(3); // Assuming refuelLantern exists on player
            this.game.displayMessage("You use animal fat to refuel your lantern.");
        } else if (this.player.inventory["Bandage"] && this.player.inventory["Bandage"] > 0) {
            this.player.inventory["Bandage"] -= 1;
            this.player.poison_turns = 0;
            this.player.bleed_turns = 0;
            this.game.displayMessage("You use a bandage and cure all bleeding and poison effects!");
        } else {
            this.game.displayMessage("You have no usable items!");
        }
        this._handleEnemyAttack(); // Enemy still gets a turn if player uses item
    }

    _handleRun() {
        this.game.clearActions(); // Clear buttons immediately after action
        if (Math.random() < 0.5) {
            this.game.displayMessage("You escaped successfully!");
            this.game.endBattle("fled");
        } else {
            this.game.displayMessage("You failed to escape!");
            this._handleEnemyAttack(); // Enemy still gets a turn if player fails to run
        }
    }

    _handleEnemyAttack() {
        // Enemy turn: check for flee, then attack
        const isLowHealth = this.enemy.hp < this.enemy_max_hp * 0.2;
        if (isLowHealth && Math.random() < 0.1) {
            this.game.displayMessage(`The ${this.enemy.name} is low on health and flees from the battle!`);
            this.game.endBattle("enemy_fled");
            return;
        }

        const dmg = this.enemy.attack + Math.floor(Math.random() * 4); // random.randint(0, 3)
        this.player.take_damage(dmg); // Assuming player.takeDamage() exists
        this.game.displayMessage(`The ${this.enemy.name} hits you for ${dmg} damage!`);

        // 25% chance to inflict debuffs
        if (this.poison_inflictors.some(e => this.enemy.name.toLowerCase().includes(e)) && Math.random() < 0.25) {
            this.player.apply_poison(); // Assuming player.applyPoison() exists
        }
        if (this.bleed_inflictors.some(e => this.enemy.name.toLowerCase().includes(e)) && Math.random() < 0.25) {
            this.player.apply_bleed(); // Assuming player.applyBleed() exists
        }

        this.game.displayStats(this.player, this.enemy);

        // Check if player is defeated after enemy's attack
        if (this.player.hp <= 0) {
            this.game.displayMessage("You have fallen in battle...");
            this.game.endBattle("lost");
            return;
        }

        // Continue to next player turn
        this._startTurn();
    }

    handleDrops() {
        if (this.animal_fat_droppers.some(e => this.enemy.name.toLowerCase().includes(e))) {
            this.game.displayMessage("You collect animal fat from the winged horror's remains.");
            this.player.addItem("Animal Fat"); // Assuming player.addItem() exists
        }
        if (this.silk_droppers.some(e => this.enemy.name.toLowerCase().includes(e))) {
            this.game.displayMessage("You collect silk from the nightcrawler's remains.");
            this.player.addItem("Silk"); // Assuming player.addItem() exists
        }
        if (this.ectoplasm_droppers.some(e => this.enemy.name.toLowerCase().includes(e))) {
            this.game.displayMessage("You collect a strange, shimmering ectoplasm from the watcher's remains.");
            this.player.addItem("Ectoplasm"); // Assuming player.addItem() exists
        }
    }
        this._startTurn();
    }

    _handleTalk() {
        this.game.clearActions();
        this.game.displayMessage("You try to talk, but the creature doesn't seem to understand.");
        this._handleEnemyAttack();
    }
}

class AzraelBattle extends Battle {
    constructor(player, enemy, game, cavern = false) {
        super(player, enemy, game, cavern);
        this.turns = 0;

        // Bind methods to this instance for AzraelBattle specific handlers
        this._handlePlayerAttack = this._handlePlayerAttack.bind(this);
        this._handleUseItem = this._handleUseItem.bind(this);
    }

    run() {
        this.game.displayMessage(`You face the archangel Azrael...`);
        this._startTurn();
    }

    _startTurn() {
        this.turns += 1;
        if (this.turns > 10) {
            this.player.hp = 0; // Player loses if battle goes on too long
        }

        // Check if battle is over (copied from Battle._startTurn)
        if (this.enemy.hp <= 0) {
            this.game.displayMessage(`${this.enemy.name} has been defeated!`);
            this.handleDrops();
            this.game.endBattle("won");
            return;
        }
        if (this.player.hp <= 0) {
            this.game.displayMessage("You have fallen in battle...");
            this.game.endBattle("lost");
            return;
        }

        this.player.processDebuffs();
        if (this.player.hp <= 0) {
            this.game.displayMessage("You succumbed to debuffs!");
            this.game.endBattle("lost");
            return;
        }

        this.game.displayStats(this.player, this.enemy);
        const actions = [
            { name: "Attack", handler: this._handlePlayerAttack },
            { name: "Use Item", handler: this._handleUseItem },
        ];
        if (this.turns < 10) {
            actions.push({ name: "Talk", handler: this._handleTalk });
        }
        this.game.displayActions(actions);
    }

    _handleRun() {
        // Azrael battle has no escape
        this.game.displayMessage("There is no escape from Azrael!");
        this._handleEnemyAttack(); // Enemy still gets a turn
    }

    _handleEnemyAttack() {
        // Azrael does not flee
        let dmg;
        if (this.turns < 10) {
            dmg = 0;
            this.game.displayMessage(`Azrael stares at you, but does not attack.`);
        } else {
            dmg = 9999999;
            this.game.displayMessage(`Azrael unleashes its true power, dealing ${dmg} damage!`);
        }
        
        this.player.take_damage(dmg);

        // Azrael debuffs (copied from Battle._handleEnemyAttack, but specific to Azrael)
        // Assuming Azrael has specific debuffs or uses general ones
        if (this.poison_inflictors.some(e => this.enemy.name.toLowerCase().includes(e)) && Math.random() < 0.25) {
            this.player.apply_poison();
        }
        if (this.bleed_inflictors.some(e => this.enemy.name.toLowerCase().includes(e)) && Math.random() < 0.25) {
            this.player.apply_bleed();
        }

        this.game.displayStats(this.player, this.enemy);

        if (this.player.hp <= 0) {
            this.game.displayMessage("You have been defeated... but your journey is not over.");
            // In Python, this calls _create_astar_save and exits.
            // TODO: Implement JavaScript equivalent of _create_astar_save() here.
            this.game.endBattle("lost");
            return;
        }

        this._startTurn();
    }

    _handleTalk() {
        const loreMessages = [
            "'Your actions lead here...'",
            "'To a world where you face your actions'",
            "'This void...'",
            "'Is much like your heart...'",
            "'Tell the devil I said hi.'"
        ];
        const message = loreMessages[Math.floor(Math.random() * loreMessages.length)];
        this.game.displayMessage(message);
        this._handleEnemyAttack(); // Enemy still gets a turn after talking
    }
}

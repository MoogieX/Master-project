class Exploration {
    constructor(game) {
        this.game = game;
        this.player = game.player;

        // Bind methods to this instance
        this._handleNorth = this._handleNorth.bind(this);
        this._handleNortheast = this._handleNortheast.bind(this);
        this._handleEast = this._handleEast.bind(this);
        this._handleSoutheast = this._handleSoutheast.bind(this);
        this._handleSouth = this._handleSouth.bind(this);
        this._handleSouthwest = this._handleSouthwest.bind(this);
        this._handleWest = this._handleWest.bind(this);
        this._handleNorthwest = this._handleNorthwest.bind(this);
        this._handleVillage = this._handleVillage.bind(this);
        this._handleRuins = this._handleRuins.bind(this);
        this._handleCavern = this._handleCavern.bind(this);
        this._handleVolcano = this._handleVolcano.bind(this);
        this._handleCraft = this._handleCraft.bind(this);
        this._handleBack = this._handleBack.bind(this);
        this._handleDev = this._handleDev.bind(this);
        this._handleInventory = this._handleInventory.bind(this);
    }

    explore() {
        this.game.displayMessage(this.game.alt_text(
            "\nYou stand at a crossroads. Where will you go?",
            "\nYou stand at the fracture. Where will you wander?"
        ));

        const actions = [
            { name: "North (n)", handler: this._handleNorth },
            { name: "Northeast (ne)", handler: this._handleNortheast },
            { name: "East (e)", handler: this._handleEast },
            { name: "Southeast (se)", handler: this._handleSoutheast },
            { name: "South (s)", handler: this._handleSouth },
            { name: "Southwest (sw)", handler: this._handleSouthwest },
            { name: "West (w)", handler: this._handleWest },
            { name: "Northwest (nw)", handler: this._handleNorthwest },
            { name: "Craft", handler: this._handleCraft },
            { name: "Inventory", handler: this._handleInventory },
            { name: "Back", handler: this._handleBack },
        ];

        if (this.game.act === 1) {
            actions.push({ name: "Village", handler: this._handleVillage });
        }
        if (this.game.act === 2) {
            actions.push(
                { name: "Ruins", handler: this._handleRuins },
                { name: "Cavern", handler: this._handleCavern },
                { name: "Volcano", handler: this._handleVolcano }
            );
        }
        if (this.game.developer_mode) {
            actions.push({ name: "Dev", handler: this._handleDev });
        }

        this.game.displayActions(actions);
    }

    // Placeholder handler methods
    _handleNorth() { this.game.displayMessage("You head North. (Not yet implemented)"); }
    _handleNortheast() { this.game.displayMessage("You head Northeast. (Not yet implemented)"); }
    _handleEast() { this.game.displayMessage("You head East. (Not yet implemented)"); }
    _handleSoutheast() { this.game.displayMessage("You head Southeast. (Not yet implemented)"); }
    _handleSouth() { this.game.displayMessage("You head South. (Not yet implemented)"); }
    _handleSouthwest() { this.game.displayMessage("You head Southwest. (Not yet implemented)"); }
    _handleWest() { this.game.displayMessage("You head West. (Not yet implemented)"); }
    _handleNorthwest() { this.game.displayMessage("You head Northwest. (Not yet implemented)"); }
    _handleVillage() { this.game.displayMessage("You go to the Village. (Not yet implemented)"); }
    _handleRuins() { this.game.displayMessage("You go to the Ruins. (Not yet implemented)"); }
    _handleCavern() { this.game.displayMessage("You go to the Cavern. (Not yet implemented)"); }
    _handleVolcano() { this.game.displayMessage("You go to the Volcano. (Not yet implemented)"); }
    _handleCraft() { this.game.displayMessage("You open the Crafting menu. (Not yet implemented)"); }
    _handleBack() { this.game.displayMessage("You go Back. (Not yet implemented)"); }
    _handleDev() { this.game.displayMessage("Developer commands. (Not yet implemented)"); }
    _handleInventory() { this.game.displayMessage("You open your Inventory. (Not yet implemented)"); }
}

export default Exploration;

import { Battle } from './battle.js';
import Exploration from './exploration.js';

class Game {
    constructor() {
        this.gameContainer = document.getElementById('game-container');
        this.player = null; // Will be initialized later
        this.exploration = new Exploration(this); // Instantiate Exploration
        this.alt_mode = false;
        // ... other game properties from Python version
    }

    startGame() {
        console.log('Welcome to Voidfallen! The game is starting...');
        this.displayMessage("Welcome to Voidfallen!");
        // For now, we'll just start exploration directly
        this.exploration.explore();
    }

    displayMessage(message) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        this.gameContainer.appendChild(messageElement);
    }

    displayStats(player, enemy) {
        const statsElement = document.createElement('div');
        statsElement.id = 'battle-stats';
        statsElement.innerHTML = `
            <p>Your HP: ${player.hp}/${player.max_hp}</p>
            <p>Enemy HP: ${enemy.hp}/${enemy.max_hp}</p>
        `;
        this.gameContainer.appendChild(statsElement);
    }

    displayActions(actions) {
        const actionsContainer = document.createElement('div');
        actionsContainer.id = 'battle-actions';

        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.name;
            button.onclick = () => {
                // When a button is clicked, we clear the old actions before processing the turn
                this.clearActions();
                action.handler();
            };
            actionsContainer.appendChild(button);
        });

        this.gameContainer.appendChild(actionsContainer);
    }

    clearActions() {
        const actionsContainer = document.getElementById('battle-actions');
        if (actionsContainer) {
            actionsContainer.remove();
        }
    }

    endBattle(outcome) {
        this.clearGameContainer(); // Clear all battle-related UI
        let message = "";
        switch (outcome) {
            case "won":
                message = "You emerged victorious from the battle!";
                break;
            case "lost":
                message = "You were defeated in battle...";
                break;
            case "fled":
                message = "You successfully fled the battle.";
                break;
            case "enemy_fled":
                message = "The enemy fled the battle.";
                break;
            default:
                message = "The battle has ended.";
        }
        this.displayMessage(message);
        // For now, we'll just display a message. Later, this could lead to exploration, game over, etc.
        this.displayMessage("What would you like to do next?"); // Placeholder for next game state
    }

    clearGameContainer() {
        // Clears all content from the game container
        this.gameContainer.innerHTML = '';
    }

    // Placeholder methods for exploration integration
    random_event() {
        this.displayMessage("A random event occurred! (Placeholder)");
        return false; // For now, no actual event happens
    }

    battle(enemy) {
        this.displayMessage(`A battle started with ${enemy.name}! (Placeholder)`);
        // Simulate battle outcome for now
        return "won";
    }

    scale_enemy(options) {
        // Placeholder for scaling enemy based on game state
        return { name: "Scaled Enemy", hp: 50, max_hp: 50, attack: 10 };
    }

    ask_yes_no(question) {
        this.displayMessage(question + " (Yes/No)");
        // For now, always return true for simplicity
        return true;
    }

    alt_text(normalText, altText) {
        return this.alt_mode ? altText : normalText;
    }
}

// Entry point for the game
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.startGame();
});
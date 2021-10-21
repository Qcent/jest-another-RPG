const Character = require('./Character');
const Potion = require('./Potion');

class Enemy extends Character {
    constructor(name = '', weapon) {
        // call parent constructor here:
        super(name);
        this.weapon = weapon;
        this.potion = new Potion();
    }

    getStats() {
        return {
            potions: this.potion,
            health: this.health,
            strength: this.strength,
            agility: this.agility
        };
    };

    getDescription() {
        return `A ${this.name} holding a ${this.weapon} has appeared!`;
    };
}
module.exports = Enemy;
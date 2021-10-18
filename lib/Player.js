const Potion = require('../lib/Potion');

jest.mock('../lib/Potion');

function Player(name) {

    this.types = ['strength', 'agility', 'health'];
    this.name = name || '';

    this.inventory = [new Potion('health'), new Potion()];

    this.health = Math.floor(Math.random() * 10 + 95);
    this.strength = Math.floor(Math.random() * 5 + 7);
    this.agility = Math.floor(Math.random() * 5 + 7);


}
// returns a Human readable string indicting the players health
Player.prototype.getHealth = function() {
    return `${this.name}'s health is now ${this.health}!`;
};

// returns true if player is alive/health>0 otherwise : false
Player.prototype.isAlive = function() {
    if (this.health === 0) {
        return false;
    }
    return true;
};

// returns an object with various player properties
Player.prototype.getStats = function() {
    return {
        potions: this.inventory.length,
        health: this.health,
        strength: this.strength,
        agility: this.agility
    };
};

// returns the inventory array or false if empty
Player.prototype.getInventory = function() {
    if (this.inventory.length) {
        return this.inventory;
    }
    return false;
};

// lowers the health of the player by any amount but will not let it go negative
Player.prototype.reduceHealth = function(health) {
    this.health -= health;

    if (this.health < 0) {
        this.health = 0;
    }
};

// generates an attack value for the player based on player.strength and some randomness
Player.prototype.getAttackValue = function() {
    const min = this.strength - 5;
    const max = this.strength + 5;

    return Math.floor(Math.random() * (max - min) + min);
};

// function to add a potion to a players inventory / must be supplied a potion object
Player.prototype.addPotion = function(potion) {
    this.inventory.push(potion);
};

// function to remove a potion at a specific inventory index and apply that potions effects to the player
Player.prototype.usePotion = function(index) {
    const potion = this.getInventory().splice(index, 1)[0];

    switch (potion.name) {
        case 'agility':
            this.agility += potion.value;
            break;
        case 'health':
            this.health += potion.value;
            break;
        case 'strength':
            this.strength += potion.value;
            break;
    }
};

module.exports = Player;
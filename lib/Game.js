const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {

    this.roundNumber = 0;
    this.turnNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;

    this.logstr = '';
    this.log = function(str) {
        if (str === undefined) {
            console.log(this.logstr);
            this.logstr = '';
        } else { this.logstr += str + '\n'; }
    }

}

Game.prototype.initializeGame = function() {
    // Populate the enemies array
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    this.currentEnemy = this.enemies[0];

    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        })
        // destructure name from the prompt object
        .then(({ name }) => {
            this.player = new Player(name);

            // test the object creation
            this.startNewBattle();
        });
};

Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    if (this.roundNumber === 0) {
        console.clear()
            // console.log('Your stats are as follows:');
            //console.table(this.player.getStats());

        this.logDataTable();
        console.log(this.currentEnemy.getDescription());
    } else {
        this.log(this.currentEnemy.getDescription());
        this.updateScreen();
    }



    this.battle();
};

Game.prototype.logDataTable = function() {
    //destructure player and enemy stats
    const { potions, health, strength, agility } = this.player.getStats();
    const { health: NMEhealth, strength: NMEstrength, agility: NMEagility } = this.currentEnemy.getStats();

    //log them with console.table
    console.table([{ " ": this.player.name, Health: health, Strength: strength, Agility: agility, Potions: potions },
        { " ": this.currentEnemy.name, Health: NMEhealth, Strength: NMEstrength, Agility: NMEagility }
    ]);
}

Game.prototype.battle = function() {

    if (this.isPlayerTurn) {
        this.turnNumber++;
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use potion']
            })
            .then(({ action }) => {

                if (action === 'Use potion') {
                    if (!this.player.getInventory()) {
                        this.log("You clumsily search all your pockets but don't find any potions!");
                        return this.checkEndOfBattle();
                    }

                    inquirer
                        .prompt({
                            type: 'list',
                            message: 'Which potion would you like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                        })
                        .then(({ action }) => {
                            const potionDetails = action.split(': ');
                            this.player.usePotion(potionDetails[0] - 1);

                            this.log(`You used a ${potionDetails[1]} potion.`);

                            this.checkEndOfBattle();
                        });
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);

                    this.log(`You attacked the ${this.currentEnemy.name} for ${damage} damage`);
                    this.log(this.currentEnemy.getHealth());

                    this.checkEndOfBattle();
                }
            });
    } else {
        this.turnNumber++;
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        this.log(`You were attacked by the ${this.currentEnemy.name} for ${damage} damage`);
        this.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
};

Game.prototype.updateScreen = function() {
    console.clear()
    this.logDataTable();
    this.log();
}

Game.prototype.checkEndOfBattle = function() {

    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;

        if (this.turnNumber % 2 === 0) { // once both the player and the enemy have attacked
            this.updateScreen();
        }

        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        this.log(`\nYou've defeated the ${this.currentEnemy.name}`);

        this.player.addPotion(this.currentEnemy.potion);
        this.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion on the filthy ${this.currentEnemy.name} corpse`);

        this.updateScreen();

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];

            inquirer
                .prompt({
                    type: 'confirm',
                    name: 'continue',
                    message: 'Press enter to continue?',
                })
                .then(data => this.startNewBattle());
        } else {


            console.log("You win, Bro!... is all you can make out among the sound of footstep running away.");
        }
    } else {
        this.updateScreen();

        console.log(`You've been defeated! \n 'The time of man is over!' 'The time of the ${this.currentEnemy.name} has come!' \n\n Please play again!\n\n`);
    }

};

module.exports = Game;
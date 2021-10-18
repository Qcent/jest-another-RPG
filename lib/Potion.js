function Potion(name) {

    this.types = ['strength', 'agility', 'health'];
    this.name = name || this.types[Math.floor(Math.random() * this.types.length)];

    switch (name) {
        case 'health':
            this.value = Math.floor(Math.random() * 10 + 30);
            break;

        case 'agility':
            this.value = Math.floor(Math.random() * 7 + 5);
            break;

        case 'strength':
            this.value = Math.floor(Math.random() * 6 + 6);
            break;

        default:
            this.value = Math.floor(Math.random() * 5 + 7);
    }
}

module.exports = Potion;
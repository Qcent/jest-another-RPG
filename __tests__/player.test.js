const Player = require('../lib/Player');

test('creates a player object', () => {
    const player = new Player('Davey Dynamo');

    expect(player.name).toBe('Davey Dynamo');
    expect(player.health).toEqual(expect.any(Number));
    expect(player.strength).toEqual(expect.any(Number));
    expect(player.agility).toEqual(expect.any(Number));

    expect(player.inventory).toEqual(
        expect.arrayContaining([expect.any(Object)])
    );

});
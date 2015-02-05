window.onload = function() {

"use strict";
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {


    game.load.image('mini', 'assets/miniledge.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('building', 'assets/building.png');
    game.load.image('ledge', 'assets/ledge.png');
    game.load.image('dog', 'assets/dog.png');
    game.load.spritesheet('catcher', 'assets/catcher.png', 43, 50);

}


var dogs;
var ground;
var player;
var platforms;
var cursors;
var score = 0;
var scoreText;
var button;

function create() {

	
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'building');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    var ledge = platforms.create(30, 260, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(230, 260, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(430,260, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(630,260, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(30,560, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(230,560, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(430,560, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(630,560, 'ledge');
    ledge.body.immovable = true;

    ledge = platforms.create(175,400, 'mini');
    ledge.body.immovable = true;

    ledge = platforms.create(375,400, 'mini');
    ledge.body.immovable = true;

    ledge = platforms.create(575,400, 'mini');
    ledge.body.immovable = true;
   

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'catcher');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = false;
    player.body.setSize(20, 40, 20, 10);


    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    player.animations.add('left', [0, 1, 2], 10, true);
    player.animations.add('right', [4, 5, 6], 10, true);

    dogs = game.add.group();

    dogs.enableBody = true;

    dogs.createMultiple(500, 'dog', 0, false);
/*
    for (var i = 0; i < 4; i++){

    var dog = dogs.create(100 + (i*200), 240, 'dog');

    }

    for (var i = 0; i < 4; i++){

    var dog = dogs.create(100 + (i*200), 540, 'dog');

    }
*/
    game.time.events.repeat(Phaser.Timer.SECOND, 500, resurrect, this);

    scoreText = game.add.text(300, 5, 'Dogs Captured: 0', { fontSize: '32px',fill: '#00ff00' });


}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.right.isDown && player.body.touching.down && cursors.up.isDown)
    {
        player.body.velocity.y = -150;
    }
    else if (cursors.left.isDown && player.body.touching.down && cursors.up.isDown)
    {
        player.body.velocity.y = -150;
    }
    else if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -330;
    }

    game.physics.arcade.overlap(player, dogs, captureDog, null, this);

}

function resurrect() {

    //  Get a dead item
    var item = dogs.getFirstDead();

    if (item)
    {
        //  And bring it back to life
        item.reset((100 + (200*game.rnd.integerInRange(0, 3)) + (5*game.rnd.integerInRange(-10,10))), (240 + (300*game.rnd.integerInRange(0,1))));

        //  This just changes its frame
        item.frame = game.rnd.integerInRange(0, 36);
    }

}


function captureDog (player, dog) {
    
    // Removes the star from the screen
    dog.kill();

    //  Add and update the score
    score += 1;
    scoreText.text = 'Dogs Captured: ' + score;

}
};
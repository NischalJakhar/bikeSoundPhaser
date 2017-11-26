//this game will have only 1 state
var GameState = {
    //load the game assets before the game starts
    preload: function() {
        this.load.image('background', 'assets/images/background.jpg');
        this.load.image('arrow', 'assets/images/arrow.png');
        this.load.image('dirt1', 'assets/images/dirt1.png');

        this.load.image('busa','assets/images/hayabusa1.png');
        this.load.image('monster','assets/images/monster.png');
        this.load.image('bullet','assets/images/bullet.png');

        this.load.audio('busaSound', 'assets/audio/busa.mp3');
        this.load.audio('bulletSound','assets/audio/bullet.mp3');
        this.load.audio('dirtSound','assets/audio/dirt.wav');
        this.load.audio('monsterSound','assets/audio/monster.wav');
    },
    //executed after everything is loaded
    create: function() {

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.background = this.game.add.sprite(0, 0, 'background');

        var bikeData = [
            {key:'busa',text:'Hayabusa',audio:'busaSound'},
            {key:'bullet',text:'Royal Enfield',audio:'bulletSound'},
            {key:'dirt1',text:'Dirt Bike',audio:'dirtSound'},
            {key:'monster',text:'Monster Bike',audio:'monsterSound'}

        ];

        this.bikes = this.game.add.group();

        var self = this;

        var bike;

        bikeData.forEach(function (element) {
            bike = self.bikes.create(-1000, self.game.world.centerY, element.key);
            bike.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
            bike.anchor.setTo(0.5);

            bike.inputEnabled = true;
            bike.input.pixelPerfectClick = true;
            bike.events.onInputDown.add(self.animateBike, self);

        });

            this.currentBike = this.bikes.next();
            this.currentBike.position.set(this.game.world.centerX, this.game.world.centerY);

            this.showText(this.currentBike);

            this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
            this.leftArrow.anchor.setTo(0.5);
            this.leftArrow.scale.x = -1;
            this.leftArrow.customParams = {direction: -1};

            this.leftArrow.inputEnabled = true;
            this.leftArrow.input.pixelPerfectClick = true;
            this.leftArrow.events.onInputDown.add(this.switchBike, this);

            //right arrow
            this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
            this.rightArrow.anchor.setTo(0.5);
            this.rightArrow.customParams = {direction: 1};

            //right arrow user input
            this.rightArrow.inputEnabled = true;
            this.rightArrow.input.pixelPerfectClick = true;
            this.rightArrow.events.onInputDown.add(this.switchBike, this);



    },
    //this is executed multiple times per second
    update: function() {
    },

    animateBike: function(sprite, event) {

        sprite.customParams.sound.play();
    },

    switchBike: function(sprite, event) {

        //if an animation is taking place don't do anything
        if(this.isMoving) {
            return false;
        }

        this.isMoving = true;

        //hide text
        this.bikeText.visible = false;

        var newBike, endX;
        //according to the arrow they pressed, which animal comes in
        if(sprite.customParams.direction > 0) {
            newBike = this.bikes.next();
            newBike.x = -newBike.width/2;
            endX = 640 + this.currentBike.width/2;
        }
        else {
            newBike = this.bikes.previous();
            newBike.x = 640 + newBike.width/2;
            endX = -this.currentBike.width/2;
        }

        //tween animations, moving on x
        var newBikeMovement = this.game.add.tween(newBike);
        newBikeMovement.to({ x: this.game.world.centerX }, 1000);
        newBikeMovement.onComplete.add(function()
        {
            this.isMoving = false;
            this.showText(newBike);
        }, this);
        newBikeMovement.start();

        var currentBikeMovement = this.game.add.tween(this.currentBike);
        currentBikeMovement.to({ x: endX }, 1000);
        currentBikeMovement.start();

        this.currentBike = newBike;
    },

    showText: function(bike) {
        if(!this.bikeText) {
            var style = {
                font: 'bold 30pt Arial',
                fill: '#0000FF',
                align: 'center'
            }
            this.bikeText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
            this.bikeText.anchor.setTo(0.5);
        }

        this.bikeText.setText(bike.customParams.text);
        this.bikeText.visible = true;
    }


};

//initiate the Phaser framework
var game = new Phaser.Game(640, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');
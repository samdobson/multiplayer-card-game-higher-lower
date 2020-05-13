var game;
var gameOptions = {
    gameWidth: 750,
    gameHeight: 1334,
    cardSheetWidth: 334,
    cardSheetHeight: 440,
    cardScale: 0.8
}
window.onload = function() {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
    game.state.add("PlayGame", playGame)
    game.state.start("PlayGame");
}
var playGame = function(game) {}
playGame.prototype = {
    preload: function() {
        for(var i = 0; i < 10; i++){
            game.load.spritesheet("cards" + i, "cards" + i + ".png", gameOptions.cardSheetWidth, gameOptions.cardSheetHeight);
        }
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    create: function() {
        game.stage.backgroundColor = "#4488AA";
        this.deck = Phaser.ArrayUtils.numberArray(0, 51);
        Phaser.ArrayUtils.shuffle(this.deck);
        this.cardsInGame = [this.makeCard(0), this.makeCard(1)];
        this.nextCardIndex = 2;
        var tween = game.add.tween(this.cardsInGame[0]).to({
            x: game.width / 2
        }, 500, Phaser.Easing.Cubic.Out, true);
        game.input.onDown.add(this.beginSwipe, this);
    },
    makeCard: function(cardIndex) {
        var card = game.add.sprite(gameOptions.cardSheetWidth * gameOptions.cardScale / -2, game.height / 2, "cards0");
        card.anchor.set(0.5);
        card.scale.set(gameOptions.cardScale);
        card.loadTexture("cards" + this.getCardTexture(this.deck[cardIndex]));
        card.frame = this.getCardFrame(this.deck[cardIndex]);
        return card;
    },
    getCardTexture: function(cardValue){
        return Math.floor((cardValue % 13) / 3) + 5 * Math.floor(cardValue / 26);
    },
    getCardFrame: function(cardValue){
        return (cardValue % 13) % 3 + 3 * (Math.floor(cardValue / 13) % 2);
    },
    beginSwipe: function(e) {
        game.input.onDown.remove(this.beginSwipe, this);
        game.input.onUp.add(this.endSwipe, this);
    },
    endSwipe: function(e) {
        game.input.onUp.remove(this.endSwipe, this);
        var swipeTime = e.timeUp - e.timeDown;
        var swipeDistance = Phaser.Point.subtract(e.position, e.positionDown);
        var swipeMagnitude = swipeDistance.getMagnitude();
        var swipeNormal = Phaser.Point.normalize(swipeDistance);
        if(swipeMagnitude > 20 && swipeTime < 1000 && Math.abs(swipeNormal.y) > 0.8) {
            if(swipeNormal.y > 0.8) {
                this.handleSwipe(1);
            }
            if(swipeNormal.y < -0.8) {
                this.handleSwipe(-1);
            }
        } else {
            game.input.onDown.add(this.beginSwipe, this);
        }
    },
    handleSwipe: function(dir) {
        var cardToMove = (this.nextCardIndex + 1) % 2;
        this.cardsInGame[cardToMove].y += dir * gameOptions.cardSheetHeight * gameOptions.cardScale * 1.1;
        var tween = game.add.tween(this.cardsInGame[cardToMove]).to({
            x: game.width / 2
        }, 500, Phaser.Easing.Cubic.Out, true);
        tween.onComplete.add(function() {
            game.time.events.add(Phaser.Timer.SECOND, this.moveCards, this)
        }, this)
    },
    moveCards: function() {
        var cardToMove = this.nextCardIndex % 2;
        var moveOutTween = game.add.tween(this.cardsInGame[cardToMove]).to({
            x: game.width + gameOptions.cardSheetWidth * gameOptions.cardScale
        }, 500, Phaser.Easing.Cubic.Out, true);
        cardToMove = (this.nextCardIndex + 1) % 2
        var moveDownTween = game.add.tween(this.cardsInGame[cardToMove]).to({
            y: game.height / 2
        }, 500, Phaser.Easing.Cubic.Out, true);
        moveDownTween.onComplete.add(function() {
            var cardToMove = this.nextCardIndex % 2
            this.cardsInGame[cardToMove].loadTexture("cards" + this.getCardTexture(this.deck[this.nextCardIndex]));
            this.cardsInGame[cardToMove].frame = this.getCardFrame(this.deck[this.nextCardIndex]);
            this.nextCardIndex = (this.nextCardIndex + 1) % 52;
            this.cardsInGame[cardToMove].x = gameOptions.cardSheetWidth * gameOptions.cardScale / -2;
            game.input.onDown.add(this.beginSwipe, this);
        }, this)
    }
}
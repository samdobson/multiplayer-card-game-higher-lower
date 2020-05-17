const config = {
  type: Phaser.AUTO,
  width: 1800,
  height: 900,
  backgroundColor: "#222222",
  parent: "game-container",
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

var gameOptions = {
  cardSheetWidth: 334,
  cardSheetHeight: 440,
  cardScale: 0.8
};

function preload() {
  this.load.image("repeating-background", "assets/images/escheresque_dark.png");
  for (var i = 0; i < 10; i++) {
    this.load.spritesheet("cards" + i, "assets/images/cards" + i + ".png", {
      frameWidth: gameOptions.cardSheetWidth,
      frameHeight: gameOptions.cardSheetHeight
    });
  }
}

function create() {
  const { width, height } = this.sys.game.config;

  // Creating a repeating background sprite
  const bg = this.add.tileSprite(0, 0, width, height, "repeating-background");
  bg.setOrigin(0, 0);

  // In v3, you can chain many methods, so you can create text and configure it in one "line"
  this.add
    .text(width / 2, height / 2, "Card\nGame", {
      font: "120px monospace",
      color: "#05668D"
    })
    .setOrigin(0.5, 0.5)
    .setShadow(5, 5, "#F0F3BD", 0, true, true);

  this.deck = Phaser.Utils.Array.NumberArray(0, 51);
  Phaser.Utils.Array.Shuffle(this.deck);
  this.cardsInGame = [makeCard(this, 0), makeCard(this, 1)];
  console.log(this.cardsInGame);
  this.nextCardIndex = 2;
  this.tweens.add({
    targets: this.cardsInGame[0],
    x: width / 2,
    duration: 500,
    ease: "Back",
    easeParams: [3.5]
  });
}

function update(time, delta) {
  // We aren't using this in the current example, but here is where you can run logic that you need
  // to check over time, e.g. updating a player sprite's position based on keyboard input
}

function makeCard(scene, index) {
  // check this against new API  const { width, height } = this.sys.game.config;
  const { width, height } = scene.sys.game.config;
  var card = scene.add
    .sprite(
      {
        frameWidth: (gameOptions.cardSheetWidth * gameOptions.cardScale) / -2,
        frameHeight: height / 2
      },
      "cards0"
    )
    .setOrigin(0.5, 0.5)
    .setTexture("cards" + getSheetNumForCard(scene.deck[index]));
  card.scale = gameOptions.cardScale;
  card.frame = getFrameNumForCard(scene.deck[index]);
  console.log(card);
  return card;
}

function getSheetNumForCard(index) {
  return Math.floor((index % 13) / 3) + 5 * Math.floor(index / 26);
}

function getFrameNumForCard(index) {
  return ((index % 13) % 3) + 3 * (Math.floor(index / 13) % 2);
}

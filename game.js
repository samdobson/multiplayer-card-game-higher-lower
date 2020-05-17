var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
    this.load.image('repeating-background', 'assets/images/escheresque_dark.png');
}

function create ()
{
	// Set background.
	const { width, height } = this.sys.game.config;
	const bg = this.add.tileSprite(0, 0, width, height, "repeating-background").setOrigin(0, 0);

    //  Create a stack of random cards
    var frames = this.textures.get('cards').getFrameNames();
	
	// Remove surplus frames.
	frames = frames.filter(e => e !== 'back')
	frames = frames.filter(e => e !== 'joker')

	console.log(frames);

    var x = 100;
    var y = 100;

	var self = this;
	frames.forEach(function (card, index) {
        var image = self.add.image(x, y, 'cards', card).setInteractive();
        self.input.setDraggable(image);
        x += 4;
        y += 4;	
	});

    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });
	
    var deck = this.add.group([
        { key: 'cards', frame: "diamondsJack", repeat: 5, setXY: { x: 400, y: 148, stepX: 52 } },
        { key: 'cards', frame: "clubsJack", repeat: 10, setXY: { x: 400, y: 148 + 48, stepX: 52 } },
        { key: 'cards', frame: "spadesJack", repeat: 10, setXY: { x: 400, y: 148 + 48 + 48, stepX: 52 } },
        { key: 'cards', frame: "heartsJack", repeat: 10, setXY: { x: 400, y: 148 + 48 + 48 + 48, stepX: 52 } }
	]);
	
}
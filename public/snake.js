function setup() {
	frameRate(15);
	createCanvas(windowWidth, windowHeight);
	const numSquares = 40;
	this.palette = new Palette();
	this.drawing = false;
	this.board = new GameBoard(windowWidth * 0.8, windowHeight * 0.8, numSquares);
	const extent = this.board.boardExtent;
	this.snakePlayer = new SnakePlayer(numSquares);
	for (var i = 0; i < 30; i++) {
		this.snakePlayer.grow();
	}
	this.painter = new Painter(snakePlayer, board, palette)
}

function draw() {
	clear();
	checkRecolor();
	this.snakePlayer.propagateMovement();
	const headPos = this.snakePlayer.head.coord;
	if (this.drawing && headPos.x >= 0 && headPos.x < 40 && headPos.y >= 0 && headPos.y < 40) {
		this.board.canvas[(headPos.x + "," + headPos.y)] = this.painter.playerColor_;
	}
	this.painter.paintText();
	this.painter.paintBoard();
	this.painter.paintPalette();
	this.painter.paintPlayer();
}

function checkRecolor() {
	let headPos = this.board.coordToPos(this.snakePlayer.head.coord);
	if (headPos.x >= this.board.boardExtent.x / 2 + (windowWidth * 0.6) - this.board.cellSize &&
		headPos.x <= this.board.boardExtent.x / 2 + (windowWidth * 0.6) + this.board.boardExtent.x / (2 * this.palette.numColors - 1)) {
		const bot = new p5.Vector(0, this.board.cellSize);
		let headExtent = {
			"top": headPos,
			"bot": p5.Vector.add(headPos, bot)
		}
		let splotchSize = this.board.boardExtent.x / (2 * this.palette.numColors - 1);
		let x_disp = this.board.boardExtent.x / 2 + (windowWidth * 0.6);
		let y_disp = abs(this.board.boardExtent.y / 2 - (windowHeight * 0.5));
		this.palette.colors.forEach((color, idx) => {
			if (headExtent.top.y >= y_disp + idx * 2 * splotchSize &&
				headExtent.bot.y <= splotchSize + y_disp + idx * 2 * splotchSize) {
				this.painter.playerColor = color;
				return;
			}
		});
	}

}

function keyPressed() {
	if (key === "p") {
		snakePlayer.paused = !snakePlayer.paused;
	} else if (key === " ") {
		this.drawing = !this.drawing;
	} else if (key === "z") {
		this.snakePlayer.shrink();
	} else if (key === "x") {
		this.snakePlayer.grow();
	}
	else if (!snakePlayer.paused) {
		var d = {
			37: "left",
			39: "right",
			38: "up",
			40: "down"
		};
		const code = d[keyCode];
		if (code) {
			snakePlayer.setDirection(d[keyCode]);
		} else {
			return;
		}
	}
}

window.addEventListener("keydown", function(e) {
	// space and arrow keys
	if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		e.preventDefault();
	}
}, false);
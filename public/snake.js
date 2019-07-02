class SnakeSegment {
	constructor(coord, direction, next) {
		this.coord = coord;
		this.direction = direction;
		this.next = next;
	}

	setDirection(new_dir) {
		this.direction = new_dir;
	}

	move() {
		if (this.next && this.next.direction !== this.direction) {
			this.direction = this.next.direction;
		}
		this.coord = this.coord.add(this.direction);
	}
}

class SnakePlayer {
	constructor(numSquares) {
		this.dirs = {"left" 	: new p5.Vector(-1, 0),
					  "right" 	: new p5.Vector(1, 0),
					  "up"		: new p5.Vector(0, -1),
					  "down"	: new p5.Vector(0, 1)}
		this.body = [];
		this.numSquares = numSquares;
		const headPos = new p5.Vector(int(this.numSquares / 2), int(this.numSquares / 2));
		this.head = new SnakeSegment(headPos, this.dirs["right"]);
		this.body.push(this.head);
	}

	setDirection(dir) {
		this.head.setDirection(this.dirs[dir]);
	}

	propagateMovement() {
		this.body.reverse().forEach(function (elem) {
			elem.move();
		});
	}
}

class GameBoard {
	constructor(width, height, numSquares) {
		const smallDim = min(width, height)
		this.numSquares = numSquares;
		this.cellWidth = smallDim / numSquares;
		this.cellHeight = smallDim / numSquares;
		this.extent = new p5.Vector(this.cellWidth*numSquares, this.cellWidth*numSquares);

	}

	coordToPos(coord) {
		return new p5.Vector(windowHeight*0.5 + coord.x * this.cellWidth, windowHeight*0.1 + coord.y * this.cellHeight);
	}

	posToCoord(pos) {
		return new p5.Vector(int(coord.x / this.numSquares), int(coord.y / this.numSquares));
	}

	get cellSize() {
		return this.cellHeight;
	}

	get boardExtent() {
		return this.extent;
	}
}

class Painter {
	constructor(player, board) {
		this.player = player
		this.board = board
	}

	paintBoard() {
		for (var i = 0; i < board.numSquares; i++) {
			for (var j = 0; j < board.numSquares; j++) {
				const dest = this.board.coordToPos(new p5.Vector(i, j));
				fill('white');
				square(dest.x, dest.y, this.board.cellSize);
			}
		}
	}

	paintPlayer() {
		this.player.body.forEach(function (segment) {
			const bodyPos = board.coordToPos(segment.coord);
			fill('red');
			square(bodyPos.x, bodyPos.y, board.cellSize);
		});
	}
}

function setup() {
	frameRate(24);
	createCanvas(windowWidth, windowHeight);
	const numSquares = 40;
	this.board = new GameBoard(windowWidth*0.8, windowHeight*0.8, numSquares);
	const extent = this.board.boardExtent;
	this.snakePlayer = new SnakePlayer(numSquares);
	this.painter = new Painter(snakePlayer, board)
}

function draw() {
	clear();
	this.snakePlayer.propagateMovement();
	this.painter.paintBoard();
	this.painter.paintPlayer();
}

function keyPressed() {
	var d = {  37 	: "left",
			   39 	: "right",
			   38	: "up",
			   40	: "down"};
	snakePlayer.setDirection(d[keyCode]);
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
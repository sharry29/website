class Painter {
	constructor(player, board, palette) {
		this.player = player
		this.board = board
		this.palette = palette
		this.playerColor_ = 'red'
		this.playerEyeColor_ = 'black'
		this.RIGHT = new p5.Vector(1, 0)
		this.LEFT = new p5.Vector(-1, 0)
		this.UP = new p5.Vector(0, -1)
		this.DOWN = new p5.Vector(0, 1)
	}

	set playerColor(color) {
		this.playerColor_ = color;
		if (color === "black" || color === "blue") {
			this.playerEyeColor_ = "white"
		} else {
			this.playerEyeColor_ = "black"
		}
	}

	paintBoard() {
		const extent = this.board.coordToPos(createVector(board.numSquares, board.numSquares));
		for (var i = 0; i <= board.numSquares; i++) {
			const origin_vert = this.board.coordToPos(new p5.Vector(i, 0));
			const origin_horiz = this.board.coordToPos(new p5.Vector(0, i));
			line(origin_vert.x, origin_vert.y, origin_vert.x, extent.y);
			line(origin_horiz.x, origin_horiz.y, extent.x, origin_horiz.y);
		}
		for (var coord in this.board.canvas) {
			let coords = coord.split(",")
			let new_coord = new p5.Vector(parseInt(coords[0]), parseInt(coords[1]));
			const pos = this.board.coordToPos(new_coord);
			fill(this.board.canvas[coord])
			square(pos.x, pos.y, this.board.cellSize)
		}
		fill('black')
	}

	paintPlayer() {
		this.player.body.forEach( segment => {
			const bodyPos = board.coordToPos(segment.coord);
			fill(this.playerColor_);
			if (this.playerColor_ === "white") {
				stroke('red');
			}	
			square(bodyPos.x, bodyPos.y, board.cellSize);
			if (this.player.head === segment) {
				stroke(this.playerEyeColor_);
				strokeWeight(4);
				const headDir = segment.direction;
				if (headDir.equals(this.RIGHT)) {
					point(bodyPos.x  + 0.7 * board.cellSize, bodyPos.y + 0.2 * board.cellSize);
					point(bodyPos.x  + 0.7 * board.cellSize, bodyPos.y + 0.8 * board.cellSize);
				} else if (headDir.equals(this.LEFT)) {
					point(bodyPos.x  + 0.3 * board.cellSize, bodyPos.y + 0.2 * board.cellSize);
					point(bodyPos.x  + 0.3 * board.cellSize, bodyPos.y + 0.8 * board.cellSize);
				} else if (headDir.equals(this.UP)) {
					point(bodyPos.x  + 0.2 * board.cellSize, bodyPos.y + 0.3 * board.cellSize);
					point(bodyPos.x  + 0.8 * board.cellSize, bodyPos.y + 0.3 * board.cellSize);
				} else if (headDir.equals(this.DOWN)) {
					point(bodyPos.x  + 0.2 * board.cellSize, bodyPos.y + 0.7 * board.cellSize);
					point(bodyPos.x  + 0.8 * board.cellSize, bodyPos.y + 0.7 * board.cellSize);
				}
			}
			stroke("black");
			strokeWeight(1);	
		});
		stroke("black")
	}

	paintPalette() {
		let splotchSize = this.board.boardExtent.x / (2 * this.palette.numColors - 1);
		let x_disp = this.board.boardExtent.x/2 + (windowWidth * 0.6);
		let y_disp = abs(this.board.boardExtent.y/2 - (windowHeight * 0.5));
		this.palette.colors.forEach(function (data, idx) {
			fill(data);
			square(x_disp, y_disp + idx * 2 * splotchSize, splotchSize);
		});
	}
}

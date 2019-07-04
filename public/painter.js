class Painter {
	constructor(player, board, palette) {
		this.player = player
		this.board = board
		this.palette = palette
		this.playerColor_ = 'red'
	}

	set playerColor(color) {
		this.playerColor_ = color;
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

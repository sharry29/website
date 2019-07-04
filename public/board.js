class GameBoard {
	constructor(width, height, numSquares) {
		this.smallDim = min(width, height)
		this.numSquares = numSquares;
		this.cellWidth = this.smallDim / numSquares;
		this.cellHeight = this.smallDim / numSquares;
		this.extent = new p5.Vector(this.cellWidth*numSquares, this.cellWidth*numSquares);

	}

	coordToPos(coord) {
		let x_displace = windowWidth/2 - this.smallDim/2;
		let y_displace = windowHeight/2 - this.smallDim/2;
		return new p5.Vector(x_displace + coord.x * this.cellWidth, y_displace + coord.y * this.cellHeight);
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
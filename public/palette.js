class Palette {
	constructor(colors) {
		if (colors) {
			this.colors = colors;
		}
		else {
			this.colors = ["red", "yellow", "blue", "black", "grey", "white"]
		}
		this.splotches = []
		this.colors.forEach(c => this.splotches.push(new Splotch(c)));	
		this.numColors = this.colors.length;
	}
}

class Splotch {
	constructor(color) {
		this.color = color
	}
}
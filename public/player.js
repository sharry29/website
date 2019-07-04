class SnakeSegment {
	constructor(coord, direction, next) {
		this.coord = coord;
		this.direction = direction;
		this.next = next;
	}

	setDirection(new_dir) {
		if (p5.Vector.dot(this.direction, new_dir) == 0) {
			this.direction = new_dir;
		}
	}

	move() {
		this.coord.add(this.direction);
		if (this.next && !this.next.direction.equals(this.direction)) {
			this.direction = this.next.direction;
		}

	}
}

class SnakePlayer {
	constructor(numSquares) {
		this.dirs = {"left" 	: new p5.Vector(-1, 0),
					  "right" 	: new p5.Vector(1, 0),
					  "up"		: new p5.Vector(0, -1),
					  "down"	: new p5.Vector(0, 1),
					  "pause"	: new p5.Vector(0, 0)}
		this.paused = false;
		this.body = [];
		this.numSquares = numSquares;
		const headPos = new p5.Vector(int(this.numSquares / 2), int(this.numSquares / 2));
		this.head = new SnakeSegment(headPos, this.dirs["right"]);
		this.tail = this.head;
		this.body.push(this.head);
	}

	setDirection(dir) {
		this.head.setDirection(this.dirs[dir]);
	}

	propagateMovement() {
		if (!this.paused) {
			this.body.slice().reverse().forEach(function (elem) {
				elem.move();
			});
		}
	}

	grow(name) {
		// find the new position
		let tail_coord = p5.Vector.sub(this.tail.coord, this.tail.direction);
		let tail_dir = this.tail.direction;
		let tail_next = this.tail;

		let new_tail = new SnakeSegment(tail_coord, tail_dir, tail_next);
		this.body.push(new_tail);
		this.tail = new_tail;
	}
}
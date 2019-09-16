json_obj = {
	"variables": ["LOBBY", "BORDER", "BELLY"],
	"terminals": ["RBorder", "HBorder", "RBelly", "HBelly"],
	"productions": [
		{
			"in": "LOBBY",
			"outs": ["BORDER", "BELLY"]
		},
		{
			"in": "BORDER",
			"outs": ["RBorder"]
		},
		{
			"in": "BORDER",
			"outs": ["HBorder"]
		},
		{
			"in": "BELLY",
			"outs": ["BORDER", "BELLY"]
		},
		{
			"in": "BELLY",
			"outs": ["HBelly"]
		},
		{
			"in": "BELLY",
			"outs": ["RBelly"]
		},

	],
	"start_var": "LOBBY"
}

class Production {
	constructor(prod_dict) {
		this.in = prod_dict.in
		this.outs = prod_dict.outs
	}

	toString() {
		// return "hello";
		return `${this.in} --> ${this.outs}`
	}
}

class CFG {
	constructor(obj) {
		this.variables = new Set(obj.variables);
		this.terminals = new Set(obj.terminals);
		for (var x of this.variables) {
			if (this.terminals.has(x)) {
				throw new Error("Variables and terminals must be disjoint.")
			}
		}
		let prod_arr = obj.productions.map(d => new Production(d));
		this.productions = this.define_productions(prod_arr);
		this.start_var = obj.start_var;
	}

	define_productions (prod_arr) {
		var prod_map = new Map();
		for (var prod of prod_arr) {
			if (prod_map.has(prod.in)) {
				prod_map.set(prod_map.get(prod.in).push(prod))
			} else {
				prod_map.set(prod.in, [prod])
			}
		}
		return prod_map
	}

	choose_production_uniform (var_to_expand) {
		if (!this.productions.has(var_to_expand)) {
			throw new Error("Attempted to produce using a word without a production rule.");
		} else {
			const prods = this.productions.get(var_to_expand)
			return prods[Math.floor(Math.random()*prods.length)];
		}
	}

	toString() {
		return `VARS: ${this.variables}\nTERMINALS: ${this.terminals}\nRULES: ${this.productions}\n`
	}

	produceRandom() {

	}
}

class Sentence {
	constructor(cfg, init) {
		this.cfg = cfg;
		if (init == null) {
			this.elems = [cfg.start_var]
			this.left = 0
		} else if ((typeof init) != "object") {
			throw new Error("Sentences must be arrays!");
		} else {
			this.elems = init;
			this.left = null
			for (var i in this.elems) {
				if (this.cfg.variables.has(this.elems[i])) {
					this.left = i;
					break;
				}
			}
		}
	}

	expand_left () {
		if (this.left == -1) { 
			throw new Error("No variables to expand!")
		}
		else {
			let to_replace = this.elems[this.left];
			let rule = this.cfg.choose_production_uniform(to_replace);
			this.elems.splice(this.left, 1);
			for (var i = rule.outs.length - 1; i >= 0; i--) {
				this.elems.splice(this.left, 0, rule.outs[i]);
			}
			this.find_left();
		}

	}

	find_left () {
		for (var i = this.left; i < this.elems.length; i++) {
			if (this.cfg.variables.has(this.elems[i])) {
				this.left = i;
				return;
			}
		}
		this.left = -1;
		return;
	}

	has_var () {
		return this.left >= 0;
	}

}




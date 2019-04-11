// Stage v0.12
// Note: Yet another way to declare a class, using .prototype.

function DEBUGww(msg) {
    console.log('++++ (WW) ++++ ' + msg + ' ++++');
}

module.exports = class Stage {
	constructor(width, height) {

		// the logical width and height of the stage
		this.width = width;
		this.height = height;

		this.map;

		this.actors = []; // all actors on this stage (monsters, player, boxes, ...)

		this.centerX = Math.floor(this.width/2);
		this.centerY = Math.floor(this.height/2);



		//this.score = 0; // TODO REMOVE


	}

	findPlayer(playerId) {
		for (let i = 0; i < this.actors.length; i++) {
			var actor = this.actors[i];

			// if actor type is a player (not a INT)
			let type = actor.getType();
			if (type == global.TYPE_PLAYER) {
				DEBUGww('finding ('+playerId+'), this player is possible match');

				if (actor.playerId == playerId) {
					DEBUGww('is match!');
					let x = actor.getX();
					let y = actor.getY();
					DEBUGww('found player at: ('+x+', '+y+')');
					return {'x': x, 'y': y, 'playerActor': actor};
				} else {
					DEBUGww('not match');
				}
			}


		}
	}

    updateHighscore(playerID, score) {
        DEBUGww('calling update higscore for: '+playerID+'and score:'+score);
        let data = {
            uname: playerID,
            score: score
        };

        $.ajax({
            type: 'POST',
            url: '/api/addscore',
            data: data
        })
        .done(function(data) {
            DEBUGww('update score successful');

            // tell content to do something
            callBack(data['verified']);

            // return data['registered'];
        })
        .fail(function(jqXhr) {
            DEBUGww('update score failed');
        });
    }

	removePlayer(playerId) {
		DEBUGww('in removePlayer() for player: '+playerId);
		let loc = this.findPlayer(playerId);

		if (loc) {

			// get actor (player) at found location
			let leavingPlayerActor = this.getActor(loc.x, loc.y);

			// remove previous actor at found location
			this.removeActor(leavingPlayerActor);

			// create new Blank actor and add that actor
			let newBlankActor = new Actor(loc.x, loc.y, global.TYPE_BLANK, this);
			this.addActor(newBlankActor);

			// update map
			this.updateMap();
		}
	}

	insertPlayer(playerId) {
		DEBUGww('in insertPlayer() for player: '+playerId);
		let loc = this.findSpawn();

		// get actor (blank) at spawn location
		let blankActor = this.getActor(loc.x, loc.y);

		// remove previous actor at spawn location
		this.removeActor(blankActor);

		// create new player actor with playerId and add that actor
		let newPlayer = new Player(loc.x, loc.y, this, playerId);
		this.addActor(newPlayer);

		// update map
		this.updateMap();
		// this.map[loc.y][loc.x] = playerId;
		// DEBUGww('this.map at spawn: '+this.map[loc.y][loc.x]);
	}

	findSpawn() {
		for (let row = this.centerY; row < this.height; row++) {

			// start col at middle for
			// let col = ((row == this.centerY) ? this.centerX : 0) // TODO remove this comment
			for (let col = this.centerX; col < this.width; col++) {

				let actor = this.getActor(col, row);
				if (actor.getType() == global.TYPE_BLANK) {
					let x = actor.getX();
					let y = actor.getY();
					DEBUGww('found spawn at: ('+x+', '+y+')');
					return {'x': x, 'y': y};
				}
			}
		}
	}

	updateMap() {
		for (let i = 0; i < this.actors.length; i++) {
			var actor = this.actors[i];
			var x = actor.getX();
			var y = actor.getY();

			let type = actor.getType();
			if (type == global.TYPE_PLAYER) {
				this.map[y][x] = actor.playerId;
			} else {
				this.map[y][x] = actor.getType();
			}
		}
	}



	setup() {
		var map = [];

		for (var row = 0; row < this.height; row++) {
		    if(!map[row])
		        map[row] = [];
		    for (var col = 0; col < this.width; col++) {

				var decision = Math.random() * 100;

				// is this a wall?
				if (row == 0 || col == 0 || row == this.height - 1 || col == this.width - 1) {
					map[row][col] = global.TYPE_WALL;
					console.log('adding WALL');
					this.addActor(new Actor(col, row, global.TYPE_WALL, this));
					// console.log(this.actors);

				// is this a monster?
				// 2%
				} else if (decision < 2) {
					map[row][col] = global.TYPE_MONSTER;
					console.log('adding MONSTER');
					this.addActor(new Monster(col, row, this, global.DELAY_REG_MONSTER));

				// is this a box?
				// 38%
				} else if (decision < 40) {
					map[row][col] = global.TYPE_BOX;
					console.log('adding BOX');
					this.addActor(new Box(col, row, this));

				// is this a blank space
				// 60%
				} else {
					map[row][col] = global.TYPE_BLANK;
					console.log('adding BLANK');
					this.addActor(new Actor(col, row, global.TYPE_BLANK, this));

				}
			}
		}
		this.map = map;
		// console.log(map);
		console.log(this.map);
		// console.log(this.actors);
		console.log('done setup');
	}

	// initialize an instance of the game
	initialize() {
		// Create a table of blank images, give each image an ID so we can reference it later
		let s = '<table class=stage>';
		// YOUR CODE GOES HERE

		for (let row = 0; row < this.height; row++) {
			s += "<tr>";
			for (let col = 0; col < this.width; col++) {


				// add the player if center
				if (row == this.centerY && col == this.centerX) {
					this.player = new Player(col, row, this);
					this.addActor(this.player);
					s += "<td> <img id=" + col + "," + row + " src=" + this.playerImageSrc + " /> </td>";


				} else {

					var decision = Math.random() * 100;

					// is this a wall?
					if (row == 0 || col == 0 || row == this.height - 1 || col == this.width - 1) {
						this.addActor(new Actor(col, row, global.TYPE_WALL, this));
						s += "<td> <img id=" + col + "," + row + " src=" + this.wallImageSrc + " width=24 height=24 /> </td>";

					// is this a monster?
					// 2%
					} else if (decision < 2) {
						this.addActor(new Monster(col, row, this, global.DELAY_REG_MONSTER));
						s += "<td> <img id=" + col + "," + row + " src=" + this.monsterImageSrc + " /> </td>";

						// is this a box?
						// 38%
					} else if (decision < 40) {
						this.addActor(new Box(col, row, this));
						s += "<td> <img id=" + col + "," + row + " src=" + this.boxImageSrc + " /> </td>";

					// blank space
					// 60%
					} else {
						this.addActor(new Actor(col, row, global.TYPE_BLANK, this));
						s += "<td> <img id=" + col + "," + row + " src=" + this.blankImageSrc +" /> </td>";
					}

				}

			}
			s += "</tr>";
		}


		s += "</table>";
		// Put it in the stageElementID (innerHTML)
		// document.getElementById(this.stageElementID).innerHTML = s;

	}

	// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
	getStageId(x, y) {
		 // row in table is y, col in table is x
		 return x + "," + y;
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	removeActor(actor) {
		// Lookup javascript array manipulation (indexOf and splice).
		this.actors.splice(this.actors.indexOf(actor), 1);
	}

	movePlayer(dx, dy) {


		// get the player actor
		// let stage = document.getElementById('stage');
		let player = this.getActor(this.player.getX(), this.player.getY());

		// call their move function
		player.move(dx, dy);
		this.player = player;
		return;


		// if into box -> check is pushable

		// if into monster -> ded

		// if into wall -> nothing
	}

	// Set the src of the image at stage location (x,y) to src
	setImage(x, y, src) {
		document.getElementById(this.getStageId(x, y)).src = src;
	}

	// Take one step in the animation of the game.
	// change the view in the table to reflect the coords of the actors
	step(time) {
		this.moveMonsters(time);
		this.updateMap();
	}

	moveMonsters(time) {
		// DEBUGww('running moveMonsters() method of Stage');

		// don't move monsters on each step
		if (time % 10 == 0) {

			for (let i = 0; i < this.actors.length; i++) {
				// DEBUGww('checking actor: ('+i+')');
				if (this.actors[i].type == global.TYPE_MONSTER) {

					// DEBUGww('WOW actor is a monster!');

					this.actors[i].checkIfBoxed();


					// random all direction movement
					// issue a move
					// get num 0-7
					let num = Math.floor(Math.random() * 7);

					switch (num) {
						case 0:
							this.actors[i].move(-1, -1);
							break;
						case 1:
							this.actors[i].move(0, -1);
							break;
						case 2:
							this.actors[i].move(1, -1);
							break;
						case 3:
							this.actors[i].move(-1, 0);
							break;
						case 4:
							this.actors[i].move(1, 0);
							break;
						case 5:
							this.actors[i].move(-1, 1);
							break;
						case 6:
							this.actors[i].move(0, 1);
							break;
						case 7:
							this.actors[i].move(1, 1);
							break;
					}
				}
			}
		}
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	// there should be only one actor at (x,y)!
	getActor(x, y) {
		for (let i = 0; i < this.actors.length; i++) {
			if (this.actors[i].getX() == x && this.actors[i].getY() == y) {
				return this.actors[i];
			}
		}

  		return null;
	}


	// End Class Stage
}

class Actor {
	constructor(x, y, type, stage) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.stage = stage;
		this.movable = false;
	}



	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	getType() {
		return this.type;
	}

	getStage() {
		return this.stage;
	}

	setX(x) {
		this.x = x;
	}

	setY(y) {
		this.y = y;
	}

	setType(type) {
		this.type = type;
	}

	// return the actor in the specified direction
	checkDest(dx, dy) {
		let actor = this.getStage().getActor(this.getX() + dx, this.getY() + dy);

		return actor;
	}

	move(dx, dy) {
		console.log("Unimplemented \'abstract\' method");
	}
}

class Player extends Actor {
	constructor(x, y, stage, playerId) {
		super(x, y, global.TYPE_PLAYER, stage);
		this.playerId = playerId;
		this.movable = true;
	}

	move(dx, dy) {

		// DEBUGww('in Player move(dx, dy)');

		if (!this.movable) {
			console.log('NOT MOVABLE !');
			return;
		}

		// disregard 0,0 moves for now
		if (dx == 0 && dy == 0) {
			return;
		}

		// check dir
		let destActor = this.checkDest(dx, dy);

		// console.log('dest actor type is '+destActor.getType());

		// perform move based on type
		switch (destActor.getType()) {
			case global.TYPE_BLANK:
				// save start coords
				let oldX = this.getX();
				let oldY = this.getY();

				this.setX(destActor.getX());
				this.setY(destActor.getY());

				destActor.setX(oldX);
				destActor.setY(oldY);
				return true;
				break;

			case global.TYPE_MONSTER:
				// let sound = new Audio("sounds/player_die.m4a");
				// sound.play();

                DEBUGww('player moved into monster');
				this.movable = false;
				this.setType(global.TYPE_DECEASED);
				// this.stage.updateHighscore(global.username, this.stage.score);
				// stage.score = 0;
				break;

			case global.TYPE_BOX:
				// try to move the box
				let moved = this.getStage().getActor(this.getX() + dx, this.getY() + dy).move(dx, dy);
				// if moved, then move into blank
				if (moved) {
					this.move(dx, dy);
				}
				break;

			case global.TYPE_WALL:
				break;
		}
	}
}

class Box extends Actor {
	constructor(x, y, stage) {
		super(x, y, global.TYPE_BOX, stage);
		this.movable = true;
	}

	move(dx, dy) {

		if (!this.movable) {
			return;
		}


		// disregard 0,0 moves for now
		if (dx == 0 && dy == 0) {
			return;
		}

		// check dir
		let destActor = this.checkDest(dx, dy);

		// perform move based on type
		switch (destActor.getType()) {
			case global.TYPE_BLANK:
				// save start coords
				let oldX = this.getX();
				let oldY = this.getY();

				this.setX(destActor.getX());
				this.setY(destActor.getY());

				destActor.setX(oldX);
				destActor.setY(oldY);
				return true;

			case global.TYPE_MONSTER:
				return false;
				break;

			case global.TYPE_BOX:
				// try to move the box
				let moved = destActor.move(dx, dy);
				// if moved, then move into blank
				if (moved) {
					this.move(dx, dy);
					return true;
				}
				break;

			case global.TYPE_WALL:
				return false;
				break;
		}
	}
}

class Monster extends Actor {
	constructor(x, y, stage, delay) {
		super(x, y, global.TYPE_MONSTER, stage);
		this.delay = delay;
		this.counter = delay;
		this.movable = true;
	}

	move(dx, dy) {

		if (!this.movable) {
			return;
		}

		// don't move if it's not my time to
		this.counter--;
		if (this.counter > 0) {
			return;
		}
		if (this.counter < 0) {
			this.counter = this.delay;
		}

		// disregard 0,0 moves for now
		if (dx == 0 && dy == 0) {
			return;
		}

		// check dir
		let destActor = this.checkDest(dx, dy);

		// perform move based on type
		switch (destActor.getType()) {
			case global.TYPE_BLANK:
				// console.log('moving monster to blank ('+destActor.getX()+', '+destActor.getY()+')');
				// save start coords
				let oldX = this.getX();
				let oldY = this.getY();

				this.setX(destActor.getX());
				this.setY(destActor.getY());

				destActor.setX(oldX);
				destActor.setY(oldY);
				this.counter = this.delay;
				return true;

			case global.TYPE_MONSTER:
				return false;
				break;

			case global.TYPE_BOX:
				return false;
				break;

			case global.TYPE_WALL:
				return false;
				break;

			case global.TYPE_PLAYER:
				// let sound = new Audio("sounds/player_die.m4a");
				// sound.play();

                DEBUGww('monster moved into player');
				destActor.movable = false;
				destActor.setType(global.TYPE_DECEASED);
				//this.stage.updateHighscore(global.username, this.stage.score);
				// stage.score = 0;
				return false;
				break;
		}
	}

	checkIfBoxed() {
		// TODO find way to simplify
		let nw = this.checkDest(-1, -1).getType();
		let n = this.checkDest(0, -1).getType();
		let ne = this.checkDest(1, -1).getType();

		let w = this.checkDest(-1, 0).getType();
		let e = this.checkDest(1, 0).getType();

		let sw = this.checkDest(-1, 1).getType();
		let s = this.checkDest(0, 1).getType();
		let se = this.checkDest(1, 1).getType();

		if ((nw == global.TYPE_BOX || nw == global.TYPE_WALL) &&
				(n == global.TYPE_BOX || n == global.TYPE_WALL) &&
				(ne == global.TYPE_BOX || ne == global.TYPE_WALL) &&

				(w == global.TYPE_BOX || w == global.TYPE_WALL) &&
				(e == global.TYPE_BOX || e == global.TYPE_WALL) &&

				(sw == global.TYPE_BOX || sw == global.TYPE_WALL) &&
				(s == global.TYPE_BOX || s == global.TYPE_WALL) &&
				(se == global.TYPE_BOX || se == global.TYPE_WALL)) {
			this.setType(global.TYPE_BLANK);
			// let sound = new Audio("sounds/monster_die.m4a");
			// sound.play();
			//stage.score += 200;
		}
	}
}

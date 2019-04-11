require('./static_files/lib/constants.js');

function DEBUGgameServer(msg) {
    console.log('++++ (GAME SERVER) ++++ ' + msg + ' ++++');
}

var STAGE = require('./static_files/lib/ww.js');
var Stage = new STAGE(20, 20);
var time = 0;
Stage.setup();

setInterval(tick, 100);

function tick() {
    time++;

    // modify interval to change update speed
    let interval = 2;
    if (time % interval == 0) {
        if (time % 20 == 0) {
            console.log('tick! '+time);
        }

        Stage.step(time);

        var msg = {};
        msg['action'] = 'updateMap';
        msg['mapId'] = 0;
        msg['mapHeight'] = Stage.height;
        msg['mapWidth'] = Stage.width;
        msg['map'] = Stage.map;
        msg['time'] = time;

        var msgStr = JSON.stringify(msg);

        wss.broadcast(msgStr);
    }
}

function findPlayer(mapLists, playerId) {
    for (let row = 0; row < mapLists.length; row++) {

        // if the player is in this row
        var ind = mapLists[row].indexOf(playerId);
        if (ind != -1) {
            return {'x': ind, 'y': row};
        }
    }
    return -1;
}

//import Stage from './ww.js';

// console.log(ww.TYPE_WALL);


var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: global.wwWsPort});

DEBUGgameServer('listening on port '+global.wwWsPort+'!');

// var stage = new Stage(30, 30);

var messages=[];

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(msgStr){
    // DEBUGgameServer('broadcasting msg ('+JSON.parse(msgStr)['action']+')');
	for(let ws of this.clients){
        if (ws.readyState === ws.OPEN) {
		     ws.send(msgStr);
        }
	}

	// Alternatively
	// this.clients.forEach(function (ws){ ws.send(message); });
}

var dirToDelta = {
    'Q': {
        x: -1, y: -1
    },
    'W': {
        x: 0, y: -1
    },
    'E': {
        x: 1, y: -1
    },


    'A': {
        x: -1, y: 0
    },
    'S': {
        x: 0, y: 0
    },
    'D': {
        x: 1, y: 0
    },


    'Z': {
        x: -1, y: 1
    },
    'X': {
        x: 0, y: 1
    },
    'C': {
        x: 1, y: 1
    }
};

function doReceivedMove(msgJSON) {
    let id = msgJSON.playerId;
    let dir = msgJSON.dir;
    DEBUGgameServer('moving player ('+id+') in dir ('+dir+')');
    let jsonFound = Stage.findPlayer(id);
    if (jsonFound) {
        let player = jsonFound.playerActor;
        player.move(dirToDelta[dir].x, dirToDelta[dir].y);
    }
}

wss.on('connection', function(ws) {
	var i;
	for(i=0;i<messages.length;i++){
        if (ws.readyState === ws.OPEN) {
		      ws.send(messages[i]);
        }
	}
	ws.on('message', function(msgStr) {
		DEBUGgameServer('received msg: '+msgStr);
		// ws.send(message);
        // DEBUGgameServer('broadcasting msg: '+msgStr);
		wss.broadcast(msgStr);
		// messages.push(msgStr); // TODO this was commented out because not necessary

        let msgJSON = JSON.parse(msgStr);

        switch (msgJSON.action) {
            case 'movePlayer':
                console.log('game server in movePLayer case');
                doReceivedMove(msgJSON);
                break;

            case 'enterGame':

                DEBUGgameServer('user ('+msgJSON.playerId+') entering game');
                Stage.insertPlayer(msgJSON['playerId']);
                break;

            case 'leaveGame':

                DEBUGgameServer('user ('+msgJSON.playerId+') leaving game');
                Stage.removePlayer(msgJSON['playerId']);
                break;

            default:
                DEBUGgameServer('unprocessed action: '+msgJSON.action);
                break;
        }
	});
});

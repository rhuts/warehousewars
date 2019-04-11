function DEBUGclient(msg) {
    console.log('---- (CLIENT) ---- ' + msg + ' ----');
}


function sendMoveMsg(dir) {
    console.log(dir+' pressed');
    var msg = {
        'action': 'movePlayer',
        'playerId': global.username,
        'dir': dir
    };
    var msgStr = JSON.stringify(msg);
    if (socket.readyState === socket.OPEN) {
        socket.send(msgStr);
    }
}

$(document).keydown(function(e) {

    // autoplaySoundtrack();

    switch (e.which) {
        case 81:
            sendMoveMsg('Q');
            break;
        case 87:
            sendMoveMsg('W');
            break;
        case 69:
            sendMoveMsg('E');
            break;


        case 65:
            sendMoveMsg('A');
            break;
        case 83:
            sendMoveMsg('S');
            break;
        case 68:
            sendMoveMsg('D');
            break;


        case 90:
            sendMoveMsg('Z');
            break;
        case 88:
            sendMoveMsg('X');
            break;
        case 67:
            sendMoveMsg('C');
            break;
        }
});

function parseMapLists(mapLists) {
    // console.log('in parseMapLists');
    // console.log(mapLists[0][0]);

    let s = '<table class=stageTable>';
    // YOUR CODE GOES HERE

    for (let row = 0; row < mapLists.length; row++) {
        s += '<tr>';
        for (let col = 0; col < mapLists[0].length; col++) {
            // console.log('iteration in parseMapLists');
            let id = mapLists[row][col];
            switch (true) {

                case (id == global.TYPE_WALL):
                    // s += '<td> '+global.TYPE_WALL+' </td>';
                    s += '<td> <img src="images/wallHD.gif" id="blankImage" width="32px" height="32px" /> </td>';
                    break;

                case (id == global.TYPE_MONSTER):
                    // s += '<td> '+global.TYPE_MONSTER+' </td>';
                    // s += '<td> '+'@@'+' </td>';
                    s += '<td> <img src="images/enemyZucHD.png" id="blankImage" width="32px" height="32px" /> </td>';
                    break;

                case (id == global.TYPE_BOX):
                    // s += '<td> '+global.TYPE_BOX+' </td>';
                    s += '<td> <img src="images/boxHD.png" id="blankImage" width="32px" height="32px" /> </td>';
                    break;

                case (id == global.TYPE_BLANK):
                    // s += '<td> '+global.TYPE_BOX+' </td>';
                    s += '<td> <img src="images/blankHD.png" id="blankImage" width="32px" height="32px" /> </td>';
                    break;

                // highlight player if id matches my username
                case (id == global.username):
                // DEBUGclient('id == global.username '+global.username);
                    s += '<td> <img src="images/myAngFaceHD.png" id="blankImage" width="32px" height="32px" /> </td>';
                    break;

                // // some other INT
                // case (!isNaN(id) && (parseFloat(id) | 0) === parseFloat(id)):
                //     DEBUGclient('('+id+') is some other INT');
                //     break;

                // other player
                default:
                    // s += '<td> '+global.TYPE_BLANK+' </td>';
                    s += '<td> <img src="images/angFaceHD.png" id="blankImage" width="32px" height="32px" /> </td>';
            }
        }
        s += '</tr>';
    }
    s += '</table>';
    return s;

}

function setupSocket() {

    // socket = new WebSocket("ws://cslinux.utm.utoronto.ca:10001");
    socket = new WebSocket(global.wwWsURL);
    socket.onopen = function (event) {
        $('#sendButton').removeAttr('disabled');
        console.log("connected");
    };
    socket.onclose = function (event) {

        var msg = {};
        msg['action'] = 'leaveGame';
        msg['playerId'] = global.username;

        var msgStr = JSON.stringify(msg);
        socket.send(msgStr);

        alert("closed code:" + event.code + " reason:" +event.reason + " wasClean:"+event.wasClean);

    };
    socket.onmessage = function (event) {
        // DEBUGclient('received msg from game server: '+event.data);

        var msgJSON = JSON.parse(event.data);
        // DEBUGclient('received msg from game server');
        // console.log(msgJSON);

        switch (msgJSON.action) {
            case 'updateMap':
                // console.log('updateMap mapId ('+msgJSON['mapId']+') time ('+msgJSON['time']+')');
                // console.log(msgJSON['map']);

                // window.getElementById('root').innerHTML = 'Hello';
                // var table = '<table><tr></td>Hi</td></tr></table>'
                $('#stage').html(parseMapLists(msgJSON['map']));
                // console.log(parseMapLists(msgJSON['map']));
                // $('#stage').html(table);

                break;
        }
    }
        // var context = document.getElementById('theCanvas').getContext('2d');
        // context.fillStyle = 'rgba(255,0,0,1)';
        // context.fillRect(point.x, point.y, 2, 2);


    // $('#theCanvas').mousemove(function(event){
    // 	var x=event.pageX-this.offsetLeft;
    // 	var y=event.pageY-this.offsetTop;
    // 	socket.send(JSON.stringify({ 'x': x, 'y': y} ));
    // });

    DEBUGclient('done setting up socket');

    return socket;
}


function registerAccount(username, password, callBack) {

    let data = {
        uname: username,
        pw: password
    };

    $.ajax({
        type: 'POST',
        url: '/api/register',
        data: data
    })
    .done(function(data) {
        DEBUGclient('register call successful, here is data: '+data);

        // tell content to do something
        callBack(data['registered']);

        // return data['registered'];
    })
    .fail(function(jqXhr) {
        DEBUGclient('register failed');
    });

}


function loginAccount(username, password, callBack) {

    // make RESTFUL API call to verify login of a user
    let data = {
        uname: username,
        pw: password
    };

    $.ajax({
        type: 'POST',
        url: '/api/login',
        data: data
    })
    .done(function(data) {
        DEBUGclient('login call successful, here is data: '+data);

        // tell content to do something
        callBack(data['verified']);

        // return data['registered'];
    })
    .fail(function(jqXhr) {
        DEBUGclient('login failed');
    });
}

function getTopTen(callBack) {

    $.ajax({
        type: 'GET',
        url: '/api/top10'
    })
    .done(function(topScores) {
        callBack(topScores);
    })
    .fail(function(jqXhr) {
        DEBUGclient('getting all top ten failed');
    });
}

function getUserTopTen(user, callBack) {

    let data = {
        uname: user
    };

    $.ajax({
        type: 'GET',
        url: '/api/usertop10',
        data: data
    })
    .done(function(userTopTen) {
        callBack(userTopTen);
    })
    .fail(function(jqXhr) {
        DEBUGclient('getting user top ten failed');
    });
}

function changeUsername(currUname, newUname, callBack) {

    DEBUGclient('in client.sj change username AJAX call');

    let data = {
        olduname: currUname,
        newuname: newUname
    };

    $.ajax({
        type: 'POST',
        url: '/api/changeusername',
        data: data
    })
    .done(function(response) {
        DEBUGclient('changing username success!');
        callBack(response);
    })
    .fail(function(jqXhr) {
        DEBUGclient('changing username failed');
    });
}

function changePassword(currUname, newPassword, callBack) {

    DEBUGclient('in client.sj change password AJAX call');

    let data = {
        uname: currUname,
        newpw: newPassword
    };

    $.ajax({
            type: 'POST',
            url: '/api/changepassword',
            data: data
    })
    .done(function(response) {
        callBack(response);
        DEBUGclient('changing password succeeded!');
    })
    .fail(function(jqXhr) {
        DEBUGclient('changing password failed');
    });

}

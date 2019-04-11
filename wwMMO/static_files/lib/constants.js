global.wwPort = 10510; // CHANGE ME


global.wwWsPort = global.wwPort+1; // for websockets DON'T CHANGE
global.wwHostname = "cslinux.utm.utoronto.ca"; // DON'T CHANGE
// global.wwHostname = "localhost"; // CHANGE ME
// global.wwHostname = "dh2020pc05.utm.utoronto.ca";
global.wwWsURL = "ws://"+global.wwHostname+":"+global.wwWsPort; // DON'T CHANGE


// FOR MONGO DATABASE
global.wwUtorid = '<redacted>';
global.wwPassword = '<redacted>';
global.wwDbName = '<redacted>';
global.wwDbPort = '<redacted>';


// for WW GAME, PLEASE DON'T CHANGE THIS ARNOLD
global.TYPE_BLANK = 0;
global.TYPE_WALL = 1;
global.TYPE_MONSTER = 3;
global.TYPE_BOX = 4;
global.TYPE_DECEASED = 5;
global.TYPE_PLAYER = 6;
global.MIN_PLAYER_ID = 20;
global.DELAY_REG_MONSTER = 10;

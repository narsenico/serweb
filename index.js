var forever = require('forever');
var chalk = require('chalk');

var CMD_START = /^\-(s|\-start)$/;
var CMD_STOP = /^\-(q|\-quit|\-stop)$/;
var CMD_HELP = /^\-(h|\-help)$/;
//0: none, 1: err, 2: warn, 3: info, 4: debug
var LOGLEVEL = 4;

function debug() {
    if (LOGLEVEL >= 4)
        console.log(chalk.green.apply(chalk.greep, arguments));
}

function info() {
	if (LOGLEVEL >= 3)
    	console.log(chalk.yellow.apply(chalk.greep, arguments));
}

function warn() {
	if (LOGLEVEL >= 2)
    	console.log(chalk.magenta.apply(chalk.greep, arguments));
}

function error() {
	if (LOGLEVEL >= 1)
    	console.log(chalk.red.apply(chalk.greep, arguments));
}

function start() {
    // debug('start');
    var proc = forever.startDaemon('app.js');
    info('started process with pid', proc.pid);
}

function stop() {
    // debug('stop');
    forever.list(false, function(err, processes) {
        if (err) {
            error(err);
        } else {
            var curdir = process.env.PWD;
            var idx = processes ? processes.findIndex(function(proc) {
                return (proc && proc.spawnWith.env.PWD === curdir);
            }) : -1;
            if (idx >= 0) {
                info('stopping process with pid', processes[idx].pid);
                forever.stop(idx);
            } else {
                error('no process found in', curdir);
            }
        }
    });
}

function parseArgv(args) {
    for (var ii = 0; ii < args.length; ii++) {
        if (CMD_START.test(args[ii])) {
            start();
        } else if (CMD_STOP.test(args[ii])) {
            stop();
        } else if (CMD_HELP.test(args[ii])) {
            printHelp();
        }
    }
}

function printHelp() {
    //TODO
    console.log('help');
}

function exec() {
    if (process.argv && process.argv.length > 2) {
        parseArgv(process.argv.slice(2));
    } else {
        printHelp();
    }
}

//
exports.start = start;
exports.stop = stop;
exports.exec = exec;

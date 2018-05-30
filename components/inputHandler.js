const jsonfile = require('jsonfile');

/**
 * Handle the Slack user input to ex
 *
 * @param message the slack input
 * @return the command descriptor and the user arguments
 */
const handleInput = function (message) {

    // regexp to handle quoted parameters
    let regexp = /([^"]\S*|".+?")\s*/gm;

    let args = message.text.split(regexp)
        .filter(arg => arg) // remove non-true values
        .map(arg => arg.replace(/"/g, ""));

    let cmd = args.shift();

    let cmdFile;
    try {
        cmdFile = jsonfile.readFileSync('commands/' + cmd + '.json');
    } catch (error) {
        throw new Error("Unknown command : " + cmd);
    }

    if (cmdFile.nb_args !== args.length) {
        throw new Error("Wrong number of arguments : " + args.length + " provided, " + cmdFile.nb_args + " expected");
    }

    return {
        cmd: cmdFile,
        args: args
    };
};

exports.handle = handleInput;
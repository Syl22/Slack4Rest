const fs = require('fs');
const hp = require('./helpers');

/**
 * Build a Slack response from a successfull API call
 *
 * @param cmd user command descriptor
 * @param args user command arguments
 * @param apiBody API response body
 * @returns Slack response
 */
const buildOkResponse = function (cmd, args, apiBody) {
    return {
        text: hp.rAll(cmd.response.text, args, apiBody),
        attachments: [{
            title: hp.rAll(cmd.response.title, args, apiBody),
            fields: processCmdFields(cmd.response.fields, args, apiBody),
            color: "36a64f"
        }]
    };
};

/**
 * Build a Slack response from an error
 *
 * @param error description of the error
 * @returns a Slack response with the error
 */
const buildErrorResponse = function (error) {
    return {
        attachments: [{
            title: "An error occurred",
            text: error.message,
            color: "ff0000"
        }]
    };
};

/**
 * Build a Slack response with a user guide
 *
 * @returns the user guide
 */
const buildHelpResponse = function () {
    let commandString = "";
    fs.readdirSync("./commands/").forEach(file => {
        commandString = commandString + "- " + file.replace(/\.[^/.]+$/, "") + "\n";
    });

    return {
        attachments: [{
            color: "4682B4",
            text: "*Usage* : /cmd [command] [args...]\n"
            + "*Ajouter une commande* : http://slack4rest.istic.univ-rennes1.fr/ajoutcmd\n"
            + "*Commandes disponibles* :\n"
            + commandString
        }]
    }
};

/**
 * Turn key:value fields from command file into Slack fields
 *
 * @param fields user command fields
 * @param args user command arguments
 * @param apiBody API response body
 * @returns Slack fields to be included in a response
 */
function processCmdFields(fields, args, apiBody) {
    let res = [];
    for (let key in fields) {
        if (fields.hasOwnProperty(key)) {
            res.push({
                "title": hp.rAll(key, args, apiBody),
                "value": hp.rAll(fields[key], args, apiBody)
            });
        }
    }
    return res;
}


exports.error = buildErrorResponse;
exports.ok = buildOkResponse;
exports.help = buildHelpResponse;
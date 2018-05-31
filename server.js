const Botkit = require('botkit');
const request = require('request');
const upload = require('./form/upload');
const inputHandler = require('./components/inputHandler');
const reqBuilder = require('./components/requestBuilder');
const respBuilder = require('./components/responseBuilder');
const fs = require('fs');

const commandFolder = './commands/';

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

let config = {
    json_file_store: './db_slackbutton_slash_command/',
};

let controller = Botkit.slackbot(config).configureSlackApp(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        scopes: ['commands'],
    }
);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });
    upload();
});

controller.on('slash_command', function (bot, message) {

    if (message.command !== "/cmd") {
        bot.replyPrivate(message, respBuilder.error("I'm afraid I don't know how to " + message.command))
        return;
    }

    // make sure the token matches
    if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

    // if no text was supplied, treat it as a help command
    if (message.text === "" || message.text === "help") {
        let commandString = "";
        fs.readdirSync(commandFolder).forEach(file => {
            commandString = commandString + "- " + file.replace(/\.[^/.]+$/, "") + "\n";
        })

        bot.replyPrivate(message, "*Usage* : /cmd [command] [args...]\n"
        + "*Ajouter une commande* : http://slack4rest.istic.univ-rennes1.fr/ajoutcmd\n"
        + "*Commandes disponibles* :\n"
        + commandString);

        return;
    }

    let cmd, args, options;
    try {
        ({cmd, args} = inputHandler.handle(message));
        options = reqBuilder.build(cmd, args);
    } catch (error) {
        bot.replyPrivate(message, respBuilder.error(error));
        return;
    }

    request(options, function (err, res, body) {
        if (err !== null) {
            bot.replyPrivate(message, respBuilder.error(new Error("API error : " + err)));
        } else {
            bot.replyPrivate(message, respBuilder.ok(cmd, args, body));
        }
    });

});

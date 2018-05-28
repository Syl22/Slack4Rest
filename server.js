var Botkit = require('botkit');
var jsonfile = require('jsonfile');
var request = require('request');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
}

var config = {
    json_file_store: './db_slackbutton_slash_command/',
};

var controller = Botkit.slackbot(config).configureSlackApp(
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

});

controller.on('slash_command', function (bot, message) {

    if (message.command !== "/testv") {
        return;
    }

    // make sure the token matches
    if (message.token !== process.env.VERIFICATION_TOKEN) return; //just ignore it.

    // if no text was supplied, treat it as a help command
    if (message.text === "" || message.text === "help") {
        bot.replyPrivate(message, "help message");
        return;
    }

    let args = message.text.split(" ");
    let cmd = args.shift();

    let cmdFile = jsonfile.readFileSync('commands/' + cmd + '.json');

    // make the request
    let options = {
        method: cmdFile.request.method,
        uri: cmdFile.request.uri,
        qs: cmdFile.request.query_params
    };

    function replaceParams(str) {
        return str.replace(/\$([0-9])/g, (c, p1) => args[p1]);
    }

    function replaceResponse(str) {

    }

    request(options, function (err, res, body) {
        let reply = {
            attachments: [{
                title: replaceParams(cmdFile.response.title),
                fields: cmdFile.response.fields
            }]
        };

        bot.replyPrivate(message, reply);
    });

});

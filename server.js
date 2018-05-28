var Botkit = require('botkit');
var jsonfile = require('jsonfile');
var request = require('request');
var jp = require('jsonpath');

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

    function rParams(str) {
        return str.replace(/\$([0-9])/g, (c, p1) => args[p1]);
    }

    function rJson(str, obj) {
        return str.replace(/(\$\.[^ ]+)/g, (c, p1) => jp.query(obj, p1)[0]);
    }

    function rAll(str, json) {
        return rParams(rJson(str, json));
    }

    function mapObj(obj, func) {
        let res = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[func(key)] = func(obj[key]);
            }
        }
        return res;
    }

    function processFields(fields, json) {
        let res = [];
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                res.push({
                    "title": rAll(key, json),
                    "value": rAll(fields[key], json)
                });
            }
        }
        return res;
    }

    // TODO: paramètres avec espaces
    let args = message.text.split(" ");
    let cmd = args.shift();

    let cmdFile = jsonfile.readFileSync('commands/' + cmd + '.json');

    // make the request
    let options = {
        method: cmdFile.request.method,
        uri: cmdFile.request.uri,
        qs: mapObj(cmdFile.request.query_params, rParams),
        json: true
    };

    request(options, function (err, res, body) {
        let reply = {
            attachments: [{
                title: rAll(cmdFile.response.title),
                fields: processFields(cmdFile.response.fields, body)
            }]
        };

        bot.replyPrivate(message, reply);
    });

});

var Botkit = require('botkit');
var jsonfile = require('jsonfile');
var request = require('request');
var jp = require('jsonpath');
const upload = require('./upload');

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
	upload();
});

controller.on('slash_command', function (bot, message) {

    if (message.command !== "/cmd") {
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

    function replaceAll(str, search, replacement) {
            let target = str;
            return target.replace(new RegExp(search, 'g'), replacement);
    };

    // TODO: paramètres avec espaces
    //let args = message.text.split(" ");
    let regexp = /([^"]\S*|".+?")\s*/gm;
    let text = message.text;
    let args = text.split(regexp);
    args = args.filter(ch=>ch);
    for (var i = 0; i < args.length; i++) {
        args[i] = replaceAll(args[i], "\"", "");
    }
    let cmd = args.shift();

    let cmdFile = jsonfile.readFileSync('commands/' + cmd + '.json');

    // make the request
    let options = {
        method: cmdFile.request.method,
        uri: cmdFile.request.uri,
        qs: mapObj(cmdFile.request.query_params, rParams),
	qsStringifyOptions:{ allowDots: true },
        json: true
    };

    request(options, function (err, res, body) {
        let reply = {
            text: rAll(cmdFile.response.text, body),
            attachments: [{
                title: rAll(cmdFile.response.title, body),
                fields: processFields(cmdFile.response.fields, body)
            }]
        };

        bot.replyPrivate(message, reply);
    });

});

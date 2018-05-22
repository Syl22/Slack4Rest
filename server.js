var express = require('express');
var request = require('request');
var fs = require("fs");
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/coucou', function (req, res) {
	res.status(200).json({ text: "Coucou !" });
})

app.post('/bus', function (req, res) {
	var ligne = 'C4';
	if (req.body.text){
		ligne = req.body.text;
	}

	const options = {
		uri: 'https://data.explore.star.fr/api/records/1.0/search/',
		qs: {
			dataset:'tco-bus-circulation-passages-tr',
			refine:{
				nomcourtligne:ligne,
				nomarret:'Tournebride'
			},
			timezone:'Europe/Paris',
			rows:2,
			sort:'-arrivee',
			format:'json'
		},
		qsStringifyOptions:{ allowDots: true },
		json: true
	};

	request.get(options, function (error, response, body) {
		if (error != null){
			console.log('error:', error); // Print the error if one occurred
		}
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		var message = {};

		var time = new Date(body.records[0].fields.arrivee);
		message.text=("<!date^"+time.getTime()/1000+"^{time_secs}|"+time.toLocaleTimeString()+">");
        res.status(200).json(message);
	});
})

app.get('/test', function (req, res) {

	res.end("Hello le monde");

})

var server = app.listen(80, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

})

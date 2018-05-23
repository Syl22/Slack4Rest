var express = require('express');
var fs = require("fs");
var bodyParser = require('body-parser');
const busCommand = require('./busCommand');
const veloCommand = require('./veloCommand');
const alerteCommand = require('./alerteCommand');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/coucou', function (req, res) {
	res.status(200).json({ text: "Coucou !" });
})

app.post('/bus', function (req, res){
	busCommand(req, res);
});

app.post('/velo', function (req, res){
	veloCommand(req, res);
});	

app.post('/alerte', function (req, res){
	alerteCommand(req, res);
});	


app.get('/test', function (req, res) {

	res.end("Hello le monde");

})

var server = app.listen(80, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

})

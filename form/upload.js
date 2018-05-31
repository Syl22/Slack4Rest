var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

const upload = function upload (){
	http.createServer(function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	
	if (req.url == '/fileupload') {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			if(files.filetoupload.type.includes("json")){
				var oldpath = files.filetoupload.path;
				var newpath = '/home/projet/commands/' + files.filetoupload.name;
				fs.rename(oldpath, newpath, function (err) {
					if (err) throw err;
					res.write('Fichier bien recu!');
					res.end();
				});
			}
			else {
				res.write('Merci d\'envoyer un fichier json.');
				res.end();
			}
		});
		
		
	} else if (req.url == '/upload'){
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
		res.write('<h1>Envoyer un fichier json :</h1>');
		res.write('<input type="file" name="filetoupload"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
		
		
	} else if (req.url == '/ajoutcmd'){
		fs.readFile('form/index.html', function (err, html) {
			if (err) {
				throw err; 
				res.writeHead(404);
				res.write("Not Found!");
				return res.end();
			}       
			else {
				res.write(html);
				return res.end();
			}
		});
		
	
	
	} else if (/^\/[a-zA-Z0-9\/]*.(css|js)$/.test(req.url.toString())){
		sendFileContent(res, 'form/'+req.url.toString().substring(1), "text/css");	
		
		
		
	} else if (req.url == '/json' && req.method == 'POST'){
		var body = '';
		req.on('data', function (data) {
			body += data.toString();
		});
		req.on('end', function () {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end('Json received !');
			json = JSON.parse(body);
			console.log(json);
			if(json.command){
				console.log("ecriture");
				fs.writeFile('commands/'+json.command+'.json', body, function (err){
					if (err) throw err;
				});
			}
		});
		
	}
	}).listen(80);
	
	function sendFileContent(response, fileName, contentType){
		fs.readFile(fileName, function(err, data){
			if(err){
			response.writeHead(404);
			response.write("Not Found!");
			}
			else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
			}
			response.end();
		});
	}
}



module.exports = upload
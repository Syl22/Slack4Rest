var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

const upload = function upload (){
	http.createServer(function (req, res) {
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
	}
	}).listen(80);
}

module.exports = upload
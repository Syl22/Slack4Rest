var request = require('request');

const alerteCommand = function alerte (req, res) {
	var args = req.body.text.split(" ");
	if (req.body.text){
		var ligne = req.body.text;

		var options = {
			uri: 'https://data.explore.star.fr/api/records/1.0/search/',
			qs: {
				dataset:'tco-busmetro-trafic-alertes-tr',
				refine:{
					nomcourtligne:ligne,
				},
				timezone:'Europe/Paris',
				rows:6,
				//sort:'-arrivee',
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
			if(body.nhits == 0){
				var json_erreur = {
					attachments: [
					{
						fallback: "Pas d'alerte pour cette ligne.",
						color: "#ffcc66",
						title: "Pas d'alerte pour cette ligne."
					}
					]
				}
				res.status(200).json(json_erreur);
				return;
			}
			
			var fields=[];
			for(alert in body.records){
				fields.push({"title":body.records[alert].fields.titre,"value":body.records[alert].fields.description});
			}
			var json_reponse = {
				attachments: [
				{
					fallback: "Alertes",
					color: "#2E9AFE",
					title: "Alertes pour la ligne "+body.records[0].fields.nomcourtligne+" :\n",
					fields: fields
				}
				]
			}
			res.status(200).json(json_reponse);
		});
	}
	
	else {
		var json_erreur = {
			attachments: [
			{
				fallback: "Format de la commande : /alerte ligne ",
				color: "#ff0000",
				title: "Format de la commande : /alerte ligne"
			}
			]
		}
		res.status(200).json(json_erreur);
		return;
	}

}



module.exports = alerteCommand

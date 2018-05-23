var request = require('request');

const busCommand = function bus (req, res) {
	var args = req.body.text.split(" ");
	if (args[1]){
		var ligne = args[0];
		var arret = req.body.text.substring(req.body.text.indexOf(args[1]));

		var options = {
			uri: 'https://data.explore.star.fr/api/records/1.0/search/',
			qs: {
				dataset:'tco-bus-circulation-passages-tr',
				refine:{
					nomcourtligne:ligne,
					nomarret:arret
				},
				timezone:'Europe/Paris',
				rows:6,
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
			if(body.nhits == 0){
				var json_erreur = {
					attachments: [
					{
						fallback: "Mauvaise entrée ou aucuns bus dans les trois prochaines heures.",
						color: "#ffcc66",
						title: "Mauvaise entrée ou aucuns bus dans les trois prochaines heures."
					}
					]
				}
				res.status(200).json(json_erreur);
				return;
			}

			
			horaires = parseHoraires(body);
			
			var fields=[];
			for (dest in horaires.dests){
				var value="";
				for (heure in horaires.dests[dest].heures){
					value += (prettyDate(horaires.dests[dest].heures[heure]) + " | ");
				}
				value=value.slice(0,-3);
				fields.push({"title": "vers " + horaires.dests[dest].nom + " :", "value": value, "short": false})
			}
			
			var json_reponse = {
				attachments: [
				{
					fallback: "Horaires",
					color: "#2E9AFE",
					title: "Horaires de la ligne "+body.records[0].fields.nomcourtligne+" à l'arrêt "+body.records[0].fields.nomarret+" :\n",
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
				fallback: "Format de la commande : /bus ligne arrêt",
				color: "#ff0000",
				title: "Format de la commande : /bus ligne arrêt"
			}
			]
		}
		res.status(200).json(json_erreur);
		return;
	}

}

function parseHoraires(json){
	var jsonForme={"dests":[]};
	for (var record in json.records){
		var trouve = false;
		for (var dest in jsonForme.dests){
			if (json.records[record].fields.destination == jsonForme.dests[dest].nom){
				jsonForme.dests[dest].heures.push(json.records[record].fields.arrivee);
				trouve = true;
				break;
			}
		}
		if(!trouve){
			jsonForme.dests.push({"nom":json.records[record].fields.destination,"heures":[json.records[record].fields.arrivee]});
		}
	}
	return jsonForme;
}

function prettyDate(date){
	var time = new Date(date);
	return "<!date^"+time.getTime()/1000+"^{time}|"+time.toLocaleTimeString()+">"
}

module.exports = busCommand
var request = require('request');

const veloCommand = function bus (req, res) {
	if (req.body.text){
		var station = req.body.text;
		
		var options = {
			uri: 'https://data.explore.star.fr/api/records/1.0/search/',
			qs: {
				dataset:'vls-stations-etat-tr',
				refine:{
					nom:station
				},
				timezone:'Europe/Paris',
				rows:2,
				sort:'-nom',
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
						fallback: "Mauvaise entrée. Cette station n'existe pas.",
						color: "#ffcc66",
						title: "Mauvaise entrée. Cette station n'existe pas."
					}
					]
				}
				res.status(200).json(json_erreur);
				return;
			}
			
			var json_reponse = {
			attachments: [
				{
					fallback: "Vélos",
					color: "#2E9AFE",
					title: "Station véloSTAR "+body.records[0].fields.nom+" :\n",
					fields: [
						{"title": "Vélos disponibles : ", "value": body.records[0].fields.nombrevelosdisponibles, "short": true},
						{"title": "Emplacements disponibles : ", "value": body.records[0].fields.nombreemplacementsdisponibles, "short": true}
					]
				}
				]
			}
			res.status(200).json(json_reponse);
		});
	}
}

module.exports = veloCommand
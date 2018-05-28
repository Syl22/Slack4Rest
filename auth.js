const auth = function auth (req, res) {
	res.redirect('https://slack.com/oauth/authorize?client_id=348459398101.359438031906&scope=commands')

}


module.exports = auth
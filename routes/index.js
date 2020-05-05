var express = require('express');

module.exports = function (app) {

	app.get('/', function (req, res) {
		res.render('index');
	});

	app.get('/sw.js', function(req, res) {
		res.sendFile(path.resolve(__dirname, '/', 'sw.js'));
	})
}

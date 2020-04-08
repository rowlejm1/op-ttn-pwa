var express = require('express');

module.exports = function (app) {

	app.get('/contact', function (req, res) {
		res.render('contact');
	});
}

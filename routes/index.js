var express = require('express');
var cors = require('cors');

module.exports = function (app) {

	app.get('/', function (req, res) {
		res.render('index');
	});
}

var express = require('express');
var app = express();
var port = process.env.port || 1337
/*app.get('/', function(req, res){
	res.send("Hello " + req.query.name + " from server.js!");
});*/

app.use(express.static(__dirname + "/public"));

console.log('Server running on port', port);

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;
});
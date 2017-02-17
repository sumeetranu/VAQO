var express = require('express');
var app = express();
var port = process.env.port || 1337
var tedious = require('tedious');
/*app.get('/', function(req, res){
res.send("Hello " + req.query.name + " from server.js!");
});*/

app.use(express.static(__dirname + "/public"));

console.log('Server running on port', port);

var server = app.listen(port, function() {
var host = server.address().address;
var port = server.address().port;
});

var Connection = tedious.Connection;
var config = {
userName: 'vaqo',
password:'cbdnsr17!',
server:'vaqosql.database.windows.net',
options:{encrypt:true, database:'TestDB'}
};


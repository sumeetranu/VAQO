var express = require('express');
var app = express();
var port = process.env.port || 1337
var tedious = require('tedious');
/*app.get('/', function(req, res){
	res.send("Hello " + req.query.name + " from server.js!");
});*/

app.use(express.static(__dirname + "/public"));

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;
});

console.log('Server running on port', port);

// Connect to the Database
// TODO: Maybe need to close the database too? Need to investigate.
var Connection = tedious.Connection;
var config = {
	userName: 'vaqo',
	password:'cbdnsr17!',
	server:'vaqosql.database.windows.net',
	options:{encrypt:true, database:'TestDB'}
};

var connection = new Connection(config);
connection.on('connect', function (err) {
	if (err) return console.error(err);
	console.log('Connected to the database.');
	
});

// Set up the /query route
app.get('/queryDatabase', function(req, res){
	var statement = req.query.queryString;
	var Request = tedious.Request;

	request = new Request(statement, function(err, rowcount) {  
		if (err) {  
			console.log('Error: ' + err);
		} else {
			console.log('Successfully retrieved ', rowcount, ' rows.');
		}  
	});  
	var result = "";  //TODO: Change this to be a list [] of objects {} and then in the loop, add to the object
	// Note: The above advice might not work. If you have issues with it, let me know.
	request.on('row', function(columns) {  
		columns.forEach(function(column) {  
			console.log(column);
			if (column.value === null) {  
			console.log('NULL');  
			} else {  
			result+= column.value + " ";  
			}  
		});  
	});  

	request.on('doneProc', function() {  
		console.log('Result:', result);
		res.send(result);
	});  
	connection.execSql(request);  
});






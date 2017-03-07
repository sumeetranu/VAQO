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
	dataDictionary = [];  
	dataResults = {dataColumns:"", valueDictionary:""};

	request = new Request(statement, function(err, rowCount) {  
		if (err) {  
			console.log('Error: ' + err);
		} else {
			//Add query result and column names to json object.
			//Remove extra spaces in column names and remove empty column nodes created by split.
			dataResults["dataColumns"] = dataResults["dataColumns"].split(" ");
			dataResults["dataColumns"] = dataResults["dataColumns"].filter(Boolean)
			dataResults["valueDictionary"] = dataDictionary;

			//Send data back to directives.
			res.send(dataResults);
		}  

	});

	request.on('row', function(columns) {  
	temp = {};
		columns.forEach(function(column) {
			//Check if data column already exist
			if(!dataResults["dataColumns"].includes(column.metadata.colName)) 
			{
				dataResults["dataColumns"] += column.metadata.colName + " ";
			}
			//Convert all data into string
			//Remove white spaces from data
			var tempVar = String(column.value);
			tempVar = tempVar.replace(/\s+/g, '');

			temp[column.metadata.colName] = tempVar;
		});  
		//Push temp object into dictionary object
		dataDictionary.push(temp);
	});

	connection.execSql(request);  
});






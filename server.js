var express = require('express');
var app = express();
var port = process.env.port || 1337
var tedious = require('tedious');
var ConnectionPool = require('tedious-connection-pool');

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
var config = {
	userName: 'vaqo',
	password:'cbdnsr17!',
	server:'vaqosql.database.windows.net',
	options:{encrypt:true, database:'TestDB'}
};

var pool = new ConnectionPool({max: 10, log:true},config);
pool.on('connect', function (err) {
	if (err) return console.error(err);
	console.log('Connected to the database.');
});

// Set up the /query route
app.get('/queryDatabase', function(req, res){
	pool.acquire(function(err,connection) {

		if(err) {
			console.error(err);
			return;
		}
		var statement = req.query.queryString;
		var Request = tedious.Request;
		dataDictionary = [];  
		dataResults = {dataColumns:"", valueDictionary:""};

		request = new Request(statement, function(err, rowCount) {  
			if (err) {  
				var tempErr = {};
				tempErr["QueryError!!!"] = String(err.message);
				dataDictionary.push(tempErr);
				dataResults["dataColumns"] += "QueryError!!!";
				dataResults["dataColumns"] = dataResults["dataColumns"].split(" ");
				dataResults["dataColumns"] = dataResults["dataColumns"].filter(Boolean);
				dataResults["valueDictionary"] = dataDictionary;
				res.send(dataResults);
			} else {
				//Add query result and column names to json object.
				//Remove extra spaces in column names and remove empty column nodes created by split.
				dataResults["dataColumns"] = dataResults["dataColumns"].split(" ");
				dataResults["dataColumns"] = dataResults["dataColumns"].filter(Boolean);
				dataResults["valueDictionary"] = dataDictionary;

				connection.release();
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
	})
});

function getTableInfo(sql,tableDone) {
	pool.acquire(function(err,connection) {
		var statement = sql;
		var Request = tedious.Request;
		var tableDictionary = [];  
		tableResults = {schemaColumns:"", schemaValueDictionary:""};
		tableInfoRequest = new Request(statement, function(err, rowCount) {  
			if (err) {  
				tableDone(err);
			}else{
				connection.release();
				tableDone(null,tableDictionary);
			}
		});

		tableInfoRequest.on('row', function(columns) {  
			tempSchema = {};
			columns.forEach(function(column) {
				//Check if data column already exist
				if(!tableResults["schemaColumns"].includes(column.metadata.colName)) 
				{
					tableResults["schemaColumns"] += String(column.metadata.colName) + " ";
				}
				var tempTableVar = String(column.value);
				tempTableVar = tempTableVar.replace(/\s+/g, '');

				tempSchema[column.metadata.colName] = tempTableVar;
			});  
			//Push temp object into dictionary object
			tableDictionary.push(tempSchema);
		});
		connection.execSql(tableInfoRequest);  
	})
}

function getTables(done) {
	pool.acquire(function(err,connection) {
		var Request = tedious.Request;
		var schemaStatement = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE';";
		tableNamesDictionary = [];

		tableNameRequest = new Request(schemaStatement, function(err, rowCount) {  
			if (err) {  
				console.log(err);
			} else {
				setTimeout(function() {
					connection.release();
					done(null,tableNamesDictionary[0]);
				}, 3000);
			}
		});

		tableNameRequest.on('row', function(columns) {  
			tempTable = {};
			columns.forEach(function(column) {
				//Check if data column already exist
				if(column.metadata.colName == "TABLE_NAME") 
				{
					var tableName = String(column.value);
					var tempTableResult = {data:"Data stuff"};
					var tableQuery = "Select COLUMN_NAME, DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='" + tableName + "';";
					getTableInfo(tableQuery, function(err,tableSchema){
						if(err) {console.log(err)};
						tempTable[tableName] = tableSchema;
					});
				}
			});
			setTimeout(function() {
				tableNamesDictionary.push(tempTable); 
			}, 2000); 
		});
		connection.execSql(tableNameRequest);  
	})
};

app.get('/getDBSchema', function(req,res,next){
	getTables(function(err,myTables) {
		if(err) {return next(err)};
		res.myTables = myTables;
		next();
	});
});

app.get('/getDBSchema', function(req,res) {
	setTimeout(function() {
		res.send(res.myTables);
	}, 1000);
});


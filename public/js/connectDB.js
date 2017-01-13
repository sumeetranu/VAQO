/*Code for connecting to database*/
var express = require('express');
var mySQL = require('mysql')
var app = express();


var hostVal;
var userVal;
var passwordVal;
var dbVal;

//initial creation of funciton
//Should asks users for input on database information
function getInfo(){
	hostVal = 'localhost';
	userVal = 'root';
	password = 'password';
	database = 'test';
};

//Establish the connection
var dbConnection = mySQL.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'test',
	port: 3306
});

//Test connection
dbConnection.connect(function(error) {
	if(error) {
		console.log('Error: ' + error.stack);
	} else {
		console.log('Connected');
	}
});

//Initial querying.
dbConnection.query("SELECT * FROM new_table", function(error, rows, fields){
	//callback
	if(error){
		console.log('Error in query!');
	} else {
		console.log('Success!\n');
		console.log(rows);
	}
});
dbConnection.end();

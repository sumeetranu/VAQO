var tedious = require('tedious');


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
});

var Request = tedious.Request;
var TYPES = tedious.TYPES;

function queryStatement(query) {  
    request = new Request(query, function(err, rowcount) {  
        if (err) {  
        console.log('Error: ' + err);
    }});  

    var result = "";  

    request.on('row', function(columns) {  
     columns.forEach(function(column) {  
        if (column.value === null) {  
            console.log('NULL');  
        } else {  
            result+= column.value + " ";  
        }});  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {
        console.log(rowCount + ' rows returned');
    });

    connection.execSql(request);
}
//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
require('env2')('.env'); // loads all entries into process.env

// Setting Base directory
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
var dbConfig = {
    user:  process.env.AzureSQLUserName,
    password: process.env.AzureSQLPassword,
    server: process.env.AzureSQLServer,
	connectionTimeout: 300000,
	idleTimeoutMillis: 300000,
	requestTimeout: 300000,
	options: 
	{
	   database: process.env.AzureSQLDatabase 
	   , encrypt: true
	}
};

//Function to connect to database and execute query
var  executeQuery = function(res, query){
	console.log(JSON.stringify(dbConfig));
	sql.connect(dbConfig, function (err) {
		if (err) {   
			console.log("Error while connecting database :- " + err);
			res.send(err);
		}
		else {
			// create Request object
			var request = new sql.Request();
			// query to the database
			request.query(query, function (err, recordset) {
				if (err) {
					console.log("Error while querying database :- " + err);
					res.send(err);
				}
				else {
					console.log(JSON.stringify(recordset));
					res.send(JSON.stringify(recordset));
				}
			});
		}
	});	
};

app.get("/api/feedback", function(req , res){
	var query = "select * from ["+process.env.AzureSQLDatabase+"].[dbo].["+process.env.AzureSQLDBTable+"]";
	executeQuery (res, query);
});

//Import Packages and File Dependencies
var app = require('../app');
var http = require('http');

//Store Mongoose to Global to avoid extra memory usage per api call
global.mongoose = require('mongoose');
//Initiate MongoDB COnnection with connection string from environment variable
global.mongoose.connect(process.env.MONGO_URL);
//If we errored connecting to MongoDB, write error to the console and shutdown program as it is required to function
global.mongoose.connection.on('error', function(err) {
    console.error(err);
    process.exit(1);
});

//Store a MongoDB Instance apart from MongoClient and connect using the connection string from environment variable
var mongodb = global.mongoose.mongo.MongoClient;
mongodb.connect(process.env.MONGO_URL, function(err, db) {
    //If we errored connecting to MongoDB, write error to the console and shutdown program as it is required to function
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        //Store our database globally
        global.db = db;
    }
});

//Get port from environment variable and store in Express
var port = JSON.parse(process.env.PORT); //Here I'm using JSON.parse because of the way Windows handles environement variables as strings
app.set('port', port);

//Create HTTP server listening on our port
var server = http.createServer(app);
server.listen(port);
server.on('error', function(error) {
    //Check if error is a syscall
    if (error.syscall !== 'listen') {
        throw error;
    }
    //Check if the error is one of the known errors that we can catch and handle
    switch (error.code) {
        case 'EACCESS':
            console.error('Requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error('Port already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
//Debug print
server.on('listening', function() {
    console.info('Listening on ' + port);
});
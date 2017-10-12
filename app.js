//Import Packages and File Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Import our Express route file for X resource
var patient = require('./routes/patient');
var contract = require('./routes/contract');
var auditEvent = require('./routes/audit');

//Tell express we're using body-parser as a middlware
app.use(bodyParser.json());
//Allows for URL-Encoded Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./dist'));

//Define what URL our resources will be on http://baseurl:port
app.use('/api/patient', patient);
app.use('/api.contract', contract);
app.use('/api/audit', auditEvent);

//If the incoming url does not match any of the routes above, it will fall into this catch and return a 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Development error handler including stack trace and error
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({ error_message: err.message, error: err });
    });
} else {
    //Production error handler including just an error message
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({ error_message: err.message, error: {} });
    });
}


//Export this as a module to be called from bin\www.js
module.exports = app;
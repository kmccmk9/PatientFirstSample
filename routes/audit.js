//Import Packages and File Dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//Define our AuditEvent variable that represents our Mongoose auditevent model schema
var AuditEvent = require('../models/auditevent');

//Import our generic common functions file
var functions = require('../common/functions');

//Define Express route for POSTing AuditEvent resources
router.post('/', function(req, res, next) {
    //Check for a body id to ensure people don't try creating their own
    var json = functions.checkBodyForId(req.body);
    //If we do find an ID, return a 400 Bad Request
    if (json !== null) {
        res.status(400);
        res.json(json);
    } else {
        //Build Mongoose Model for insertion into database
        var auditEventBody = new AuditEvent(req.body);
        //Save AuditEvent resource to the database
        auditEventBody.save(function(err, auditEvent) {
            if (err) {
                //Could not save document in mongo db...generate operation outcome
                var json = functions.generateOperationOutcome("exception", "error", err, "exception");
                //Set stauts to 500 Internal Server Error
                res.status(500);
                res.json(json);
            } else {
                //Document saved in mongo db successfully...generate FHIR operation outcome
                var json = functions.generateOperationOutcome("informational", "information", "All Ok", "allok");
                var id = auditEvent._id;
                //Set header in response of where new resource location URL is for future use
                res.setHeader('Location', '/auditevent/' + id);
                //Set status to 201 Created
                res.status(201);
                res.json(json);
            }
        });
    }
});

//Define Express route for GETing AuditEvent resources
router.get('/', function(req, res, next) {
    var parameters = req.query;
    //If requestor provides a resource ID, convert the string to MongoDB ObjectID
    if (parameters._id) {
        parameters._id = new mongoose.mongo.ObjectID(parameters._id);
    }
    //Use our Global database variable instead of Mongoose. I found in this case, it provided better performance because of the complex schema
    global.db.collection("auditevents").find(parameters).toArray(function(err, docs) {
        if (err) {
            //If we errored communicating with the DB, generate FHIR operation outcome
            var json = functions.generateOperationOutcome("exception", "error", err, "exception");
            //Set status to 500 Internal Server Error
            res.status(500);
            res.json(json);
        } else {
            //If we have 0 documents, we did not find any matching the find parameters
            if (docs.length === 0) {
                //Generate FHIR operation outcome
                var json = functions.generateOperationOutcome("not-found", "warning", "Non-Existent Resource", "warning");
                //Set status to 404 Not Found
                res.status(404);
                res.json(json);
            } else {
                //Set status to 200 Ok and return documents we found
                res.status(200);
                res.json(docs);
            }
        }
    });
});

module.exports = router;
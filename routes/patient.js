//Import Packages and File Dependencies
var express = require('express');
var router = express.Router();

//Define our Patient variable that represents our Mongoose patient model schema
var Patient = require('../models/patient');

//Import our generic common functions file
var functions = require('../common/functions');
var mongoose = require('mongoose');

//Define Express route for POSTing Patient resources
router.post('/', function(req, res, next) {
    //Check for a body id to ensure people don't try creating their own
    var json = functions.checkBodyForId(req.body);
    //If we do find an ID, return a 400 Bad Request
    if (json !== undefined) {
        res.status(400);
        res.json(json);
    } else {
        //Build Mongoose Model for insertion into database
        var patientBody = new Patient(req.body);
        //Set deleted flag for the model to false (since it is a new resource)
        patientBody.deleted = false;
        //Save Patient resource to the database
        patientBody.save(function(err, patient) {
            if (err) {
                //Could not save document in mongo db...generate FHIR operation outcome
                var json = functions.generateOperationOutcome("exception", "error", err, "exception");
                //Set status to 500 Internal Server Error
                res.status(500);
                res.json(json);
            } else {
                //Document saved in mongo db successfully...generate FHIR operation outcome
                var json = functions.generateOperationOutcome("informational", "information", "All Ok", "allok");
                var id = patient._id;
                //Set header in response of where new resource location URL is for future use
                res.setHeader('Location', '/patient/' + id);
                //Set status to 201 Created
                res.status(201);
                res.json(json);
            }
        });
    }
});

//Define Express route for GETing Patient resources
router.get('/', function(req, res, next) {
    var parameters = req.query;
    //UNCOMMENT to force return of non-deleted Patient resources
    //parameters.deleted = false;
    //If requestor provides a resource ID, convert the string to MongoDB ObjectID
    if (parameters._id) {
        parameters._id = new mongoose.mongo.ObjectID(parameters._id);
    }
    //Use our Global database variable instead of Mongoose. I found in this case, it provided better performance because of the complex schema
    global.db.collection("patients").find(parameters).toArray(function(err, docs) {
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

//Define Express route for UPDATEing/PUTting a Patient resource
router.put('/:id', function(req, res, next) {
    //Check if an ID was provided as part of the request body
    var json = functions.checkBodyForId(req.body);
    if (json !== null) {
        //Set status to 400 Bad Request because the ID should be part of the URL
        res.status(400);
        res.json(json);
    } else {
        //Check if the deleted flag was set as part of the request body
        json = functions.checkBodyForDeleted(req.body);
        if (json !== null) {
            //Set status to 400 Bad Request because we do not allow updates on deleted resources
            res.status(400);
            res.json(json);
        } else {
            //Construct a mongoose update query, where our condition is the matching ID, the update is what was provided in the request body and we do not update multiple resources
            var conditions = { _id: req.params.id },
                update = req.body,
                options = { multi: false };
            //Execute Mongoose Update operation
            Patient.update(conditions, update, options, function(err, numAffected) {
                if (err) {
                    //If we errored, generate FHIR operation outcome
                    json = functions.generateOperationOutcome("exception", "error", err, "exception");
                    //Set status to 500 Internal Server Error
                    res.status(500);
                    res.json(json);
                } else {
                    //If we have no affected documents
                    if (numAffected === 0) {
                        //Generate FHIR operation outcome
                        json = functions.generateOperationOutcome("not-found", "warning", "Non-Existent Resource", "warnintg");
                        //Set status to 404 Not Found
                        res.status(404);
                        res.json(json);
                    } else {
                        //Set status to 204 No Content, if everything was successful
                        res.sendStatus(204);
                    }
                }
            });
        }
    }
});

//Define Express route for DELETEing Patient resources
router.delete('/:id', function(req, res, next) {
    //In this use case, we do an UPDATE instead of an actual DELETE because of retention policies
    //We define Mongoose Update conditions as matching on the ID, the field to update (deleted), and that we process only one resource
    var conditions = { _id: req.params.id },
        update = { deleted: true },
        options = { multi: false };
    //Peform Mongoose update operation
    Patient.update(conditions, update, options, function(err, numAffected) {
        if (err) {
            //If we errored communicating with the DB, generate FHIR operation outcome
            json = functions.generateOperationOutcome("exception", "error", err, "exception");
            //Set status to 500 Internal Server Errror
            res.status(500);
            res.json(json);
        } else {
            //If no documentes were affected, we did not find the doucment
            if (numAffected === 0) {
                //Generate FHIR operation outcome
                json = functions.generateOperationOutcome("not-found", "warning", "Non-Existent Resource", "warning");
                //Set status to 404 Not Found
                res.status(404);
                res.json(json);
            } else {
                //Set status to 204 No Content if successful
                res.sendStatus(204);
            }
        }
    });
});

module.exports = router;
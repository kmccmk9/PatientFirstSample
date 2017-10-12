/**
 * Name: Kyle Corsi
 * Title: Value Add-On Software Engineer
 * Created: 3/4/2016 - Kyle Corsi
 * Contact: kylec@datamotion.com
 */
var operationOutcomeIssueCode = 'invalid structure required value invariant security login unknown expired forbidden suppressed processing not-supported duplicate not-found too-long code-invalid extension too-costly business-rule conflict incomplete transient lock-error no-store exception timeout throttled informational allok'.split(' ');
var operationOutcomeSeverityCode = 'fatal error warning information'.split(' ');

//var generateOperationOutcome =

//var checkBodyForId =

module.exports =
{
    generateOperationOutcome: function(issueCode, severityCode, detailsText, id) {
        //Check issueCode matches one of the allowed codes
        if (operationOutcomeIssueCode.indexOf(issueCode) > -1) {

            if (operationOutcomeSeverityCode.indexOf(severityCode) > -1) {
                //Accept id parameter if provided otherwise dupe severityCode
                var json = {
                    "resourceType": "OperationOutcome",
                    "id": id,
                    issue: [{
                        "severity": severityCode,
                        "code": issueCode,
                        "details": {"text": detailsText}
                    }]
                };
            }
            else {
                var json = {
                    "resourceType": "OperationOutcome",
                    "id": "exception",
                    issue: [{
                        "severity": "error",
                        "code": "exception",
                        "details": {"text": "Unknown Severity Code"}
                    }]
                };
            }
        }
        else {
            var json = {
                "resourceType": "OperationOutcome",
                "id": "exception",
                issue: [{
                    "severity": "error",
                    "code": "exception",
                    "details": {"text": "Unknown Issue Code"}
                }]
            };
        }

        return json;
    },

    checkBodyForId: function (body) {
        if (body._id != null) {
            var json = this.generateOperationOutcome("exception", "error", "You cannot create this resource with a populated id field.");
            return json;
        }
    },

    checkBodyForDeleted: function (body) {
        if (body.deleted != null) {
            var json = this.generateOperationOutcome("exception","error","You cannot update this resource with a populated deleted field. To delete this resource please use the DELETE HTTP Request");
            return json;
        }
    }
};
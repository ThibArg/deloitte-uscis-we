/*

*/
// ==============================
var kDEBUG = true;
// ==============================
var kWORKFLOW_SCHEMA_PREFIX = "var_wf_i129f",
	kAPPLICANTDATA_SCHEMA_PREFIX = "ad";

var gMainDocId = "",
	gCurrentUser = "",
	gDocData,
	gCurrentTaskId,
	gAllDivs,
	gNuxeoClient;

// This is called when the page loads
function doInit(docId, inUser) {
	gMainDocId = docId;
	gCurrentUser = inUser;
}

jQuery(document).ready(function() {
	console.log("Here I am");
	console.log("The main doc ID is: " + gMainDocId);
	console.log("The current user is: " + gCurrentUser);

	var allDivs, oneDiv,
		i, max;

	// Get all the divs to use, as jQuery objects
	// Build a quick access à la hashmap
	allDivs = jQuery(".node");
	gAllDivs = [];
	max = allDivs.length
	for(i = 0; i < max; i++) {
		oneDiv = allDivs[i];
		gAllDivs[ oneDiv.id ] = jQuery(oneDiv);
	}

	// Request Nuxeo to get the whole document
	// No credentials passed here: If we are in this page, the user is authenticated
	gNuxeoClient = new nuxeo.Client();
	gNuxeoClient.schema("dublincore")
				.schema("applicant_data")
				.request("id/" + gMainDocId)
				.get(function(inErr, inData) {
					if(inErr != null) {
						gDocData = {};
					} else {
						gDocData = inData;
						// Now, get the current workflow task id
						getCurrentTaskIdAndUpdate();
					}
				});
});

function getCurrentTaskIdAndUpdate() {
	gNuxeoClient.operation("REST_getCurrentTaskId")
				.context({"applicantDataDocId": gMainDocId})
				.execute(function(inErr2, inData2) {
					// Should add some error checking here
					gCurrentTaskId = JSON.parse(inData2).taskId;
					gAllDivs[gCurrentTaskId].removeClass("noDisplay");
					// And delete all the other ones, so submiting the form => no complain
					// about non focusable, non entered fields, etc.)
					Object.keys(gAllDivs).forEach(function(oneKey) {
						if(oneKey != gCurrentTaskId) {
							gAllDivs[oneKey].remove();
						}
					});
					if(kDEBUG) {
						var debugSpan = jQuery("#debugSpan");
						if(debugSpan == null || debugSpan.length < 1
							) {
							jQuery("#uscisHeader").append("<span id='debugSpan' style='padding-left: 20px;vertical-align: super; color: yellow;'>Current task: " + gCurrentTaskId + "</span>");
						} else {
							debugSpan.text("Current task: " + gCurrentTaskId);
						}
					}
				});
}

/*	Handle submission of the form.
	At this step, validation of required field has been performed by the browser.
	We get the values to send to a chain which will complete the task
	Also, we return false, as this function is called for the "onsubmit" action of the form,
	so the browser does not try to submit the form
*/
function OnSubmitForm() {
	// Get all inputs for the dive
	var inputs = jQuery("form#mainForm div#Task4739 :input");
	/*
	var wfVarAssign = "";
	inputs.each(function(){
		var input = $(this),
			fieldName = input.attr("name").replace("ad:", "");
		wfVarAssign += fieldName + "=" + input.val() + "\r\n";
	});
	wfVarAssign += "spouseChildrenNames=[]\r\n";
	*/
	
	
	var wfVarAssign = {};
	inputs.each(function(){
		var input = $(this),
			fieldName = input.attr("name").replace("ad:", "");
		wfVarAssign[fieldName] = input.val();
	});
	wfVarAssign["spouseChildrenNames"] = [];
	console.log(JSON.stringify(wfVarAssign));
	
	gNuxeoClient.operation("REST_completeTask")
				.context({	"applicantDataDocId": gMainDocId,
							"taskId": gCurrentTaskId,
							"wfValues": wfVarAssign})
				.execute(function(inErr, inData) {
					if(inErr) {
						alert("Error: " + inErr);
					} else {
						window.location.reload(true);
					}
				});

	return false;
}


/* EOF */

/*

*/
// ==============================
var kDEBUG = false;
// ==============================
var kWORKFLOW_SCHEMA_PREFIX = "var_wf_i129f",
	kAPPLICANTDATA_SCHEMA_PREFIX = "ad",
	kUPLOAD_PHOTO_TASK_ID = "Task5261";

var gMainDocId = "",
	gCurrentUser = "",
	gWeHaveARunningWorkflow,
	gCurrentTaskId,
	gAllDivs,
	gPhotoFile;

// This is called when the page loads
function doInit(docId, inUser, inWorkflowIsRunning) {
	gMainDocId = docId;
	gCurrentUser = inUser;
	gWeHaveARunningWorkflow = inWorkflowIsRunning;
}

jQuery(document).ready(function() {
	if(kDEBUG) {
		console.log("Here I am");
		console.log("The main doc ID is: " + gMainDocId);
		console.log("The current user is: " + gCurrentUser);
	}

	var nxClient,
		allDivs, oneDiv,
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

	// We must get the divs, the tasks, etc. only if a workflow is running
	// Else, we already are in the "lastStep" where the user can only
	// download the pdf
	if(gWeHaveARunningWorkflow) {

		// Request Nuxeo to get the current task, and handle
		// this task (basically, show it and remove the others)
		// No credentials needed: If we are in this page, the user is authenticated
		nxClient = new nuxeo.Client({timeout: 10000});
		// We just call our REST_getCurrentTaskId Automation Chain, passing it the
		// doc id. The chain returns the current task id.
		nxClient.operation("REST_getCurrentTaskId")
				.context({"applicantDataDocId": gMainDocId})
				.execute(function(inErr, inData) {
					if(inErr) {
						displayRestError("Get the current task", inErr);
					} else {
						gCurrentTaskId = JSON.parse(inData).taskId;
						gAllDivs[gCurrentTaskId].removeClass("noDisplay");
						// And delete all the other ones, so submiting the form => no complain
						// about non focusable, non entered fields, etc.)
						Object.keys(gAllDivs).forEach(function(oneKey) {
							if(oneKey != gCurrentTaskId) {
								gAllDivs[oneKey].remove();
								delete gAllDivs[oneKey];
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
					}
				});
	} else { // if(gWeHaveARunningWorkflow) 
		jQuery("#nextStepButton").remove();
		jQuery("#lastStep").removeClass("noDisplay");
	}
});

function completeTask(inWFVariables) {
	var nxClient;

	nxClient = new nuxeo.Client({timeout: 10000});
	nxClient.operation("REST_completeTask")
			.context({	"applicantDataDocId": gMainDocId,
						"taskId": gCurrentTaskId,
						"wfValues": inWFVariables})
			.execute(function(inErr, inData) {
				var result;
				if(inErr) {
					displayRestError("Complete the current task", inErr);
				} else {
					window.location.reload(true);
				}
			});
}

function displayRestError(inContextLabel, inTheErr) {
	var html = "";

	// Delete all divs
	Object.keys(gAllDivs).forEach(function(oneKey) {
		gAllDivs[oneKey].remove();
		delete gAllDivs[oneKey];
	});
	// Fill in the error div
	html += "<p>An error occured while requesting the server</p>"
			+ "<p>\"" + inContextLabel + "\"</p>"
			+ "<p>" + JSON.stringify(inTheErr) + "</p>";
	jQuery("#restError").html(html);
	jQuery("#restError").removeClass("noDisplay");
	// Remove the submit button
	jQuery("#nextStepButton").remove();
	// Should add something to let the user relod or test something else...
}

/*
function bsc(batchId) {
	console.log("batchStartedCallback " + batchId);
}
*/
function batchFinished(batchId) {
	console.log("batchFinishedCallback " + batchId);
	var theData, nxClient;

	theData = {
		"entity-type": "document",
		"properties": {
			"ad:personalPhoto": {
					"upload-batch": batchId,
					"upload-fileId": "0"
			}
		}
	};
	nxClient = new nuxeo.Client({timeout: 10000});
	nxClient.request("id/" + gMainDocId)
			.put({data: theData}, function(inErr, inData) {
				if(inErr) {
					displayRestError("Save picture in applicant data", inErr);
				} else {
					completeTask({});
				}
			});
}
/*
function usc(fileIndex, file) {
	console.log("uploadStartedCallback " + fileIndex + " ••• " + file);
}
function ufc(fileIndex, file, time) {
	console.log("uploadFinishedCallback " + fileIndex + " ••• " + file);
}
function upc(fileIndex, file, newProgress) {
	console.log("uploadProgressUpdatedCallback " + fileIndex + " ••• " + file + " ••• " + newProgress);
}
function suc(fileIndex, file, speed) {
	console.log("uploadSpeedUpdatedCallback " + fileIndex + " ••• " + file + " ••• " + speed);
}
*/

function submitPhoto() {
	var nxClient, batchId, xhr;
	if(gPhotoFile instanceof File) {
		
		nxClient = new nuxeo.Client({timeout: 10000});
		// Using operation("automation") is a big crados hack to fix the fact that the uploader
		// builds a bad URL: /site/batch/upload, instead of /site/automation/batch/upload
		// (missing "/automation" in the path). So, because the code concat the operation
		// name in the path, well, we just used the missing value.
		nxClient.operation("automation")
				.uploader({
					directUpload: true,
					batchFinishedCallback: batchFinished
				})
				.uploadFile(gPhotoFile, function(inErr, inDada) {
					if(inErr) {
						displayRestError("Upload file", inErr);
					} else {
						// Unused. We use the batchFinished callback
					}
				});

	} else {
		if(jQuery("#photo").attr("src") == "") {
			alert("Please, upload a photo");
		} else {
			completeTask({});
		}
	}
}

/*	Handle submission of the form.
	At this step, validation of required field has been performed by the browser.
	We get the values to send to a chain which will complete the task
	Also, we return false, as this function is called for the "onsubmit" action of the form,
	so the browser does not try to submit the form

	Also we have to handle special cases:
		-> Boolean values
		-> Photo upload
*/
function OnSubmitForm() {
	var val,
		inputs,
		wfVarAssign,
		nxClient,
		boolStrFields = ["spouseMarriedBeforeBool", "spouseHasChildrenBool"];

	if(gCurrentTaskId === kUPLOAD_PHOTO_TASK_ID) {
		submitPhoto();
	} else {
		// Get all inputs for the dive
		inputs = jQuery("form#mainForm div#" + gCurrentTaskId + " :input");
		
		wfVarAssign = {};
		inputs.each(function(){
			var input = $(this),
				fieldName = input.attr("name").replace("ad:", "");
			wfVarAssign[fieldName] = input.val();
		});

		// Handle specific cases (convert bool-striongs to real booleans)
		boolStrFields.forEach(function(inField) {
			if(inField in wfVarAssign) {
				val = wfVarAssign[inField];
				wfVarAssign[inField] = (val.toLowerCase() === "yes" || val.toLowerCase() == "y");
			}
		});

		completeTask(wfVarAssign);
		/*
		nxClient = new nuxeo.Client({timeout: 10000});
		nxClient.operation("REST_completeTask")
				.context({	"applicantDataDocId": gMainDocId,
							"taskId": gCurrentTaskId,
							"wfValues": wfVarAssign})
				.execute(function(inErr, inData) {
					if(inErr) {
						displayRestError("Complete the current task", inErr);
					} else {
						window.location.reload(true);
					}
				});
		}
		*/
	}

	return false;
}

function displayFileChooser() {
    jQuery('#uploadPhoto').click();
}

function handleFiles(files) {
	var theReader;
	//The input file is not set to allow multiple files, so we have just one
	if(files.length > 0) {
		gPhotoFile = files[0];
		jQuery("#selectedPhotoFile").text("Selected: " + gPhotoFile.name);
		// Display the picture
		theReader = new FileReader();
		theReader.readAsDataURL(gPhotoFile);
		theReader.onload = function (inEvent) {
			document.getElementById("photo").src = inEvent.target.result;
		};

	} else {
		gPhotoFile = null;
		jQuery("#selectedPhotoFile").html("Selected: <i>None</i>");
		document.getElementById("photo").src = "";
	}
}



/* EOF */

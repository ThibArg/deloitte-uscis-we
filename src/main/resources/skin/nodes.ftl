<!--
Each div **must** use the "noDisplay" and the "node" class. This is required
In this context, we have the Document instance avilable so we can use any field
to prefill values
-->
<!-- We start with the error div, displayed when a REST request fails -->
<div id="restError" class="noDisplay restError">
<!-- content is filled dynamically by the JavaScript -->
</div>

<!-- Prepare all the stuff only if the workflow is running -->
<#if Context.getProperty("workflowIsRunning")>
<!-- Personal_details -->
<div id="Task4739" class="noDisplay node">
<#if Document['ad:lastName']?has_content>
	<p class="infoHeader">Hi. We know you as ${Document['ad:firstName']} ${Document['ad:lastName']}.</p>
<#else>
	<p class="infoHeader">Hi ${Context.getProperty("currentUser")}, we need to know a little more about you.</p>
</#if>
	<p><span class="infoText">My name is </span><input type="text" class="infoField" name="ad:firstName" value="${Document['ad:firstName']}" placeHolder="first name" required /><span class="infoText"> and </span><input type="text" class="infoField" name="ad:lastName" value="${Document['ad:lastName']}" placeHolder="last name" required /><span class="infoText">, my address is </span><input type="text" class="infoField" style="width: 700px; font-size:smaller;" name="ad:address" value="${Document['ad:address']}" placeHolder="address" required /><span class="infoText">, and my gender is </span><input type="text" class="infoField" style="width:200px" name="ad:gender" value="${Document['ad:gender']}" placeHolder="M or F" maxlength="1" pattern="M|F" required /></p>
</div>

<!-- Relative details -->
<div id="Task48a0" class="noDisplay node">
	<p class="infoHeader">${Document['ad:firstName']}, we need information about your spouse.</p>
	<p><span class="infoText">My spouse's name is </span><input type="text" class="infoField" name="ad:spouseName" value="${Document['ad:spouseName']}" placeHolder="name of spouse" required /><span class="infoText">. Their gender is </span><input type="text" class="infoField" style="width:200px" name="ad:spouseGender" value="${Document['ad:spouseGender']}" placeHolder="M or F" maxlength="1" pattern="M|F" required /><span class="infoText">. My spouse was born on </span><input type="text" class="infoField" name="ad:spouseDateOfBirthStr" value="${Document['ad:spouseDateOfBirthStr']}" placeHolder="mm/dd/yyyy" required /></p>
	<p></p>
</div>

<!-- Marital History ? -->
<div id="Task4b3c" class="noDisplay node">
<#if Document['ad:spouseMarriedBeforeBool']?has_content>
  <#if Document['ad:spouseMarriedBeforeBool']>
    <#assign spouseMarriedStrValue="yes">
  <#else>
    <#assign spouseMarriedStrValue="no">
  </#if>
<#else>
  <#assign spouseMarriedStrValue="">  
</#if>
	<p class="infoHeader">${Document['ad:firstName']}, we need information about your spouse.</p>
	<p><span class="infoText">Has ${Document['ad:spouseName']} been married before? </span><input type="text" class="infoField" name="ad:spouseMarriedBeforeBool" style="width:200px" value="${spouseMarriedStrValue}" placeHolder="yes/no" required /></p>
	<p></p>
</div>

<!-- Spouse Divorce Number -->
<div id="Task4d38" class="noDisplay node">
	<p class="infoHeader">${Document['ad:firstName']}, we need information about your spouse.</p>
	<span class="infoText">My spouse, ${Document['ad:spouseName']}, was married before and the divorce certificate number is </span><input type="text" class="infoField" style="width:500px;" name="ad:spouseDivorceCertificateNumber" value="${Document['ad:spouseDivorceCertificateNumber']}" placeHolder="certificate number" required />
	<p></p>
</div>

<!-- Spouse Children ? -->
<div id="Task4e7d" class="noDisplay node">
<#if Document['ad:spouseHasChildrenBool']?has_content>
  <#if Document['ad:spouseHasChildrenBool']>
    <#assign spouseHasChildrenStrValue="yes">
  <#else>
    <#assign spouseHasChildrenStrValue="no">
  </#if>
<#else>
  <#assign spouseHasChildrenStrValue="">  
</#if>
	<p class="infoHeader">${Document['ad:firstName']}, we need information about your spouse.</p>
	<p><span class="infoText">Does ${Document['ad:spouseName']} have children from a previous marriage? </span><input type="text" class="infoField" name="ad:spouseHasChildrenBool" style="width:200px" value="${spouseHasChildrenStrValue}" placeHolder="yes/no" required /></p>
	<p></p>
</div>

<!-- Spouse Children Names -->
<div id="Task508a" class="noDisplay node">
	<p class="infoHeader">${Document['ad:firstName']} has children from a previous marriage</p>
	<p><span class="infoText">The names of the children are </span><input type="text" class="infoField" name="ad:spouseKid1" value="${Document['ad:spouseKid1']}" placeHolder="name" required /><span class="infoText">, </span><input type="text" class="infoField" name="ad:spouseKid2" value="${Document['ad:spouseKid2']}" placeHolder="name" /><span class="infoText">, </span><input type="text" class="infoField" name="ad:spouseKid3" value="${Document['ad:spouseKid3']}" placeHolder="name" /></p>
	<p></p>
</div>

<!-- Attachments -->
<div id="Task5261" class="noDisplay node">
	<p class="infoHeader">${Document['ad:firstName']}, we are almost done.</p>
	<p><span class="infoText">Here is my personnal photo</span></p>
	<p><img id="photo" src="${Context.getProperty('personalPhotoUrl')}" alt="your photo here" style="width: 128px; height: 128px; font-size:initial" /></p>
	<p><a href="javascript:displayFileChooser();" style="color: white">Load a <#if Context.getProperty('personalPhotoUrl') != "">new </#if>Picture of you</a><input id="uploadPhoto" type="file" accept="image/*" onchange="handleFiles(this.files)" style="visibility:hidden;position:absolute;top:-50;left:-50" /></p>
	<p id="selectedPhotoFile" style="font-size:smaller"></p>
</div>
<#else> <!-- check the "workflowIsRunning" property at the beginning of this file -->
<!-- Last step -->
<div id="lastStep" class="noDisplay">
	<p class="infoHeader">${Document['ad:firstName']}, your application is complete.</p>
	<p></p>
	<p><a href="${Context.getProperty('pdfFormUrl')}" style="color: white">Download the PDF</a></p>
</div>
</#if>

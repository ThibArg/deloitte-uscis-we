<!--
Each div **must** use the "noDisplay" and the "node" class. This is required
In this context, we have the Document instance avilable so we can use any field
to prefill values
-->
<!-- Personal_details -->
<div id="Task4739" class="noDisplay node">
	<p class="infoHeader">Hi. We know you as ${Document['ad:firstName']} ${Document['ad:lastName']}.</p>
	<p><span class="infoText">My name is </span><input type="text" class="infoField" name="ad:firstName" value="${Document['ad:firstName']}" placeHolder="your first name" required /><span class="infoText"> and </span><input type="text" class="infoField" name="ad:lastName" value="${Document['ad:lastName']}" placeHolder="your last name" required /><span class="infoText">.</span></p>
	<p><span class="infoText">My address is </span><textarea class="infoTextAreaField" name="ad:address" value="${Document['ad:address']}" placeHolder="your address" rows="2" required>${Document['ad:address']}</textarea><span class="infoText">.</span></p>
	<p><span class="infoText">My gender is </span><input type="text" class="infoField" style="width:250px" name="ad:gender" value="${Document['ad:gender']}" placeHolder="your gender" required /></p>
</div>

<!-- Relative details -->
<div id="Task48a0" class="noDisplay node">
	<p class="infoHeader">${Document['ad:firstName']}, we need information about your spouse.</p>
	<p><span class="infoText">About my spouse, the name is </span><input type="text" class="infoField" name="ad:spouseName" value="${Document['ad:spouseName']}" placeHolder="name of your spouse" required /><span class="infoText">, the gender is </span><input type="text" class="infoField" style="width:250px" name="ad:spouseGender" value="${Document['ad:spouseGender']}" placeHolder="the gender" required /><span class="infoText">, and my spouse was born on </span><input type="text" class="infoField" style="width:250px" name="ad:spouseDateOfBirth" value="${Context.getProperty('spouseDateOfBirthMMDDYYYY')}" placeHolder="mm/dd/yyyy" required /></p>
	<p></p>
</div>

<!-- Marital History ? -->
<div id="Task4b3c" class="noDisplay node">
	<p></p>
	<p>This is node #Task4b3c</p>
	<p></p>
</div>

<!-- Spouse Divorce Number -->
<div id="Task4d38" class="noDisplay node">
	<p>This is node #Task4d38</p>
	<p></p>
</div>

<!-- Spouse Children ? -->
<div id="Task4e7d" class="noDisplay node">
	<p>This is node #Task4e7d</p>
</div>

<!-- Spouse Children Name -->
<div id="Task508a" class="noDisplay node">
	<p></p>
	<p>This is node #Task508a</p>
	<p></p>
</div>

<!-- Attachments -->
<div id="Task5261" class="noDisplay node">
	<p></p>
	<p>This is node #Task5261</p>
	<p></p>
</div>

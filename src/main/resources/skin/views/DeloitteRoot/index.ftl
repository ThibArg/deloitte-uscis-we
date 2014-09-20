<@extends src="base.ftl">
<@block name="header_scripts"><script src="${skinPath}/scripts/DeloitteRoot_main.js"></script></@block>

<@block name="content">
<form id="mainForm" onsubmit="return OnSubmitForm();">
<div id="placeHolder" class="screenTextAndFields">
	<#include "nodes.ftl">
</div>
<div id="nextButtonDiv" class="screenButtons">
	<button id="nextStepButton" type="submit" name="goNext" class="screenButton">Next</button>
</div>
</form>

<script type="text/javascript" charset="utf-8">
	doInit('${Document.id}', '${Context.getProperty("currentUser")}');
</script>

</@block>
</@extends>

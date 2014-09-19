<@extends src="base.ftl">
<@block name="header_scripts"><script src="${skinPath}/scripts/DeloitteRoot_main.js"></script></@block>

<@block name="content">

<div class="appdataNotFound">
Applicant Data not found for ${Context.getProperty("currentUser")}
</div>
</@block>
</@extends>

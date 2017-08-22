<!DOCTYPE html>
<!-- Author: CYOSP       -->
<!-- Created: 2016-07-08 -->
<!-- Version: 1.2.1      -->

<!-- 2016-11-02 V 1.2.1                                          -->
<!--  * Add sensors entry in navigation bar if a sensor is       -->
<!--    passed as argument                                       -->
<!-- 2016-10-22 V 1.2.0                                          -->
<!--  * Use local dygraphs library                               --> 
<!--  * Add bootstrap navbar                                     --> 
<!--  * Use Font-Awesome                                         -->
<!--  * Display graph logic is now client side                   -->
<!-- 2016-10-07 V 1.1.1                                          -->
<!--  * Sensor graph takes now all page width                    -->
<!-- 2016-07-08 V 1.1.0                                          -->
<!--  * It's now possible to restrict display to only one sensor -->
<!--    given sensor identifier as 'id' parameter                -->
<!-- 2016-07-08 V 1.0.0                                          -->
<!--  * First release                                            -->
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="Display CYTHS sensors">
		<meta name="author" content="CYOSP">
		<title data-i18n="sensors.title">CYTHS - Sensors</title>
		<!-- CSS -->
		<link href="../css/bootstrap.min.css" rel="stylesheet">
		<link href="../css/font-awesome.min.css" rel="stylesheet">
		<!-- JavaScript -->
		<script src="../js/jquery.min.js"></script>
		<script src="../js/bootstrap.min.js"></script>   
	    <script src="../js/dygraph-combined.js"></script>
		<script src="../js/cyths-sensors.js"></script>
		<!-- i18n -->
		<script src="../js/i18next.min.js"></script>
		<script src="../js/i18nextXHRBackend.min.js"></script>
		<script src="../js/jquery-i18next.min.js"></script>			
		<script>var i18nextLoadPath='../data/i18n/cyths.{{lng}}.json';</script>
		<script src="../js/cyths-i18n.js"></script>
    </head>
    <body>
		<div id="content">
			<div class="container">
				<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
					<div class="container">
						<div class="navbar-header">
				  			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
				  			</button>
				  			<a class="navbar-brand" href="#"><span data-i18n="sensors.title" id="sensorsTitle">CYTHS - Sensors</span></a>
						</div>
				  		<div id="navbar" class="navbar-collapse collapse">
							<ul class="nav navbar-nav navbar-right">
					  			<li><a href=".."><i class="fa fa-home" aria-hidden="true"></i></a></li>
								<?php if( $_GET[ 'id' ] != "" ) echo ' <li><a href="."><span data-i18n="sensors.label">Sensors</span></a></li>'; ?>
					  			<li><a href="../display/crontab"><span data-i18n="crontab.label">Crontab</span></a></li>
					  			<li><a href="../admin"><span data-i18n="admin.label">Admin</span></a></li>
							</ul>
				  		</div>
					</div>
				 </nav>
				 <br/>
				 <br/>
				 <br/>
			</div>
		</div>
		<?php echo '<div class="row" id="sensorId" sensorId="' .  $_GET[ 'id' ] . '"></div>'; ?>
    </body>
</html>

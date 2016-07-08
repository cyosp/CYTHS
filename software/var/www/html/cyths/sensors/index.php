<html>
	<?php
	// V 1.0.0 2016-07-08
	//  - First release
	?>
        <head>
                <script src="//cdnjs.cloudflare.com/ajax/libs/dygraph/1.1.1/dygraph-combined.js"></script>
        </head>
        <body>
			<?php

				// Configuration file is used to define what graphs are to display
				$json = file_get_contents( '../data/config.json' , false );
				$obj = json_decode( $json );

				// For each switch
				foreach( $obj->{'switchesList'} as $mySwitch )
				{
					if( $mySwitch->sensorId )
					{
						//<!-- style="width:800px; height:300px;" -->

						 // Add 'header'
						 $content .= '<ul><li><h5>'.$mySwitch->label.'</h5></li></ul>';

						 $content .= '<div id="'.$mySwitch->sensorId.'"></div>';
						 $content .= '<script type="text/javascript">';
						 $content .= '  g3 = new Dygraph(';
						 $content .= '        document.getElementById("'.$mySwitch->sensorId.'"),';
						 $content .= '        "../data/csv/'.$mySwitch->sensorId.'.rrd.csv",
										 {
											 rollPeriod: 7,
											 showRoller: true,
											 colors: ["#FF0000", "#0000FF"]
										 }
									   );
									   </script>';
					 }
				}
			?>

			<?=$content?>

    </body>
</html>

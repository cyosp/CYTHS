//
// Author: CYOSP
// Created: 2017-08-21
// Version: 1.0.0
//

// 2017-08-21 V 1.0.0
//  - Initial release

function cythsInit() {

    //
    // Get JSON configuration file
    //
    $.ajax(
        {
            url: "../data/config.json",
            dataType: 'json',
            async: false,
            cache: false,
            success: function (root) {

                // For each switch
                $.each(root.switchesList, function (index, switchConfigured) {

                    // Switch is well configured
                    if (switchConfigured.channel &&
                        switchConfigured.rcId) {

                        //
                        // Compute piece of HTML to insert
                        //
                        var switchId = "switch-" + switchConfigured.channel + "-" + switchConfigured.rcId;

                        var switchesListToAdd = '<div class="col-xs-6 col-lg-4 switch">';
                        switchesListToAdd += ' <p>';
                        switchesListToAdd += '  <button type="button" class="btn btn-success" style="width: 100%" id="' + switchId + '" name="' + switchId + '" rcId="' + switchConfigured.rcId + '" channel="' + switchConfigured.channel + '">';
                        switchesListToAdd += switchConfigured.label;
                        switchesListToAdd += '  </button>';
                        switchesListToAdd += ' </p>';
                        switchesListToAdd += '</div>';

                        $(switchesListToAdd).insertBefore("#pairing");
                    }
                });
            },
            error: function (xhr, textStatus, error) {
                alert(textStatus + ": " + error);
            }
        });
}

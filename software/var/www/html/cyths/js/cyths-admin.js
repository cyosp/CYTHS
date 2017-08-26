//
// Author: CYOSP
// Created: 2017-08-21
// Version: 1.2.0
//

// 2017-08-26 V 1.2.0
//  - Add desapairing interactive part
// 2017-08-25 V 1.1.1
//  - Check emitterWiringPiNumber and repeat received values
// 2017-08-23 V 1.1.0
//  - Add pairing interactive part
// 2017-08-21 V 1.0.0
//  - Initial release

var emitterWiringPiNumber = -1;
var repeat = -1;

function cythsInit() {

    $.ajax(
        {
            url: "../data/config.json",
            dataType: 'json',
            async: false,
            cache: false,
            success: function (root) {

                //
                // Store transmitter wiringPi number thus repeat value
                //
                if (root.emitterWiringPiNumber != undefined)
                    emitterWiringPiNumber = root.emitterWiringPiNumber;
                if (root.repeat != undefined)
                    repeat = root.repeat;

                // For each switch
                $.each(root.switchesList, function (index, switchConfigured) {

                    // Switch is well configured
                    if (switchConfigured.channel &&
                        switchConfigured.rcId) {

                        var pairingType = 'pairing';
                        var disapairingType = 'disapairing';
                        var buttonsType = [pairingType, disapairingType];

                        buttonsType.forEach(function (buttonType) {

                            //
                            // Compute piece of HTML to insert
                            //
                            var buttonId = "button-" + buttonType + "-" + switchConfigured.channel + "-" + switchConfigured.rcId;

                            var buttonToAdd = '<div class="col-xs-6 col-lg-4 switch">';
                            buttonToAdd += ' <p>';
                            buttonToAdd += '  <button type="button" class="btn ' + buttonType + '" id="' + buttonId + '" rcId="' + switchConfigured.rcId + '" channel="' + switchConfigured.channel + '">';
                            buttonToAdd += switchConfigured.label;
                            buttonToAdd += '  </button>';
                            buttonToAdd += ' </p>';
                            buttonToAdd += '</div>';

                            $(buttonToAdd).insertBefore("#" + buttonType);

                            var state = "on";
                            if (buttonType == disapairingType) state = "onoff";

                            $('#' + buttonId).click(function () {

                                // Get button object
                                var buttonObj = $(this);

                                // Disable button until post answer
                                buttonObj.attr('disabled', true);

                                $.post('../API/set/switch/',
                                    {
                                        emitterWiringPiNumber: emitterWiringPiNumber,
                                        rcId: buttonObj.attr("rcId"),
                                        channel: buttonObj.attr("channel"),
                                        state: state,
                                        repeat: repeat
                                    }).done(function (data) {
                                    // Get JSON object
                                    var response = jQuery.parseJSON(data);

                                    // Manage error case
                                    if (response.result == "error") {
                                        var msg = "ERROR\n";
                                        msg += response.cmd + "\n";
                                        msg += response.message;

                                        // Display command executed and error to the user
                                        alert(msg);
                                    }
                                }).fail(function (jqxhr, textStatus, error) {
                                    // Alert user
                                    alert(textStatus + ": " + error);
                                }).always(function () {
                                    // Enable in all cases
                                    buttonObj.attr('disabled', false);
                                });

                            });
                        });
                    }
                });
            },
            error: function (xhr, textStatus, error) {
                alert(textStatus + ": " + error);
            }
        });
}

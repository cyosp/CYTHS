//
// Author: CYOSP
// Created: 2017-08-21
// Version: 1.4.0
//

// 2019-12-11 V 1.4.0
//  - Update for rc-rsl 2.0.0
// 2017-08-27 V 1.3.0
//  - Improve dissociation feature
// 2017-08-26 V 1.2.0
//  - Add association interactive part
// 2017-08-25 V 1.1.1
//  - Check emitterWiringPiNumber and repeat received values
// 2017-08-23 V 1.1.0
//  - Add pairing interactive part
// 2017-08-21 V 1.0.0
//  - Initial release

var gpioController = "/dev/null";
var controllerOffset = -1;
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
                // Store transmitter info thus repeat value
                //
                if (root.gpioController != undefined)
                    gpioController = root.gpioController;
                if (root.controllerOffset != undefined)
                    controllerOffset = root.controllerOffset;
                if (root.repeat != undefined)
                    repeat = root.repeat;

                // For each switch
                $.each(root.switchesList, function (index, switchConfigured) {

                    // Switch is well configured
                    if (switchConfigured.channel &&
                        switchConfigured.rcId) {

                        var associationType = 'association';
                        var dissociationStep1Type = 'dissociationStep1';
                        var dissociationStep2Type = 'dissociationStep2';
                        var buttonsType = [associationType, dissociationStep1Type, dissociationStep2Type];

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
                            if (buttonType == dissociationStep1Type) state = "onoff";
                            else if (buttonType == dissociationStep2Type) state = "off";

                            $('#' + buttonId).click(function () {

                                // Get button object
                                var buttonObj = $(this);

                                // Disable button until post answer
                                buttonObj.attr('disabled', true);

                                $.post('../API/set/switch/',
                                    {
                                        gpioController: gpioController,
                                        controllerOffset: controllerOffset,
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

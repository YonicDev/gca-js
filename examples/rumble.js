// This sample allows you to make any controller plugged into the adapter
// rumble by pressing the A button.

var gca = require('../gca.js');

// Get the first detected GameCube adapter.
var adapter = gca.getAdaptersList()[0];

// Start communication to the first adapter detected.
gca.startAdapter(adapter);

// Begin polling status information of the adapter, and call a function once
// a response has been received.
gca.pollData(adapter,function(data) {
    // Get the status of all controllers
    var controllers = gca.objectData(data);

    for(var i=0;i<4;i++) {
        // Set the rumble status of a controller to true if the A button
        // is pressed on that controller.
        controllers[i].rumble=controllers[i].buttons.buttonA;
        console.log("Controller "+(i+1)+"'s rumble:" + controllers[i].rumble);
    }
    console.log("\n");

    // Send a rumble command to the adapter. If true, the controller's motor
    // will activate. If false, the controller's motor will stop.
    gca.checkRumble(adapter,controllers);
    return;
})

import gca from "../build/main/index.js"

// This sample allows you to make any controller plugged into the adapter
// rumble by pressing the A button.

// This is executed so the program will not close instantly.
process.stdin.resume();

async function main() {
    // Get the first detected GameCube adapter.
    const adapter = (await gca.getAdaptersList())[0];
    const rumble = [false, false, false, false];

    function exitExample(options, err) {
        if(options.cleanup) gca.stopAdapter(adapter);
        if(err) console.error(err.stack);
        if(options.exit) process.exit();
    }

    process.on('SIGINT', exitExample.bind(null, {exit:true,cleanup:true}));

    // Start communication to the first adapter detected.
    await gca.startAdapter(adapter);

    while(adapter.opened) {
        // Read data from the adapter and format it.
        const controllers = gca.DataFormat.object(await gca.readData(adapter));
        for(var i=0;i<4;i++) {
            // Set the rumble status of a controller to true if the A button
            // is pressed on that controller.
            rumble[i]=controllers[i].buttons.buttonA;
            console.log(`Controller ${i + 1}'s rumble: ${controllers[i].buttons.buttonA}`);
        }
        console.log("\n");

        // Send the rumble command to the adapter.
        gca.sendRumble(adapter, rumble);
    }
}

main();
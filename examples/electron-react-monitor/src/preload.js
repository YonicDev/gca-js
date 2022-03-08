// The preload script has access to both Node.js modules and the browser globals,
// allowing to use GCA every frame of the browser.
//
// Another way would be to use GCA in the main process
// and use IPC to communicate with the renderer process.
const gca = require("../../../build/main/index.js");

document.addEventListener("DOMContentLoaded", async () => {
    // Get the first detected GameCube adapter.
    const adapter = await gca.getAdapter();
    let rumble = [false, false, false, false];

    // Start communication with the adapter.
    await gca.startAdapter(adapter);
    
    async function inputLoop() {
        // Read data from the adapter and format it.
        const controllers = gca.DataFormat.object(await gca.readData(adapter));

        // Send the controller data to the React app.
        window.dispatchEvent(new CustomEvent("controllerData", { detail: controllers }));
    
        // Send the rumble command to the adapter.
        gca.sendRumble(adapter, rumble);

        // Wait for the next frame.
        requestAnimationFrame(inputLoop);
    }
    
    // Add a listener to the window to receive the controller rumble commands sent by the app.
    window.addEventListener("controllerRumble", (e) => {
        rumble = e.detail;
    });
    requestAnimationFrame(inputLoop);
});
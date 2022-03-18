const gca = require('gca-js');
const { ipcRenderer } = require('electron')

document.addEventListener("DOMContentLoaded", async () => {
    // Get the first detected GameCube adapter.
    try {
        const adapter = (await gca.getAdaptersList())[0];
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
    } catch (e) {
        ipcRenderer.send('setup-error', e);
    }
});
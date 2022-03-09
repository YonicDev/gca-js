import { webusb } from "usb"

/**
 * The interface struct used for the controller status 
 * of any given port of the adapter in object form.
 */
export interface ControllerStatus {
    /**
     * The port number of the controller. It ranges from 1 to 4.
     */
    port: number,
    /**
     * Whenever a controller is connected to the associated port.
     */
    connected: boolean,
    buttons: {
        buttonA: boolean,
        buttonB: boolean,
        buttonX: boolean,
        buttonY: boolean,
        padUp: boolean,
        padDown: boolean,
        padLeft: boolean,
        padRight: boolean,
        buttonStart: boolean,
        buttonZ: boolean,
        buttonL: boolean,
        buttonR: boolean
    },
    /**
     * The current analog stick values. Values range from -1 to 1.
     */
    axes: {
        mainStickHorizontal: number,
        mainStickVertical: number,
        cStickHorizontal: number,
        cStickVertical: number,
        triggerL: number,
        triggerR: number
    }
}

const ENDPOINTS = { IN: 0x81, OUT: 0x02 }

/**
 * Gets the first detected Nintendo&reg; Wii U GameCube&trade; Adapter 
 * that is connected in your computer.
 * @returns The first detected adapter
 */
export async function getAdapter() { 
    return await webusb.requestDevice({ filters: [{ vendorId: 1406, productId: 823 }] });
}

/**
 * Sets up the adapter for use.
 * Internally, it claims the interface and sends a command
 * to enable data transfering to it.
 * @param adapter - The adapter to setup.
 */
export async function startAdapter(adapter: USBDevice) {
    await adapter.open();
    await adapter.selectConfiguration(1);
    await adapter.claimInterface(0);
    await adapter.transferOut(ENDPOINTS.OUT, Buffer.from([0x13]));
}

/**
 * Reads the current state of the adapter.
 * @param adapter - The adapter to read data from.
 * @returns A 37 bytes long Buffer containing the data read from the adapter.
 */
export async function readData(adapter: USBDevice) {
    const {data} = await adapter.transferIn(ENDPOINTS.IN, 37);
    if(data) {
        return Buffer.from(data.buffer);
    } else {
        throw "[GCA.JS] DataError: No data received";
    }
}

/**
 * Sends a command to the adapter to set the rumbling state of the controller.
 * 
 * It can be set to either rumbling or not rumbling. Once it is sent, it will
 * remain in that state until the next rumble command is sent.
 * @param adapter - The adapter to send the command to.
 * @param rumble - An array of 4 booleans, one for each controller port.
 */
export async function sendRumble(adapter: USBDevice, rumble: [boolean, boolean, boolean, boolean]) {
    const rumbleData = Buffer.from([ 0x11,
        rumble[0] ? 0x01 : 0x00,
        rumble[1] ? 0x01 : 0x00,
        rumble[2] ? 0x01 : 0x00,
        rumble[3] ? 0x01 : 0x00
    ]);
    await adapter.transferOut(ENDPOINTS.OUT, rumbleData);   
}

/**
 * Sends a command to stop communication with the adapter and disable it.
 * 
 * This is only necessary in cases whenever cleanup is not done properly.
 * @param adapter - The adapter to stop communicating with.
 */
export async function stopAdapter(adapter: USBDevice) {
    await adapter.transferOut(ENDPOINTS.OUT, Buffer.from([0x14]));
    await adapter.releaseInterface(0);
    await adapter.close();
}

/**
 * This namespace contains all the functions that are used to parse the data
 * received from the adapter.
 */
export namespace DataFormat {
    /**
     * Parses the data received from the adapter as a binary string.
     * @param data - The data to parse.
     * @return An array of strings containing the binary status from each port.
     */
    export function binaryString(data: Buffer) {
        const arr = [];
        const results = data.slice(1);
        for(let i=0;i<36;i++) {
            arr[i]='';
            for(let j=0;j<8;j++) {
                arr[i] += (results[i]>>j) & 1;
            }
        }
        return arr;
    }

    /**
     * Parses the data received from the adapter as multiple {@link Uint8Array | Uint8Arrays}.
     * @param data - The data to parse.
     * @return An array of {@link Uint8Array | Uint8Arrays} containing the binary status from each port.
     */
    export function uintArray(data: Buffer) {
        const arr: Uint8Array[] = [];
        for(let port=0;port<4;port++) {
            arr[port] = new Uint8Array(8);
            for(let i=0;i<8;i++) {
                arr[port][i] = data.readUInt8(1 + port*9 + i);
            }
        }
        return arr;
    }

    /**
     * Parses the data received from the adapter as an object.
     * @param data - The data to parse.
     * @returns An array containing 4 {@link ControllerStatus} objects per port.
     */
    export function object(data: Buffer) {
        const arr = binaryString(data);
        const status: ControllerStatus[] = [];
        for(var port=0;port<4;port++) {
            status[port] = {
                'port': port+1,
                'connected': "1" == arr[0+9*port][4],
                'buttons': {
                    'buttonA': "1" == arr[1+9*port][0],
                    'buttonB': "1" == arr[1+9*port][1],
                    'buttonX': "1" == arr[1+9*port][2],
                    'buttonY': "1" == arr[1+9*port][3],
                    'padUp': "1" ==  arr[1+9*port][7],
                    'padDown': "1" == arr[1+9*port][6],
                    'padLeft': "1" == arr[1+9*port][4],
                    'padRight': "1" == arr[1+9*port][5],
                    'buttonStart': "1" == arr[2+9*port][0],
                    'buttonZ': "1" == arr[2+9*port][1],
                    'buttonL': "1" == arr[2+9*port][3],
                    'buttonR': "1" == arr[2+9*port][2]
                },
                'axes': {
                    'mainStickHorizontal': (data[4+9*port]/128)-1,
                    'mainStickVertical': (data[5+9*port]/128)-1,
                    'cStickHorizontal': (data[6+9*port]/128)-1,
                    'cStickVertical': (data[7+9*port]/128)-1,
                    'triggerL': (data[8+9*port]/128)-1,
                    'triggerR': (data[9+9*port]/128)-1
                }
            }
        }
    
        return status;
    }
}
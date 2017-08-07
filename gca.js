var usb = require('usb');

var ENDPOINT_IN = 0x81;
var ENDPOINT_OUT = 0x02;

function getAdaptersList() {
    usbList = usb.getDeviceList();
    list = []
    for (var i=0;i<usbList.length;i++) {
        if(usbList[i].deviceDescriptor.idVendor === 1406 && usbList[i].deviceDescriptor.idProduct === 823)
            list.push(usbList[i]);
    }
    return list;
}

function startAdapter(adapter) {
    adapter.open();
    var iface = adapter.interface(0);
    try {
        if (iface.isKernelDriverActive()) {
            iface.detachKernelDriver();
            console.log("Kernel driver has been detached.");
        }
    } catch(e) {
        if(e.errno === -12)
            console.warn("Checking for kernel driver status is not supported in this platform. Kernel will not be detached.");
        else
            console.error(e);
    } finally {
        iface.claim();
        var endpoint = iface.endpoint(ENDPOINT_OUT);
        var code = endpoint.transfer([0x13],function(e) {
            if(e)
                console.error(e);
            return e;
        })
        return code;
    }
}

function readData(adapter,callback) {
    var iface = adapter.interface(0);
    var endpoint = iface.endpoint(ENDPOINT_IN);
    endpoint.transfer(37,function (e,data){
        if(e) {
            console.error(e);
            return;
        } else {
            callback(data);
        }
        return;
    })
}

function pollData(adapter,callback) {
    var iface = adapter.interface(0);
    var endpoint = iface.endpoint(ENDPOINT_IN);
    endpoint.startPoll(1,37);
    endpoint.on('data',function (data){
        callback(data);
        return;
    })
}

function rawData(data) {
    var arr = [];
    var results = data.slice(1);
    for(var i=0;i<36;i++) {
        arr[i]='';
        for(var j=0;j<8;j++) {
            arr[i] += (results[i]>>j) & 1;
        }
    }
    return arr;
}

function objectData(data) {
    var arr = rawData(data);
    var status = [];
    for(var port=0;port<4;port++) {
        status[port] = {
            'port': port+1,
            'connected': 1 == arr[0+9*port][4],
            'buttons': {
                'buttonA': 1 == arr[1+9*port][0],
                'buttonB': 1 == arr[1+9*port][1],
                'buttonX': 1 == arr[1+9*port][2],
                'buttonY': 1 == arr[1+9*port][3],
                'padUp': 1 ==  arr[1+9*port][7],
                'padDown': 1 == arr[1+9*port][6],
                'padLeft': 1 == arr[1+9*port][4],
                'padRight': 1 == arr[1+9*port][5],
                'buttonStart': 1 == arr[2+9*port][0],
                'buttonZ': 1 == arr[2+9*port][1],
                'buttonL': 1 == arr[2+9*port][3],
                'buttonR': 1 == arr[2+9*port][2]
            },
            'axes': {
                'mainStickHorizontal': (data[4+9*port]/128)-1,
                'mainStickVertical': (data[5+9*port]/128)-1,
                'cStickHorizontal': (data[6+9*port]/128)-1,
                'cStickVertical': (data[7+9*port]/128)-1,
                'triggerL': (data[8+9*port]/128)-1,
                'triggerR': (data[9+9*port]/128)-1
            },
            'rumble': false
        }
    }

    return status;
}

function checkRumble(adapter,controllers) {
    var iface = adapter.interface(0);
    var endpoint = iface.endpoint(ENDPOINT_OUT);
    var data = [0x11];

    for(var port=0;port<4;port++) {
        data[port+1] = controllers[port].rumble;
    }

    endpoint.transfer(data,function(e) {
        if(e) {
            console.error(e);
        }
        return;
    })
}

module.exports = {readData,pollData,startAdapter,getAdaptersList,rawData,objectData,checkRumble};

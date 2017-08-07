var usb = require('usb');

var ENDPOINT_IN = 0x81
var ENDPOINT_OUT = 0x02

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function showListAdapters() {
    usbList = usb.getDeviceList();
    list = []
    for (var i=0;i<usbList.length;i++) {
        if(usbList[i].deviceDescriptor.idVendor === 1406 && usbList[i].deviceDescriptor.idProduct === 823)
            list.push(usbList[i]);
    }
    return list
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

function rawData(data) {
    var dataArray = [];
    for(var i=0;i<27;i++) {
        dataArray[i]='';
        for(var j=0;j<8;j++) {
            dataArray[i]+=(data[2]>>i)&1;
        }
    }
    console.log(dataArray);
}
module.exports = {readData,startAdapter,showListAdapters,rawData};

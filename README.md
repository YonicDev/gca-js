![gca-node logo][logo]

[![Build Status](https://travis-ci.org/YonicDev/gca-js.svg?branch=master)](https://travis-ci.org/YonicDev/gca-js) [![Build Status](https://ci.appveyor.com/api/projects/status/6oocja2ekd47a3pp?svg=true)](https://ci.appveyor.com/project/yonicstudios/gca-js)

gca-js is a redesign of the now deprecated [gca-node addon][1] which adds Nintendo&reg; Wii U GameCube&trade; Adapter native asynchronous and synchronous support for Node.js applications.
The entirety of gca-js API is written in JavaScript, removing the disadvantages of using gca-node, written in C++.

## Usage

### Installation
With Node.js installed into your system (either stable or latest), input this into the command line window while at your NodeJS project folder:

    npm install gca-js

### Configuration
When you plug the Nintendo&reg; Wii U GameCube&trade; Adapter  in your computer, it will not be able to be used unless you configure your operating system to provide access to the Adapter.

In gca-js 2.0.0, this will be heavily revamped, and developers will be able to automatize this process of configuration for consumer use.

#### Windows
Windows will fail to recognize the HID-like driver built in the kernel of the Adapter, so it must be replaced with a generic WinUSB driver.

Developers can use [gca-wincfg](https://github.com/YonicDev/gca-wincfg) to make an automatic driver installer within their game, but it's only supported for 64-bit versions of Windows.

> **NOTE:** From 2.0.0, gca-wincfg is an optional dependency of gca-js that is installed on Windows systems.

Gamers and consumers can run the sample script file within gca-wincfg with node to simply install it automatically, or use [Zadig](http://zadig.akeo.ie/downloads/zadig-2.3.exe) if they are running on a 32-bit Windows.

When using Zadig, select Options > List all devices. On the dropdown menu, select WUP-028. Finally, replace the built-in HidUsb driver with the WinUSB driver.

Additionally, the native dependencies have to be recompiled to be used in [Electron](https://github.com/electron/electron) or [Nw.js](https://github.com/nwjs/nw.js), as some of them will download prebuilt binaries not meant to be used in either of these runtimes, and will fail to load on Windows.

* **[Electron]:** Run [electron-rebuild](https://github.com/electron/electron-rebuild) with no arguments at your NodeJS project folder. If using `electron-prebuilt`, you must specify the version that matches the apm version that your prebuilt Electron uses.
* **[Nw.js]:** Use [nw-gyp](https://github.com/nwjs/nw-gyp), a fork of node-gyp, inside the [node-usb](https://github.com/tessel/node-usb) module folder.

#### Linux
udev will only give access to the adapter to the root user until a udev rule is applied.
1. Copy the `51-gcadapter.rules` file from the repository to the `/etc/udev/rules.d` directory.
2. Reload udev rules with the command `sudo udevadm control --reload-rules`.
3. Plug out and reinsert the adapter.

> **NOTE:** gca-js 2.0.0 will prompt an administrator access popup in order to perform these operations automatically.

#### mac OS
All HID devices (which includes the adapter) are intercepted by IOKit's HID driver. The adapter, not being designed for usage on computers, will not provide a valid report descriptor and IOKit will fail to communicate with the adapter.

Since May 2021, this can be easily solved with [secretkey's GC Adapter Driver](https://secretkeys.io/gcadapterdriver/) for versions of mac OS High Sierra (10.13) and newer, and is heavily recommended to install this new driver and remove the older ones.

There are two versions of that driver: A signed kext for versions 10.13 to 10.15, and an app that uses DriverKit instead of IOKit for versions 11 and newer. If you are using the app version, the app that runs the driver has to be running for the adapter to work. You can add it to the Login Item list so that it runs on startup.

The "overclocking" feature of this driver is supported, but discouraged.

> **WARNING:** kexts for older versions (e.g. SmashEnabler) of OS X exist. However, they are unsigned and will not load from OS X El Capitan (10.11) or newer. You may bypass it by disabling SIP, but this *will put your system at risk*. [More details about disabling SIP here](https://forums.dolphin-emu.org/Thread-os-x-gcn-adapter-kext-testers-wanted?pid=387495#pid387495).


### Code usage
gca-js can be used at any time by placing this line:

    var gca = require('gca-js');

It stores the accesible API into a variable so that you can call any of the available methods from there.

## API
The gca-js API is an *asynchronous* revision of the API used in [gca+][2], but it follows almost the same model as gca-node API version 2.0. The full API is included on the wiki.

## FAQ
  * **Does gca-js work with USB GameCube Controllers?**
     * No, it only supports adapters from the GameCube propietary connector to USB.
  * **Does gca-js support rumble?**
     * Yes, it supports sending rumble commands synchronously.
  * **Does gca-js support third party GameCube Controllers?**
     * Yes, although partially. Some extra functionalities (i.e. turbo mode, extra buttons), and a small number of third party controllers, will most likely not work due to the Wii U adapter's specifications.
  * **Will gca-js support third party GameCube USB Adapters?**
     * Soon we'll experiment with Mayflash's USB adapters.
  * **Will gca-js support connection with Game Boy Advance with GBA Link?**
     * No, since the Wii U adapter itself does not support connectivity with a Game Boy Advance.
  * **Is gca-js cross-platform?**
     * Yes. It supports Windows 7+, most Linux distributions, and Mac OS 10.13 (High Sierra) or newer, although each operating system has different configurations.
  * **Does gca-js support 32-bit platforms?**
     * Yes, it supports x86 architectures on all supported platforms.
  * **Why does gca-js use node-usb instead of node-hid?**
     * On Windows, when replacing the HID driver to the generic WinUSB one, the operating system will no longer recognize the adapter as an HID device, making it useless to be used on node-hid.
  * **[Windows] Why is it necessary to use just Zadig? Can't I just use [ElMassivo's USB GameCube Adapter][3] instead?**
     * *ElMassivo's USB GameCube Adapter must remain inactive while gca-node is running*, as it claims the only interface available of the adapter. Without any other free interfaces, gca-js is unable to use the adapter, and viceversa.
     * Also, ElMassivo's USB GameCube Adapter utilizes vJoy to virtualize the port, which has some disadvantages. Refer to the question below this one to get information about the disadvantages of using this.
     * However, you can install ElMassivo's USB GameCube Adapter and simply use Zadig, as it is a component of this program.
  * **Why is gca-js better than using vJoy?**
     * gca-js unlocks all the potential of the Wii U GameCube Adapter to be used on PC. vJoy just makes a virtualization of each of the four ports in the Adapter, just like any generic gamepad.
       * For this reason, GameCube controllers connected using ElMassivo's USB GameCube Adapter will not be able to support features such as rumble.
     * Attempting to use vJoy for web games is only possible with Firefox. Although Chromium and Chrome support the Adapter with the HTML5 Gamepad API, this support is incomplete and very buggy.

[logo]: http://i.imgur.com/ggbYe8v.png
[1]: https://github.com/yonicstudios/gca-node
[2]: https://github.com/yonicstudios/gca-plus
[3]: http://m4sv.com/page/wii-u-gcn-usb-driver

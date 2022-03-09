![gca-node logo][logo]

gca.js adds Nintendo&reg; Wii U GameCube&trade; Adapter (as well as Nintendo Switch's) native asynchronous and synchronous support for Node.js applications.
It uses a polyfill of the WebUSB API to interface with the adapter.

## Usage

This module can only be used in Node.js applications, such as desktop applications using Electron or Nw.js.

There is no existing cross-browser solution to provide the same level of capabilities on web applications, and with the current ecosystem regarding WebUSB and WebHID APIs, this has become increasingly unlikely.

### Installation
With Node.js installed into your system (either stable or latest), input this into the command line window in your Node.js project folder:

    npm install gca-js

### Configuration
When you plug the Nintendo&reg; Wii U GameCube&trade; Adapter in your computer, it will not be able to be used unless you configure your operating system to provide access to the Adapter.

#### Windows
Windows will fail to recognize the HID-like driver built in the kernel of the adapter, so it must be replaced with a generic WinUSB driver.

Developers can use [gca-wincfg](https://github.com/YonicDev/gca-wincfg) to make an automatic driver installer within their game, but it's only supported for 64-bit versions of Windows.

> **NOTE:** From 2.0.0, gca-wincfg is an optional dependency of gca.js that may be installed on Windows systems.
> 
> Additional dependencies for Linux and macOS may be made in the future.

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

#### mac OS
All HID devices (which includes the adapter) are intercepted by IOKit's HID driver. The adapter, not being designed for usage on computers, will not provide a valid report descriptor and IOKit will fail to communicate with the adapter.

Since May 2021, this can be easily solved with [secretkey's GC Adapter Driver](https://secretkeys.io/gcadapterdriver/) for versions of mac OS High Sierra (10.13) and newer, and is heavily recommended to install this new driver and remove the older ones.

There are two versions of that driver: A signed kext for versions 10.13 to 10.15, and an app that uses DriverKit instead of IOKit for versions 11 and newer. If you are using the app version, the app that runs the driver has to be running for the adapter to work. You can add it to the Login Item list so that it runs on startup.

The "overclocking" feature of this driver is supported, but discouraged.

> **WARNING:** kexts for older versions (e.g. SmashEnabler) of OS X exist. However, they are unsigned and will not load from OS X El Capitan (10.11) or newer. You may bypass it by disabling SIP, but this *will put your system at risk*. [More details about disabling SIP here](https://forums.dolphin-emu.org/Thread-os-x-gcn-adapter-kext-testers-wanted?pid=387495#pid387495).


### Code usage
gca.js can be used at any time by placing this line:

    var gca = require('gca-js');

It stores the accesible API into a variable so that you can call any of the available methods from there.

> **WARNING:** gca.js can only access the adapter in contexts where the Node.js runtime is accessible, although the processing of the obtained data can happen elsewhere.

There are working examples of using gca.js in the `examples` folder.

## API
The full API is included on Github Pages.

## FAQ
  * **Does gca.js work with USB GameCube Controllers?**
     * No, it only supports adapters from the GameCube propietary connector to USB.
  * **Does gca.js support rumble?**
     * Yes, it supports sending rumble commands synchronously.
  * **Does gca.js support third party GameCube Controllers?**
     * Yes, although partially. Some extra functionalities (i.e. turbo mode, extra buttons), and a small number of third party controllers, will most likely not work due to the adapter's specifications.
  * **Will gca.js support third party GameCube USB Adapters?**
     * Not as of now.
  * **Will gca.js support connection with Game Boy Advance with GBA Link?**
     * No, neither the Wii U nor Switch adapters support connectivity with a Game Boy Advance.
  * **Is gca.js cross-platform?**
     * Yes. It supports Windows 7+, most Linux distributions, and mac OS 10.13 (High Sierra) or newer, although each operating system has different configurations.
  * **Does gca.js support 32-bit platforms?**
     * Yes, it supports x86 architectures on all supported platforms, **although support will be dropped soon**.
  * **Why does gca.js use node-usb instead of node-hid?**
     * On Windows, when replacing the HID driver to the generic WinUSB one, the operating system will no longer recognize the adapter as an HID device, making it impossible to be used on node-hid.
     * On macOS, all existing kexts and the DriverKit driver only allow for a low level communication via USBKit, so it won't have the same capabilities than an HID device would have.
  * **Can't I just use WebUSB by itself?**
     * In theory, you *could* only use the WebUSB API (by calling `navigator.usb`). In practice, however, the only web browsers that support WebUSB natively (Chromium-based) block interaction with devices that are normally classified as HID devices despite the changes in the driver. This makes it impossible to support the GameCube adapters in Windows and mac OS.
     * The only ways to circumvent this issue apart from using gca.js is to use a custom-fitted Chromium browser or instance (e.g. Chromium Embedded Framework) that disables the class-filtering of USB devices, or creating a HID driver for adapter, which there are no plans to as of now.
     * In addition, Electron currently does not support the WebUSB API natively, so it cannot be configured for that specific purpose.
  * **[Windows] Why is it necessary to use just Zadig? Can't I just use [ElMassivo's USB GameCube Adapter][3] instead?**
     * *ElMassivo's USB GameCube Adapter must remain inactive while gca-node is running*, as it claims the only interface available of the adapter. Without any other free interfaces, gca.js is unable to use the adapter, and viceversa.
     * Also, ElMassivo's USB GameCube Adapter utilizes vJoy to virtualize the port, which has some disadvantages. Refer to the question below this one to get information about the disadvantages of using this.
     * However, you can install ElMassivo's USB GameCube Adapter and simply use Zadig, as it is a component of this program.
  * **Why is gca.js better than using vJoy?**
     * gca.js unlocks all the potential of the Wii U GameCube Adapter to be used on PC. vJoy just makes a virtualization of each of the four ports in the Adapter, just like any generic gamepad.
       * For this reason, GameCube controllers connected using ElMassivo's USB GameCube Adapter will not be able to support features such as rumble.
     * Attempting to use vJoy for web games is only possible with Firefox. Although Chromium and Chrome support the Adapter with the HTML5 Gamepad API, this support is incomplete and very buggy.

[logo]: http://i.imgur.com/ggbYe8v.png
[1]: https://github.com/yonicstudios/gca-node
[2]: https://github.com/yonicstudios/gca-plus
[3]: http://m4sv.com/page/wii-u-gcn-usb-driver

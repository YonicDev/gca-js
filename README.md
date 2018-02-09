![gca-node logo][logo]

[![Build Status](https://travis-ci.org/yonicstudios/gca-js.svg?branch=master)](https://travis-ci.org/yonicstudios/gca-js) [![Build Status](https://ci.appveyor.com/api/projects/status/6oocja2ekd47a3pp?svg=true)](https://ci.appveyor.com/project/yonicstudios/gca-js)

gca-js is a redesign of the now deprecated [gca-node addon][1] which adds Nintendo&reg; Wii U GameCube&trade; Adapter native asynchronous and synchronous support for Node.js applications.
The entirety of gca-js API is written in JavaScript, removing the disadvantages of using gca-node, written in C++.

## Usage

### Installation
With Node.js installed into your system (either stable or latest), input this into the command line window while at your NodeJS project folder:

    npm install gca-js

### Configuration
When you plug the Nintendo&reg; Wii U GameCube&trade; Adapter  in your computer, it will not be able to be used unless you configure your operating system to provide access to the Adapter.

In gca-js 1.2.0, developers will be able to automatize this process of configuration for consumer use.

#### Windows
Windows will fail to recognize the HID-like driver built in the kernel of the Adapter, so it must be replaced with a generic WinUSB driver.

Developers can use [gca-wincfg](https://github.com/YonicDev/gca-wincfg) to make an automatic driver installer within their game, but it's only supported for 64-bit versions of Windows. From 1.2.0, gca-wincfg is an optional dependency of gca-js.

Gamers and consumers can run the sample script file within gca-wincfg with node to simply install it automatically, or use [Zadig](http://zadig.akeo.ie/downloads/zadig-2.3.exe) if they are running on a 32-bit Windows.

When using Zadig, select Options > List all devices. On the dropdown menu, select WUP-028. Finally, replace the built-in HidUsb driver with the WinUSB driver.

#### Linux
udev will only give access to the adapter to the root user until a udev rule is applied.
1. Copy the `51-gcadapter.rules` file from the repository to the `/etc/udev/rules.d` directory. If there is a file with another number on the directory, change it to an unused number.
2. Reload udev rules with the command `sudo udevadm control --reload-rules`.
3. Plug out and reinsert the adapter.

#### mac OS
All HID devices (which includes the adapter) are intercepted by IOKit's HID driver. The adapter, not being designed for usage on computers, will not provide a valid report descriptor and IOKit will fail to communicate with the adapter. In order to solve this, a kext can be used for IOKit to ignore the adapter and permit a low-level communication.

This can be easily done with the SmashEnabler kernel extension, which can be installed from here:
* **[OS X El Capitan and newer](https://forums.dolphin-emu.org/attachment.php?aid=16638)**
* **[Prior to OS X El Capitan](https://forums.dolphin-emu.org/attachment.php?aid=16637)**

> **WARNING:** gca-js does not support OS X El Capitan and newer versions. The current version of the kext is unsigned and will not load on these versions. You may bypass it by disabling SIP, but this *will put your system at risk*. [More details about disabling SIP here](https://forums.dolphin-emu.org/Thread-os-x-gcn-adapter-kext-testers-wanted?pid=387495#pid387495).


### Code usage
gca-js can be used at any time by placing this line:

    var gca = require('gca-js');

It stores the accesible API into a variable so that you can call any of the available methods from there.

## API
The gca-js API is an *asynchronous* revision of the API used in [gca+][2], but it follows almost the same model as gca-node API version 2.0. The full API is included on the wiki.

## Main feautres
Since gca-js is written entirely in JavaScript, it doesn't directly rely on other sources like DLLs, and instead uses other NodeJS modules. This removes certain problems with gca-node, namely:

1. `node-gyp` isn't called at any time, making it much easier to install across platforms.
2. No more restraints from using `apm`. This means that gca-js is compatible with applications such as `electron`.
3. `gca-js` becomes asynchronous and doesn't require an extra thread to be executed.

## Issues
Major and critical issues with their workarounds will be posted here. The full list is at the Issues section.

### Windows fails to load the module in graphical applications
This seems to be an issue regarding how Node.js deals with the FFI protocols on Windows, so unfortunately it's an issue outside of gca-js.

However, a websocket can be used as a workaround for this issue.

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
     * No.
  * **Is gca-js cross-platform?**
     * Yes. It supports Windows 7+, most Linux distributions, and Mac OS before El Capitan (10.11), although each operating system has different configurations.
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

![gca-node logo][logo]

[![Build Status](https://travis-ci.org/yonicstudios/gca-js.svg?branch=master)](https://travis-ci.org/yonicstudios/gca-js) [![Build Status](https://ci.appveyor.com/api/projects/status/6oocja2ekd47a3pp?svg=true)](https://ci.appveyor.com/project/yonicstudios/gca-js)

gca-js is a redesign of the [gca-node addon][1] which adds Nintendo&reg; Wii U GameCube&trade; Adapter native asynchronous support for NodeJS applications.
The entirety of gca-js API is written in JavaScript, removing the disadvantages of using gca-node, written in C++.

## Usage

### Installation
With NodeJS installed into your system (either stable or latest), input this into the command line window while at your NodeJS project folder:

    npm install gca-js

### Configuration
When you plug the Nintendo&reg; Wii U GameCube&trade; Adapter  in your computer, it will not be able to be accessed unless you configure your operating system to provide access to the device.

In future releases, this configuration will be done automatically.

#### Windows
Windows will fail to recognize the driver built in the kernel of the Adapter, so it must be replaced with a generic WinUSB driver.
1. [Download Zadig](http://zadig.akeo.ie/downloads/zadig-2.3.exe) and open it.
2. When Zadig is prompted, select Options > List all devices.
3. On the dropdown menu, select WUP-028.
4. Replace the built-in HidUsb driver with the WinUSB driver.

#### Linux
udev will only give access to the adapter to the root user until a udev rule is applied.
1. Copy the `51-gcadapter.rules` file from the repository to the `/etc/udev/rules.d` directory. If there is a file with another number on the directory, change it to an unused number.
2. Reload udev rules with the command `sudo udevadm control --reload-rules`.
3. Plug out and reinsert the adapter.

#### OS X and macOS
All HID devices (which includes the adapter) are intercepted by IOKit's HID driver. The adapter, not being designed for usage on computers, will not provide a valid report descriptor and IOKit will fail to communicate with the adapter. In order to solve this, a kext can be used for IOKit to ignore the adapter and permit a low-level communication.

This can be easily done with [this installer](https://forums.dolphin-emu.org/attachment.php?aid=13495).

### Code usage
gca-js can be used at any time by placing this line:

    var gca = require('gca-js');

It stores the accesible API into a variable so that you can call any of the available methods from there.

## API
The gca-js API is an *asynchronous* revision of the API used in gca-node and its sister [gca+][2], but it follows almost the same model as gca-node API version 2.0. The full API is included on the wiki.

## Better than gca-node
Since gca-js is written entirely in JavaScript, it doesn't directly rely on other sources like DLLs, and instead uses other NodeJS modules. This removes certain problems with gca-node, namely:

1. `node-gyp` isn't called at any time.
    * **NOTE:** One of the dependencies of gca-js, [node-usb](https://github.com/tessel/node-usb), is currently being built from source code by `node-gyp` due to certain issues involving the latest official release.
2. No more restraints from using `apm`. This means that gca-js is compatible with applications such as `electron`.
3. `gca-js` becomes asynchronous and doesn't require an extra thread to be executed.

## FAQ
  * **Does gca-js support rumble?**
     * Yes.
  * **Does gca-js support third party GameCube Controllers?**
     * Yes, although partially. The extra functionalities (i.e. turbo mode, extra buttons) will most likely be not supported due to the Wii U adapter's specifications.
  * **Will gca-js support third party GameCube USB Adapters?**
     * Soon we'll experiment with Mayflash's USB adapters.
  * **Will gca-js support connection with Game Boy Advance with GBA Link?**
     * No. Unfortunately, the specifications of the adapter make it incompatible with the GBA Link. Even if it were to be compatible, remotely interfacing with the Game Boy Advance is currently impossible.
  * **Is gca-js cross-platform?**
     * Yes. It supports Windows 7+, most Linux distributions, and Mac OS 10.8+, although each one have different configurations.
  * **Does gca-js support 32-bit platforms?**
     * Yes, it supports x86 architectures.
  * **Why does gca-js use node-usb instead of node-hid?**
     * On Windows, when replacing the HID driver to the generic WinUSB one, the operating system will no longer recognize the adapter as an HID device, making it useless to be used on node-hid.
  * **[Windows] Why is it necessary to use just Zadig? Can't I just use [ElMassivo's USB GameCube Adapter][3] instead?**
     * *ElMassivo's USB GameCube Adapter must remain inactive while gca-node is running*, as it claims the only interface available of the adapter. Without any other free interfaces, gca-js is unable to use the adapter, and viceversa.
     * Also, ElMassivo's USB GameCube Adapter utilizes vJoy to virtualize the port, which has some disadvantages. Refer to the question below this one to get information about the disadvantages of using this.
     * However, you can install ElMassivo's USB GameCube Adapter and not use it, since Zadig is a component of this program.
  * **Why is gca-js better than using vJoy?**
     * gca+ unlocks all potential of the Wii U GameCube Adapter to be used on PC. vJoy just makes a virtualization of each of the four ports in the Adapter, just like any generic gamepad.
       * For this reason, GameCube controllers connected using [ElMassivo's USB GameCube Adapter][3] will not support features such as rumble.
     * Attempting to use vJoy for web games will only be possible with Firefox. Although Chromium and Chrome support the Adapter with the HTML5 Gamepad API, this support is incomplete and very buggy.
       * For developing web games, we recommend [gca-js][1].

[logo]: http://i.imgur.com/ggbYe8v.png
[1]: https://github.com/yonicstudios/gca-node
[2]: https://github.com/yonicstudios/gca-plus
[3]: http://m4sv.com/page/wii-u-gcn-usb-driver

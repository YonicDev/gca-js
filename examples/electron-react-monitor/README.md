# GCA Monitor
This is a GUI example app that graphically displays the status of a GameCube Adapter.

It uses React for the user interface, and runs within Electron as desktop application, so it serves as an example 

## Usage

Download this folder, and run the following commands:

```bash
$ npm install  
$ npm run start # Initializes the React framework
$ npm run electron # Starts electron
```

## Important files
This is based from [Electron React Boilerplate](https://electron-react-boilerplate.js.org/) (ERB), so there are many files. To aid in understanding this example, here is a list of all the important files:

* `src/renderer` contains all the React user interface.
* `src/main` has the Electron main process code. The most important file is **preload.js**, which contains the operations of reading from the adapter.
* `release/app` contains a `package.json` that ERB uses to bundle GCA.JS in a different way from other JS modules.

The webpack configurations can also be found in the `.erb` folder for reference.

## Building a distributable
Just run the following command:

```
$ npm run package
```

It calls `electron-builder` internally to handle the entire bundling process.
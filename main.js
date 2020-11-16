const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let timerWindow;

//uncomment for productin environment
//process.env.NODE_ENV = 'production';

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width:300,
    height:490,
    x:2260,
    y:0,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  //Load the html for mainWIndow
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //Quit app when closing main window if needed
  mainWindow.on('closed', () => {
    app.quit();
  });
  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert Menu
  Menu.setApplicationMenu(mainMenu)
})

//creating the file navbar system
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label:'Quit',
        //shortcut for ctrl q. testing is its a mac or win/linux
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl + Q',

        click() {
          app.quit();
        }
      }

  ]
  }
]

//Dev tools when not in production
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle Devtools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl + I',
        //focusedwindow makes the devtools label menu show up on whatever focused window is used
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }

      },
      {
        //this allows the shortcut for reload on the menu
        role: 'reload'
      }
    ]
  })
}

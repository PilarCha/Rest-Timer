const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let timerWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
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
    subMenu: [
      {
        label:'Quit',
        //shsortcut to quit
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl + Q',
        click() {
          app.quit();
        }
      }
    ]
  }
]

//Add dev tools if not in production
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    subMenu: [
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

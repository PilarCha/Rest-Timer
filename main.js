const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let timerWindow;

//uncomment for productin environment
//process.env.NODE_ENV = 'production';
app.on('ready', () => {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;
  mainWindow = new BrowserWindow({
    width:300,
    height:400,
    x:width - 300,
    y:height - 400,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      //contextIsolation: true
    }
  });
  //Load the html for mainWindow
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
  })
  //Quit app when closing main window if needed
  mainWindow.on('closed', () => {
    app.quit();
  });
  //build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //Insert Menu
  Menu.setApplicationMenu(mainMenu)
  openTimerWindow();
})

//select timer window
openTimerWindow = () => {
  if(timerWindow != null) {
    timerWindow.focus()
    return;
  }
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;
  timerWindow = new BrowserWindow ({
    width:300,
    height: 370,
    x:width - 300,
    // x:1960,
    //y:height - 429,
    y: height - 400,
    title:'Select Time Limit',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      //contextIsolation: true
    }
  });

  //load html into window
  timerWindow.loadURL(url.format({
    pathname: path.join(__dirname,'views/timerWindow.html'),
    protocol:'file',
    slashes:true
  }));

  timerWindow.webContents.on('did-finish-load' , () => {
    timerWindow.show();
  })
  // garbage collection handle
  timerWindow.on('close', () => {
    timerWindow = null;
  })
  timerWindow.setAlwaysOnTop(true);
}

openCongratsWindow = () => {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;
  congratsWindow = new BrowserWindow ({
    title: 'Congrats you did it!',
    width:300,
    height:260,
    x:width - 300,
    y:height - 300,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  congratsWindow.loadURL(url.format({
    pathname:path.join(__dirname,'views/congratsWindow.html'),
    protocol:'file',
    slashes:true
  }));

  congratsWindow.webContents.on('did-finish-load' , () => {
    congratsWindow.show();
  })
  // garbage collection handle
  congratsWindow.on('close', () => {
    congratsWindow = null;
  })
  congratsWindow.setAlwaysOnTop(true);
}

resizeMainWindow = () => {
  //mainWindow.setSize(300,200);
  mainWindow.setBounds({x:2270, y:1050, width:300, height:360});

}

// event listeners
ipcMain.on('openCongratsWindow' , () => {
  openCongratsWindow();
  mainWindow.minimize();
})

ipcMain.on('topOrBottom', (e,show) => {
  mainWindow.setAlwaysOnTop(show, 'screen');
});

ipcMain.on('openTimerWindow', () => {
  openTimerWindow();
});

ipcMain.on('startBreak' , () => {
  congratsWindow.close();
  resizeMainWindow();
  // let seconds = 300;
  // debug
  let seconds = 3;
  mainWindow.webContents.send('selectedTime',seconds,true);
  mainWindow.setAlwaysOnTop(true);

})

ipcMain.on('selectedTime', function (e,id) {
  if(id == null) {
    alert("Please Select a time again. Did not go through.")
    openTimerWindow();
    return;
  }
  let seconds = (id/5) * 300
  mainWindow.webContents.send('selectedTime',seconds,false);
  timerWindow.close();
  mainWindow.setAlwaysOnTop(true);
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

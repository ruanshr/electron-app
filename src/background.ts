import { app, BrowserWindow } from 'electron'

app.whenReady().then(() => {
  const win = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // 关闭跨域检查
    }
  })
  win.webContents.openDevTools()
  const url = process.argv[2]
  if (url) {
    win.loadURL(url)
  } else {
    win.loadFile("index.html")
  }
})

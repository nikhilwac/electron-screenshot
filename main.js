const { app, BrowserWindow, desktopCapturer } = require("electron");
const fs = require("fs");
const path = require("path");

let win;

app.whenReady().then(() => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL("data:text/html,<h1>Screenshot App Running...</h1>");

  // Take screenshot every 10 minutes (600000 ms)
  captureScreen();
  setInterval(captureScreen, 10 * 60 * 1000);
});

function captureScreen() {
  desktopCapturer
    .getSources({ types: ["screen"] })
    .then(async (sources) => {
      if (sources.length === 0) return;

      const screenshot = sources[0]; // Taking first screen
      const base64Data = screenshot.thumbnail.toPNG();
      const screenshotPath = path.join(
        __dirname,
        `screenshot-${Date.now()}.png`
      );

      fs.writeFile(screenshotPath, base64Data, (err) => {
        if (err) console.error("Failed to save screenshot:", err);
        else console.log("Screenshot saved:", screenshotPath);
      });
    })
    .catch((err) => console.error("Error capturing screen:", err));
}

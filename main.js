const { app, BrowserWindow, desktopCapturer } = require("electron");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp"); // Import Sharp for image compression

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
  setInterval(captureScreen, 10 * 60 * 1000);
});

async function captureScreen() {
  try {
    const sources = await desktopCapturer.getSources({ types: ["screen"] });

    if (sources.length === 0) return;

    const pngPath = path.join(__dirname, `screenshot-${Date.now()}.png`);
    const avifPath = pngPath.replace(".png", ".avif");

    // Save screenshot as PNG
    fs.writeFileSync(pngPath, sources[0].thumbnail.toPNG());

    // Convert PNG to AVIF using sharp
    await sharp(pngPath)
      .toFormat("avif", { quality: 50 }) // Adjust quality (0-100)
      .toFile(avifPath);

    console.log("Saved:", avifPath);

    // Delete the temporary PNG file
    fs.unlinkSync(pngPath);
  } catch (err) {
    console.error("Error capturing or converting screen:", err);
  }
}

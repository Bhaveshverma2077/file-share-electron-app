import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import express from "express";
import fs from "fs";
import bonjourInit from "bonjour";

const bonjour = bonjourInit();

bonjour.publish({
  name: "file_sharing_app",
  type: "file_sharing_app",
  port: 5555,
});

const b = bonjour.find({ type: "file_sharing_app" }, (service) => {
  console.log(service);
});

const fetch = async (url: string, ...args: any) => {
  const nodeFetch = await import("node-fetch");
  return nodeFetch.default(url, ...args);
};

const server = express();

let listeningServer: any = null;

server.post("/", (req, res) => {
  const fileName = req.header("Content-Disposition")?.split('"')[1];
  const writeStream = fs.createWriteStream(
    path.join(__dirname, fileName ?? "file")
  );
  req.pipe(writeStream);
  writeStream.on("finish", () => {
    res.status(200).json({ message: "successful" });
  });
});

function createWindow() {
  const window = new BrowserWindow({
    height: 572,
    width: 850,
    resizable: false,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  window.webContents.openDevTools();
  window.loadURL("http://localhost:5173");
  // window.loadFile(path.join(__dirname, "../", "../", "dist", "index.html"));
}

ipcMain.handle("getNearByDevices", () => {
  console.log(b.services);

  return b.services;
});

ipcMain.handle(
  "sendFile",
  async (_, { ip, filePath }: { ip: string; filePath: string }) => {
    const filePathSegment = filePath.split("\\");
    const fileName = filePathSegment[filePathSegment.length - 1];
    const readStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    let chunkSize = 0;
    readStream.on("data", (chunk) => {
      chunkSize += chunk.length;
      console.log(Math.ceil((chunkSize / fileStats.size) * 100));

      BrowserWindow.getAllWindows()[0].webContents.send(
        "progress",
        Math.ceil((chunkSize / fileStats.size) * 100)
      );
      // BrowserWindow.getAllWindows()[1].webContents.send(
      //   "progress",
      //   Math.ceil((chunkSize / fileStats.size) * 100)
      // );
      // console.log(chunk.length);
    });
    await fetch(`http://${ip}:5355`, {
      method: "post",
      body: readStream,
      headers: new Headers({
        "Content-Disposition": `attachment; filename="${fileName}"`,
      }),
    }).then((res: any) => res.json());
  }
);

// fs.writeFileSync(path.join(__dirname, fileName ?? "file"), req.body);

ipcMain.handle("stopRecievingFile", async () => {
  listeningServer.close();
  listeningServer = null;
});

ipcMain.handle("recieveFile", async () => {
  if (listeningServer == null) listeningServer = server.listen(5355);
});

ipcMain.handle("", () => {});

app.whenReady().then(() => {
  createWindow();
  // createWindow();
});

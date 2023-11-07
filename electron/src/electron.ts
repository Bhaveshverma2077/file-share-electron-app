import { app, BrowserWindow, ipcMain } from "electron";

import fs from "node:fs";
import fsPromise from "node:fs/promises";
import path from "path";
import http from "http";
import { hostname } from "os";

import("node-fetch");
import fileupload from "express-fileupload";
import dgram from "dgram";
import { readFile, writeFileSync } from "node:original-fs";
import express from "express";
import fileUpload from "express-fileupload";
import { readFileSync } from "original-fs";

interface Device {
  ip: string;
  type: string;
  deviceName: string;
}

const devices: Array<Device> = [];
const udpServer = dgram.createSocket("udp4");

udpServer.on("message", (message, rinfo) => {
  const data = JSON.parse(message.toString());
  if (data.type !== "file_sharing_app") {
    return;
  }
  const deviceToAdd = devices.findIndex((device) => {
    return device.ip == rinfo.address;
  });
  if (deviceToAdd === -1) {
    devices.push({ ...data, ip: rinfo.address });
  }
});

udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`listening on address ${address.address} port ${address.port}`);
});

udpServer.bind(41234);
const mes = { type: "file_sharing_app", deviceName: hostname() };
const mesJson = JSON.stringify(mes);
setInterval(() => {
  const client = dgram.createSocket("udp4");
  client.send(mesJson, 0, mesJson.length, 41234, "192.168.1.255", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("sent");
    }
    client.close();
  });
}, 6000);

const fetch = async (url: string, ...args: any) => {
  const nodeFetch = await import("node-fetch");
  // return nodeFetch.default(url, ...args);
  return nodeFetch.default(url, ...args);
};

let listeningServer: any = null;

const server = http.createServer((req, res) => {
  const fileName = req.headers["content-disposition"]?.split('"')[1];
  const contentType = req.headers["content-type"];
  const contentLength = Number(req.headers["content-length"]);
  BrowserWindow.getAllWindows()[0].webContents.send("onIncommingFile", {
    file: { name: fileName, type: contentType, size: Number(contentLength) },
    ip: req.socket.remoteAddress,
  });
  console.log(`onIncommingFile:${fileName}`);

  ipcMain.handleOnce(
    `onIncommingFile:${fileName}`,
    (e, result: { accept: boolean }) => {
      if (!result.accept) {
        res.end("File Rejected");
        return;
      }
      const writeStream = fs.createWriteStream(
        path.join(app.getPath("downloads"), fileName ?? "file")
      );
      let chunkSize = { size: 0 };
      let speedSize = { size: 0 };

      const interval = setInterval(() => {
        console.log(chunkSize.size - speedSize.size);

        BrowserWindow.getAllWindows()[0].webContents.send("download-speed", {
          speed: chunkSize.size - speedSize.size,
          ip: req.socket.remoteAddress,
          fileName,
        });
        speedSize.size = chunkSize.size;
      }, 1000);

      req.on("data", (chunk) => {
        chunkSize.size += chunk.length;
        BrowserWindow.getAllWindows()[0].webContents.send("download-progress", {
          progress: Math.ceil((chunkSize.size / contentLength) * 100),
          ip: req.socket.remoteAddress,
          fileName,
        });
      });
      req.on("end", () => {
        BrowserWindow.getAllWindows()[0].webContents.send(
          "download-progress:completed",
          {
            ip: req.socket.remoteAddress,
            fileName,
          }
        );
      });
      req.on("close", () => {
        clearInterval(interval);
      });
      req.pipe(writeStream);
      writeStream.on("finish", () => {
        res.end("successful");
      });
    }
  );
});

// const dummyRequest = async () => {
//   const readStream = fs.createReadStream(
//     path.join(__dirname, "../", "../", "./public/dummy-file.txt")
//   );
//   await fetch(`http://${"localhost"}:5355`, {
//     method: "post",
//     body: readStream,
//     headers: new Headers({
//       "Content-Disposition": `attachment; filename="${"dummy-file.png"}"`,
//     }),
//   });
// };

function createWindow() {
  const window = new BrowserWindow({
    height: 572,
    width: 850,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  window.webContents.openDevTools();
  window.loadURL("http://localhost:5173");
  // window.loadFile(path.join(__dirname, "../", "../", "dist", "index.html"));
}

ipcMain.handle("getNearByDevices", () => {
  return devices;
});

ipcMain.handle(
  "sendFile",
  async (_, { ip, filePath }: { ip: string; filePath: string }) => {
    const filePathSegment = filePath.split("\\");
    const fileName = filePathSegment[filePathSegment.length - 1];
    const readStream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);

    let chunkSize = { size: 0 };
    let speedSize = { size: 0 };

    const interval = setInterval(() => {
      BrowserWindow.getAllWindows()[0].webContents.send("speed", {
        speed: chunkSize.size - speedSize.size,
        ip,
        filePath,
      });
      speedSize.size = chunkSize.size;
    }, 1000);

    readStream.on("data", (chunk) => {
      chunkSize.size += chunk.length;
      BrowserWindow.getAllWindows()[0].webContents.send("progress", {
        progress: Math.ceil((chunkSize.size / fileStats.size) * 100),
        ip,
        fileName,
      });
    });
    readStream.on("end", () => {
      BrowserWindow.getAllWindows()[0].webContents.send("progress:completed", {
        ip,
        fileName,
      });
    });
    readStream.on("close", () => {
      clearInterval(interval);
    });
    // const file = await fsPromise.readFile(filePath);
    const getImageType = (filename: string) => {
      if (
        fileName.endsWith("png") ||
        fileName.endsWith("jpg") ||
        fileName.endsWith("jpeg") ||
        fileName.endsWith("webp") ||
        fileName.endsWith("svg")
      ) {
        const fileNameSegments = fileName.split(".");
        return fileNameSegments[fileNameSegments.length - 1];
      }
      return null;
    };

    let contentType;
    if (getImageType(fileName) == null) {
      contentType = "application/octet-stream";
    } else {
      contentType = `image/${getImageType(fileName)}`;
    }
    await fetch(`http://${ip}:5355`, {
      method: "post",
      body: readStream,
      headers: new Headers({
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": contentType,
        "Content-Length": fileStats.size.toString(),
      }),
    });
  }
);

ipcMain.handle("stopRecievingFile", () => {
  listeningServer.close();
  listeningServer = null;
});

ipcMain.handle("recieveFile", () => {
  if (listeningServer == null) listeningServer = server.listen(5355);
});

app.whenReady().then(() => {
  createWindow();
});

import { app, BrowserWindow, ipcMain } from "electron";

import fs from "node:fs";
import path from "path";
import http from "http";
import { hostname } from "os";

// import bleno from "bleno";
import bonjourInit from "bonjour";
import dgram from "dgram";

interface Device {
  // addresses: Array<string>;
  ip: string;
  type: string;
  deviceName: string;
  // name: string;
  // port: number;
  // [value: string]: any;
}

const devices: Array<Device> = [];
const udpServer = dgram.createSocket("udp4");

udpServer.on("message", (message, rinfo) => {
  const data = JSON.parse(message.toString());
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

// noble.on("stateChange", (state) => {
//   if (state === "poweredOn") {
//     noble.startScanning();
//     return;
//   }
//   noble.stopScanning();
// });

// noble.on("discover", (peripheral) => {
//   console.log(peripheral);
// });

// bleno.on("stateChange", (state) => {
//   console.log(state);
// });

// const bonjour = bonjourInit();

// bonjour.publish({
//   name: "file_sharing_app_x",
//   type: "file_sharing_app_x",
//   txt: { deviceName: hostname() },
//   port: 5555,
// });

// const b = bonjour.find({ type: "file_sharing_app_x" }, (serices) => {
//   console.log(serices);
// });

// bonjour.find({ type: "file_sharing_app_x" }, (serices) => {
//   console.log(serices);
// });

const fetch = async (url: string, ...args: any) => {
  const nodeFetch = await import("node-fetch");
  return nodeFetch.default(url, ...args);
};

let listeningServer: any = null;

// setTimeout(() => {
//   console.log("run");

//   fetch("http://255.255.255.255:5355", {
//     method: "post",
//     body: JSON.stringify({ test: "working" }),
//   });
// }, 8000);

const server = http.createServer((req, res) => {
  // console.log("reqreqreq");

  const fileName = req.headers["content-disposition"]?.split('"')[1];
  const writeStream = fs.createWriteStream(
    path.join(app.getPath("downloads"), fileName ?? "file")
  );
  req.pipe(writeStream);
  writeStream.on("finish", () => {
    res.end("successful");
  });
});

const dummyRequest = async () => {
  const readStream = fs.createReadStream(
    path.join(__dirname, "../", "../", "./public/dummy-file.txt")
  );
  await fetch(`http://${"localhost"}:5355`, {
    method: "post",
    body: readStream,
    headers: new Headers({
      "Content-Disposition": `attachment; filename="${"dummy-file.png"}"`,
    }),
  });
};

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
  // return b.services;
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

      BrowserWindow.getAllWindows()[0].webContents.send(
        "progress",
        Math.ceil((chunkSize.size / fileStats.size) * 100)
      );
    });
    readStream.on("close", () => {
      clearInterval(interval);
    });

    await fetch(`http://${ip}:5355`, {
      method: "post",
      body: readStream,
      headers: new Headers({
        "Content-Disposition": `attachment; filename="${fileName}"`,
      }),
    });
  }
);

ipcMain.handle("stopRecievingFile", () => {
  listeningServer.close();
  listeningServer = null;
});

ipcMain.handle("recieveFile", () => {
  if (listeningServer == null)
    listeningServer = server.listen(5355, dummyRequest);
});

app.whenReady().then(() => {
  createWindow();
});

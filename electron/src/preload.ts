import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getNearByDevices: () => {
    return ipcRenderer.invoke("getNearByDevices");
  },
  sendFile: (ip: string, filePath: string) => {
    ipcRenderer.invoke("sendFile", { ip, filePath });
  },
  recieveFile: () => {
    ipcRenderer.invoke("recieveFile");
  },
  stopRecievingFile: () => {
    ipcRenderer.invoke("stopRecievingFile");
  },
  onSendFileCompleted: (callback: () => any) => {
    ipcRenderer.on("onSendFileCompleted", callback);
  },
  onRecieveFileCompleted: (callback: () => any) => {
    ipcRenderer.on("onRecieveFileCompleted", callback);
  },

  onIncommingFile: (
    callback: (
      file: { name: string; type: string; size: number },
      ip: string
    ) => any
  ) => {
    ipcRenderer.on(
      "onIncommingFile",
      (
        _: any,
        file: { name: string; type: string; size: number },
        ip: string
      ) => callback(file, ip)
    );
  },
  sendIncommingFileResponse: (fileName: string, accept: boolean) => {
    ipcRenderer.invoke(`onIncommingFile:${fileName}`, { accept });
  },

  onProgress: (
    callback: (progressData: {
      progress: number;
      ip: string;
      fileName: string;
    }) => any
  ) => {
    ipcRenderer.on(
      "progress",
      (
        _: any,
        progressData: {
          progress: number;
          ip: string;
          fileName: string;
        }
      ) => callback(progressData)
    );
  },
  onSendCompleted: (
    callback: (progressData: { ip: string; fileName: string }) => any
  ) => {
    ipcRenderer.on(
      "progress:completed",
      (_: any, progressData: { ip: string; fileName: string }) =>
        callback(progressData)
    );
  },
  onSpeed: (
    callback: (speedData: {
      speed: number;
      ip: string;
      filePath: string;
    }) => any
  ) => {
    ipcRenderer.on(
      "speed",
      (_: any, speedData: { speed: number; ip: string; filePath: string }) =>
        callback(speedData)
    );
  },
  onDownloadProgress: (
    callback: (progressData: {
      progress: number;
      ip: string;
      fileName: string;
    }) => any
  ) => {
    ipcRenderer.on(
      "download-progress",
      (
        _: any,
        progressData: { progress: number; ip: string; fileName: string }
      ) => callback(progressData)
    );
  },
  onDownloadCompleted: (
    callback: (progressData: { ip: string; fileName: string }) => any
  ) => {
    ipcRenderer.on(
      "download-progress:completed",
      (_: any, progressData: { ip: string; fileName: string }) =>
        callback(progressData)
    );
  },
  onDownloadSpeed: (
    callback: (speedData: {
      speed: number;
      ip: string;
      fileName: string;
    }) => any
  ) => {
    ipcRenderer.on(
      "download-speed",
      (_: any, speedData: { speed: number; ip: string; fileName: string }) => {
        console.log(speedData);

        return callback(speedData);
      }
    );
  },
});

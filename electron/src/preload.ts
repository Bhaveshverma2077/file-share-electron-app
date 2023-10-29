import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getNearByDevices: () => {
    ipcRenderer.invoke("getNearByDevices");
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
});

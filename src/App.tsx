import { useState } from "react";
import "./App.css";
declare global {
  interface Window {
    api: {
      getNearByDevices: () => any;
      sendFile: (ip: string, filePath: string) => any;
      recieveFile: () => any;
      stopRecievingFile: () => any;
      onSendFileCompleted: () => any;
      onRecieveFileCompleted: () => any;
    };
  }
}

const handleShowNearByDevices = () => {
  window.api.getNearByDevices();
};

const handleSendFile = (ip: string, filePath: string) => {
  window.api.sendFile(ip, filePath);
};
const handleRecieveFile = () => {
  window.api.recieveFile();
};

const handleStopRecievingFile = () => {
  window.api.stopRecievingFile();
};

function App() {
  const [ip, setIp] = useState("");
  const [filePath, setFilePath] = useState<null | string>(null);
  console.log(filePath);

  return (
    <>
      <h3>File Share</h3>
      <h1>Welcome</h1>
      <input
        value={ip}
        onChange={(e) => {
          setIp(e.target.value);
        }}
        type="text"
      />
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files != null) setFilePath(e.target.files[0].path);
        }}
        name="file"
      />
      <button onClick={handleShowNearByDevices}>Show Near By Devies</button>
      <button onClick={() => filePath != null && handleSendFile(ip, filePath)}>
        Send File
      </button>
      <button onClick={handleStopRecievingFile}>Stop Recieving File</button>
      <button onClick={handleRecieveFile}>Recieve File</button>
    </>
  );
}

export default App;

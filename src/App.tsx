import { useContext, useState } from "react";
import "./App.css";
import { Button, Collapse, Switch } from "@mui/material";
import AllDevices from "./pages/AllDevices";
import { appContext } from "./main";
import Dropzone from "./pages/Dropzone";
import Files from "./pages/Files";
import RecieveFiles from "./pages/RecieveFIles";
import MenuItem from "./pages/MenuItem";
import ChevronDown from "./icons/ChevronDown";
import Drawer from "./pages/Drawer";
import FilesPage from "./pages/FIlesPage";
import NoDevices from "./pages/NoDevices";
import DownloadsPage from "./pages/DownloadsPage";
import DeveloperPage from "./pages/DeveloperPage";
declare global {
  interface Window {
    api: {
      getNearByDevices: () => Promise<Array<any>>;
      sendFile: (ip: string, filePath: string) => any;
      recieveFile: () => any;
      stopRecievingFile: () => any;
      onSendFileCompleted: () => any;
      onRecieveFileCompleted: () => any;
      onProgress: (callback: any) => any;
      onSpeed: (
        callback: (speedData: {
          speed: number;
          ip: string;
          filePath: "string";
        }) => any
      ) => any;
    };
  }
}

function App() {
  const { page } = useContext(appContext);

  return (
    <>
      <DeveloperPage></DeveloperPage>
      {/* <div className="app-container">
        <Drawer></Drawer>
        {page == "NoDevices" && <NoDevices></NoDevices>}
        {page == "Download" && <DownloadsPage></DownloadsPage>}
        {page == "Files" && <FilesPage></FilesPage>}
        {page == "RecieveFiles" && <RecieveFiles></RecieveFiles>}
      </div> */}
    </>
  );
}

export default App;

// const [progress, setProgress] = useState<null | number>(0);
//   useEffect(() => {
//     window.api.onProgress((progress: number) => {
//       setProgress(progress);
//     });
//   }, []);

// const handleShowNearByDevices = () => {
//   return window.api.getNearByDevices();
// };

// const handleSendFile = (ip: string, filePath: string) => {
//   window.api.sendFile(ip, filePath);
// };

{
  /* <h3>File Share</h3>
      <h1>Welcome</h1>
      <TextField
        color="primary"
        label="IP"
        sx={{ input: { color: "white" } }}
        value={ip}
        onChange={(e) => {
          setIp(e.target.value);
        }}
        inputProps={{ style: { color: "white" } }}
        type="text"
      />
      <TextField
        sx={{ input: { color: "white" } }}
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files != null) setFilePath(e.target.files[0].path);
        }}
        name="file"
      />
      <LinearProgress
        variant={"determinate"}
        value={progress ?? 0}
      ></LinearProgress>
      <div>
        <button onClick={handleShowNearByDevices}>Show Near By Devies</button>
      </div>
      <div>
        <button
          onClick={() => filePath != null && handleSendFile(ip, filePath)}
        >
          Send File
        </button>
      </div>
      <div>
        <button onClick={handleStopRecievingFile}>Stop Recieving File</button>
      </div>
      <div>
        <button onClick={handleRecieveFile}>Recieve File</button>
      </div> */
}

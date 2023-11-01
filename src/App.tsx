import { useContext } from "react";
import "./App.css";
import { Button } from "@mui/material";
import AllDevices from "./pages/AllDevices";
import { appContext } from "./main";
import FileSharePage from "./pages/FileSharePage";
import FileTile from "./components/FileTile";
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
    };
  }
}

function App() {
  const { findDevices, allDevices, selectedDevice } = useContext(appContext);

  return (
    <>
      <div className="app-container">
        <div className="drawer">
          <Button sx={{ marginLeft: "8px" }} variant="contained">
            Find Devices
          </Button>
          <div className="devices-container">
            <AllDevices></AllDevices>
          </div>
        </div>
        {allDevices.length == 0 && (
          <div className="content-cotainer">
            <p className="no-device-text"> No Devices Found</p>
            <Button onClick={findDevices}>Search For Devices</Button>
          </div>
        )}

        {/* {selectedDevice != null && <FileSharePage></FileSharePage>} */}

        <div className="file-container">
          <h2> Upload Files</h2>
          <FileTile
            fileName="vlc-123.376_ufuebXS56.exe"
            fileSizeInKb={1233445}
            imgUrl="https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUxfHxhYnN0cmFjdHxlbnwwfHwwfHx8MA%3D%3D"
          ></FileTile>
          <FileTile
            fileName="vlc-123.376_ufuebXS56.exe"
            fileSizeInKb={1233445}
            imgUrl="https://images.unsplash.com/photo-1532456745301-b2c645d8b80d?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTUxfHxhYnN0cmFjdHxlbnwwfHwwfHx8MA%3D%3D"
          ></FileTile>
        </div>
      </div>
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
// const handleRecieveFile = () => {
//   window.api.recieveFile();
// };

// const handleStopRecievingFile = () => {
//   window.api.stopRecievingFile();
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

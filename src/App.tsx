import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Button, Collapse, Switch, Snackbar, IconButton } from "@mui/material";
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
import CloseIcon from "./icons/CloseIcon";
import CheckIcon from "./icons/CheckIcon";
declare global {
  interface Window {
    api: {
      getNearByDevices: () => Promise<Array<any>>;
      sendFile: (ip: string, filePath: string) => any;
      recieveFile: () => any;
      stopRecievingFile: () => any;
      onSendFileCompleted: () => any;
      onRecieveFileCompleted: () => any;
      onDownloadSpeed: (
        callback: (speedData: {
          speed: number;
          ip: string;
          fileName: string;
        }) => any
      ) => any;
      onDownloadProgress: (
        callback: (progressData: {
          progress: number;
          ip: string;
          fileName: string;
        }) => any
      ) => any;
      onDownloadCompleted: (
        callback: (progressData: { ip: string; fileName: string }) => any
      ) => any;
      onSendCompleted: (
        callback: (progressData: { ip: string; fileName: string }) => any
      ) => any;
      onProgress: (
        callback: (progressData: {
          progress: number;
          ip: string;
          fileName: string;
        }) => any
      ) => any;
      onIncommingFile: (
        callback: (fileDetails: {
          file: { name: string; type: string; size: number };
          ip: string;
        }) => any
      ) => any;
      sendIncommingFileResponse: (fielName: string, accept: boolean) => any;
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
  const { page, snackbar, setSnackBar, addDownloadFile, setFileCompleted } =
    useContext(appContext);
  useEffect(() => {
    window.api.onIncommingFile(
      ({
        file,
        ip,
      }: {
        file: { name: string; type: string; size: number };
        ip: string;
      }) => {
        setSnackBar({
          text: `Incomming File: ${file.name}`,
          action: (
            <div className="snackbar-action-container">
              <div
                className="snackbar-icon-container container-red snackbar-icon-close"
                onClick={() => {
                  window.api.sendIncommingFileResponse(file.name, false);
                  setSnackBar(null);
                }}
              >
                <CloseIcon></CloseIcon>
              </div>
              <div
                className="snackbar-icon-container container-green snackbar-icon-check"
                onClick={() => {
                  window.api.sendIncommingFileResponse(file.name, true);
                  addDownloadFile(file, ip);
                  window.api.onDownloadCompleted(
                    ({ ip, fileName }: { ip: string; fileName: string }) => {
                      setFileCompleted(true, ip, fileName);
                    }
                  );
                  setSnackBar(null);
                }}
              >
                <CheckIcon></CheckIcon>
              </div>
            </div>
          ),
        });
      }
    );
  }, []);
  console.log(snackbar);
  return (
    <>
      {/* <DeveloperPage></DeveloperPage> */}
      <div className="app-container">
        {snackbar && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={true}
            // onClose={}
            sx={{ "& .MuiPaper-root": { backgroundColor: "#583DA1" } }}
            message={snackbar?.text}
            action={snackbar?.action}
          />
        )}
        <Drawer></Drawer>
        {page == "NoDevices" && <NoDevices></NoDevices>}
        {page == "Download" && <DownloadsPage></DownloadsPage>}
        {page == "Files" && <FilesPage></FilesPage>}
        {page == "RecieveFiles" && <RecieveFiles></RecieveFiles>}
      </div>
    </>
  );
}

export default App;

// {/* <>
// <IconButton
//   sx={{
//     backgroundColor: "#D80032",
//     marginLeft: "8px",
//     marginRight: "6px",
//   }}
//   size="small"
//   aria-label="close"
//   color="inherit"
//   onClick={() => {}}
// >
//   <CloseIcon></CloseIcon>
//   {/* <Close fontSize="small" /> */}
// </IconButton>

//               <IconButton
//                 className="icon-container"
//                 sx={{
//                   backgroundColor: "#2b8a3e",
//                   marginLeft: "2px",
//                   marginRight: "6px",
//                 }}
//                 size="small"
//                 aria-label="close"
//                 color="inherit"
//                 onClick={() => {}}
//               >
//                 <CheckIcon></CheckIcon>
//                 {/* <Close fontSize="small" /> */}
//               </IconButton>
//             </> */}

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

import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       "& .MuiInputBase-root:hover": {
    //         "& .MuiOutlinedInput-notchedOutline": { borderColor: "purple" },
    //       },
    //       "& .MuiInputBase-root": {
    //         "& :hover": { borderColor: "purple" },
    //         "& .MuiOutlinedInput-notchedOutline": {
    //           borderColor: "blue",
    //         },
    //       },
    //     },
    //   },
    // },
  },
  palette: { primary: { main: "#583DA1" } },
});

interface Device {
  // addresses: Array<string>;
  ip: string;
  type: string;
  deviceName: string;
  // name: string;
  // port: number;
  // [value: string]: any;
}

export interface File {
  name: string;
  path: string;
  type: string;
  completed?: boolean;
  failed?: boolean;
  size: number;
  imgUrl?: string;
  progress?: number;
}

type Page = "RecieveFiles" | "Download" | "NoDevices" | "Files";

interface State {
  snackbar: null | { text: string; action: React.ReactNode };
  recieveFilesSwitch: boolean;
  selectedDeviceIndex: null | number;
  allDevices: Array<any>;
  selectedDevice: null | Device;
  isDevicesLoading: boolean;
  files: { [value: string]: Array<File> };
  downloadFiles: { [value: string]: Array<File> };
  page: Page;
}

const state: State = {
  snackbar: null,
  recieveFilesSwitch: false,
  isDevicesLoading: false,
  selectedDeviceIndex: null,
  selectedDevice: null,
  page: "NoDevices",
  allDevices: [],
  downloadFiles: {},
  files: {},
};

export const appContext = createContext({
  ...state,
  changeSelectedDeviceIndex: (index: number | null) => {},
  changeSelectedDevice: (device: Device | null) => {},
  findDevices: () => {},
  toggleRecieveFilesSwitch: () => {},
  setPage: (page: Page) => {},
  setFileCompleted: (download: boolean, ip: string, fileName: string) => {},
  addFile: (file: any) => {},
  addDownloadFile: (file: any, ip: string) => {},
  setSnackBar: (file: any) => {},
  // sendFile: (file: any) => {},
  removeFile: (file: any) => {},
  removeDownloadFile: (file: any, ip: string) => {},
  setFileFailed: (download: boolean, ip: string, fileName: string) => {},
  toggleDevicesLoading: (isLoading: boolean) => {},
});

const Provider = (props: { children: React.ReactNode }) => {
  const [appState, changeAppState] = useState(state);
  const changeSelectedDeviceIndex = (index: number | null) => {
    changeAppState((state) => {
      return { ...state, selectedDeviceIndex: index };
    });
  };
  const changeSelectedDevice = (device: Device | null) => {
    changeAppState((state) => {
      return { ...state, selectedDevice: device };
    });
  };
  const toggleRecieveFilesSwitch = () => {
    changeAppState((state) => ({
      ...state,
      recieveFilesSwitch: !state.recieveFilesSwitch,
    }));
  };
  const setSnackBar = (snackBar: { text: string; action: React.ReactNode }) => {
    changeAppState((state) => {
      return { ...state, snackbar: snackBar };
    });
  };
  const setFileCompleted = (
    download: boolean,
    ip: string,
    fileName: string
  ) => {
    let propertyName: "files" | "downloadFiles" = "files";
    if (download) {
      propertyName = "downloadFiles";
    }

    changeAppState((state) => {
      console.log(state);

      if (state[propertyName][ip] == null) {
        return { ...state };
      }
      const fileIndex = state[propertyName][ip].findIndex((file) => {
        return file.name === fileName;
      });
      let files = [...state[propertyName][ip]];
      if (fileIndex !== -1) {
        files[fileIndex].completed = true;
      }
      return {
        ...state,
        [propertyName]: { ...state[propertyName], [ip]: files },
      };
    });
  };
  const setFileFailed = (download: boolean, ip: string, fileName: string) => {
    let propertyName: "files" | "downloadFiles" = "files";
    if (download) {
      propertyName = "downloadFiles";
    }

    changeAppState((state) => {
      console.log(state);

      if (state[propertyName][ip] == null) {
        return { ...state };
      }
      const fileIndex = state[propertyName][ip].findIndex((file) => {
        return file.name === fileName;
      });
      let files = [...state[propertyName][ip]];
      if (fileIndex !== -1) {
        files[fileIndex].failed = true;
      }
      return {
        ...state,
        [propertyName]: { ...state[propertyName], [ip]: files },
      };
    });
  };
  const setPage = (page: Page) => {
    changeAppState((state) => {
      return { ...state, page };
    });
  };
  console.log(state.files);

  // const sendFile = (device: Device | null) => {
  //   changeAppState((state) => {
  //     return { ...state, selectedDevice: device };
  //   });
  // };
  const addFile = (f: File) => {
    // TODO: if in list dont add
    let file: File = f;
    if (f.type.startsWith("image")) {
      file.imgUrl = f.path;
    }
    changeAppState((state) => {
      if (state.files[state.selectedDevice!.ip] !== undefined) {
        const files = [...state.files[state.selectedDevice!.ip]];

        const index = files.findIndex((file: File) => file.name === f.name);
        if (index === -1) {
          files.push(file);
        }
        return {
          ...state,
          files: {
            ...state.files,
            [state.selectedDevice!.ip]: files,
          },
        };
      }
      return {
        ...state,
        files: { ...state.files, [state.selectedDevice!.ip]: [file] },
      };
    });
  };
  const removeFile = (file: File) => {
    const ip = appState.selectedDevice!.ip;
    changeAppState((state) => {
      const files = { ...state.files };
      const newFiles = files[ip!].filter((f) => {
        return f.path != file.path;
      });
      return { ...state, files: { ...state.files, [ip!]: newFiles } };
    });
  };

  const addDownloadFile = (f: File, ip: string) => {
    // TODO: if in list dont add
    let file: File = f;
    if (f.type.startsWith("image")) {
      file.imgUrl = f.path;
    }
    changeAppState((state) => {
      if (state.downloadFiles[ip] !== undefined) {
        const files = [...state.downloadFiles[ip]];
        const index = files.findIndex((file) => file.name === f.name);
        if (index === -1) {
          files.push(file);
        }
        return {
          ...state,
          downloadFiles: {
            ...state.downloadFiles,
            [ip]: files,
          },
        };
      }
      return {
        ...state,
        downloadFiles: { ...state.downloadFiles, [ip]: [file] },
      };
    });
  };
  const removeDownloadFile = (file: File, ip: string) => {
    changeAppState((state) => {
      const files = { ...state.files };
      const newFiles = files[ip!].filter((f) => {
        return f.path != file.path;
      });
      return { ...state, files: { ...state.files, [ip!]: newFiles } };
    });
  };
  // const removeFile = (file: any, ip: string) => {
  //   changeAppState((state) => {
  //     const files = { ...state.files };
  //     delete files[ip];
  //     return { ...state, files };
  //   });
  // };
  const findDevices = async () => {
    const allDevices = await window.api.getNearByDevices();
    changeAppState((stat) => {
      return { ...stat, allDevices };
    });
  };
  const toggleDevicesLoading = async (isLoading: boolean) => {
    const allDevices = await window.api.getNearByDevices();
    changeAppState((stat) => {
      return { ...stat, isDevicesLoading: isLoading };
    });
  };
  return (
    <appContext.Provider
      value={{
        ...appState,
        setFileCompleted,
        setFileFailed,
        addDownloadFile,
        removeDownloadFile,
        setSnackBar,
        setPage,
        changeSelectedDeviceIndex,
        findDevices,
        toggleDevicesLoading,
        changeSelectedDevice,
        addFile,
        removeFile,
        toggleRecieveFilesSwitch,
      }}
    >
      {props.children}
    </appContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

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
  size: number;
  imgUrl?: string;
  progress?: number;
}

type Page = "RecieveFiles" | "Download" | "NoDevices" | "Files";

interface State {
  snackbar: null | { text: string; action: React.ReactNode };
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
  setPage: (page: Page) => {},
  addFile: (file: any) => {},
  addDownloadFile: (file: any, ip: string) => {},
  setSnackBar: (file: any) => {},
  // sendFile: (file: any) => {},
  removeFile: (file: any) => {},
  removeDownloadFile: (file: any, ip: string) => {},
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
  const setSnackBar = (snackBar: { text: string; action: React.ReactNode }) => {
    changeAppState((state) => {
      return { ...state, snackbar: snackBar };
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
        files.push(file);
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
      if (state.files[ip] !== undefined) {
        const files = [...state.files[ip]];
        files.push(file);
        return {
          ...state,
          files: {
            ...state.files,
            [ip]: files,
          },
        };
      }
      return {
        ...state,
        files: { ...state.files, [ip]: [file] },
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

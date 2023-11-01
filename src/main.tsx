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
  addresses: Array<string>;
  type: string;
  name: string;
  port: number;
  [value: string]: any;
}

interface File {
  name: string;
  progress: number;
}

interface State {
  selectedDeviceIndex: null | number;
  allDevices: Array<any>;
  selectedDevice: null | Device;
  isDevicesLoading: boolean;
  files: { [value: string]: Array<File> };
}

const state: State = {
  isDevicesLoading: false,
  selectedDeviceIndex: null,
  selectedDevice: null,
  allDevices: [],
  files: {},
};

export const appContext = createContext({
  ...state,
  changeSelectedDeviceIndex: (index: number | null) => {},
  changeSelectedDevice: (device: Device | null) => {},
  findDevices: () => {},
  addFile: (file: any, ip: string) => {},
  removeFile: (file: any, ip: string) => {},
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
  const addFile = (file: any, ip: string) => {
    changeAppState((state) => {
      return { ...state, files: { ...state.files, [ip]: file } };
    });
  };
  const removeFile = (file: any, ip: string) => {
    changeAppState((state) => {
      const files = { ...state.files };
      delete files[ip];
      return { ...state, files };
    });
  };
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

import { Button } from "@mui/material";
import { useContext } from "react";
import { appContext } from "../main";

const NoDevices = () => {
  const { selectedDevice, files, allDevices, findDevices } =
    useContext(appContext);
  return (
    <>
      {allDevices.length == 0 && (
        <div className="content-cotainer">
          <p className="no-device-text"> No Devices Found</p>
          <Button onClick={findDevices}>Search For Devices</Button>
        </div>
      )}
    </>
  );
};

export default NoDevices;

import { useContext, useState } from "react";
import Device from "./Device";
import { appContext } from "../main";
import { Skeleton } from "@mui/material";

const AllDevies = () => {
  const {
    allDevices,
    isDevicesLoading,
    changeSelectedDevice,
    selectedDevice,
    setPage,
  } = useContext(appContext);
  const devices = allDevices.map((deviceInfo) => (
    <Device
      callback={() => {
        changeSelectedDevice(deviceInfo);
        setPage("Files");
      }}
      deviceName={deviceInfo.deviceName}
      key={deviceInfo.ip}
      ip={deviceInfo.ip}
      active={deviceInfo.ip === selectedDevice?.ip}
    ></Device>
  ));
  if (isDevicesLoading) {
    const skeletons = ["", "", "", "", ""].map(() => (
      <Skeleton
        sx={{
          backgroundColor: "rgba(255,255,255,0.05)",
          margin: "auto 8px 8px 8px",
        }}
        animation="pulse"
        variant="rounded"
        height={46}
      ></Skeleton>
    ));
    return <>{skeletons}</>;
  }

  if (devices.length == 0)
    return <h6 className="device-unavailable-text">No Devices available</h6>;
  return <>{devices}</>;
};

export default AllDevies;
